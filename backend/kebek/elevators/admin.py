from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.gis import admin
from django.db.models import Sum
from django.http import HttpResponseRedirect
from django.urls import path
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _

from slugify import slugify

from ..notify.utils import create_notification
from .models import (
    Administrator,
    Accountant,
    Product,
    Delivery,
    Payment,
    Elevator,
    Document,
    Profit,
    Vehicle,
    Geolocation,
    Order,
    OrderItem,
    BILLED,
    PAID,
    PROXY_ADDED,
    FINISHED,
    CANCELLED,
)
from .tasks import revoke_task
from .utils import create_qr, get_wialon_locations


class InlineAdministratorAdmin(admin.TabularInline):
    model = Administrator
    extra = 1


class InlineAccountantAdmin(admin.TabularInline):
    model = Accountant
    extra = 1


class InlineOrderItemAdmin(admin.TabularInline):
    model = OrderItem
    extra = 1


class InlineDocumentAdmin(admin.TabularInline):
    model = Document
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'type',
        'price',
        'residue',
        'elevator',
        'status',
    )
    list_filter = (
        'type',
        'elevator',
        'status',
    )


@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'type',
        'title_ru',
        'price',
        'elevator',
        'status',
    )
    list_filter = (
        'type',
        'elevator',
        'status',
    )


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'type',
        'minutes',
        'elevator',
        'status',
    )
    list_filter = (
        'type',
        'elevator',
        'status',
    )


@admin.register(Elevator)
class ElevatorAdmin(admin.ModelAdmin):
    inlines = [InlineAdministratorAdmin, InlineAccountantAdmin]
    list_display = (
        'id',
        'number',
        'title_ru',
        'owner',
    )
    list_filter = (
        'owner',
    )
    search_fields = (
        'title_ru',
        'owner__username',
        'owner__last_name',
    )
    readonly_fields = (
        'number',
        'slug',
    )

    def save_model(self, request, obj, form, change):
        if change:
            obj.slug = slugify(obj.title_ru)

        super().save_model(request, obj, form, change)


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title',
        'elevator',
    )
    list_filter = (
        'elevator',
    )


@admin.register(Geolocation)
class GeolocationAdmin(admin.OSMGeoAdmin):
    list_display = (
        'id',
        'vehicle',
        'created_at',
    )
    list_filter = (
        'vehicle',
        'created_at',
    )
    readonly_fields = (
        'created_at',
    )
    default_lat = 6256619
    default_lon = 7470047
    default_zoom = 4
    modifiable = False
    change_list_template = 'admin/elevators/geolocation/change_list.html'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                'download-geolocations/',
                self.download_geolocations,
                name='download_geolocations',
            )
        ]
        return custom_urls + urls

    @method_decorator(staff_member_required)
    def download_geolocations(self, request):
        get_wialon_locations()

        self.message_user(request, _('Geolocations were just updated.'))
        return HttpResponseRedirect('../')

    download_geolocations.short_description = 'Download New Geolocation Data'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [InlineOrderItemAdmin, InlineDocumentAdmin]
    list_display = (
        'id',
        'number',
        'elevator',
        'get_products',
        'delivery',
        'payment',
        'client',
        'created_at',
        'updated_at',
        'status',
    )
    list_filter = (
        'elevator',
        'delivery__type',
        'payment__type',
        'status',
    )
    search_fields = (
        'client__username',
        'client__last_name',
    )
    readonly_fields = (
        'number',
    )

    def save_model(self, request, obj, form, change):
        if change:
            instance = self.model.objects.get(id=obj.id)

            if obj.status == BILLED and instance.status != BILLED:
                content = f'Выставлен счет для оплаты заказа №{obj.id}. Скачайте его в личном кабинете kebek.kz'
                title = 'Выставлен счет'

                create_notification(obj.client, obj, obj.status, title, content)

            elif obj.status == PAID and instance.status != PAID:
                create_qr(obj)

                content = f'Заказ №{obj.id} оплачен. Спасибо за использование системы Kebek!'
                title = 'Оплачен'

                create_notification(obj.client, obj, obj.status, title, content)

                payment = OrderItem.objects.filter(order=instance).aggregate(Sum('product_payment'))['product_payment__sum']
                Profit.objects.create(elevator=instance.elevator, profit=payment)

            elif obj.status == PROXY_ADDED and instance.status != PROXY_ADDED:
                content = f'К заказу №{obj.id} было добавлено доверенное лицо'
                title = 'Добавлено доверенное лицо'

                accountants = Accountant.objects.filter(elevator=obj.elevator)

                for accountant in accountants:
                    create_notification(accountant.accountant, obj, obj.status, title, content)

            elif obj.status == FINISHED and instance.status != FINISHED:
                items = OrderItem.objects.filter(order=obj)
                products = Product.objects.filter(id__in=items)

                for item in items:
                    for product in products:
                        if item.product == product:
                            product.residue -= item.amount
                            product.save()

                content = f'Заказ №{obj.id} получен'
                title = 'Получен'

                create_notification(obj.client, obj, obj.status, title, content)

            elif obj.status == CANCELLED and instance.status != CANCELLED:
                content = f'Заказ №{obj.id} отменен из-за отсутствия оплаты'
                title = 'Отменен'

                create_notification(obj.client, obj, obj.status, title, content)

        super().save_model(request, obj, form, change)

    def delete_model(self, request, obj):
        revoke_task(obj, 'elevators.payment_expired')

        super().delete_model(request, obj)

    def get_products(self, obj):
        items = OrderItem.objects.filter(order=obj.id)
        return ', '.join([item.product.type.title_ru for item in items])

    get_products.short_description = _('Products')
