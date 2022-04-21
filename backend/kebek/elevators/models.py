import django.utils.timezone as tz
import pytz
import uuid

from datetime import timedelta, datetime

from django.apps import apps
from django.conf import settings
from django.contrib.gis.db import models
from django.utils.translation import gettext_lazy as _

from phonenumber_field.modelfields import PhoneNumberField
from slugify import slugify

from ..addresses.models import City, RailwayStation
from ..management.models import ProductType, DeliveryType, PaymentType
from ..users.models import User, Address, Requisites
from .tasks import payment_expired
from .utils import compress

ACTIVE = 'AC'
ARCHIVED = 'AR'

STATUS_CHOICES = [
    (ACTIVE, _('Active')),
    (ARCHIVED, _('Archived'))
]

ACCEPTED = 'AD'
WAITING_FOR_PREPAYMENT = 'WP'
WAITING_FOR_SUPPLEMENT = 'WS'
BILLED = 'BD'
PREPAID = 'PP'
PAID = 'PD'
PROXY_ADDED = 'PA'
SHIPPED = 'SD'
DELIVERED = 'DD'
CANCELLED = 'CD'
FINISHED = 'FD'

ORDER_STATUS_CHOICES = [
    (ACCEPTED, _('Accepted')),
    (WAITING_FOR_PREPAYMENT, _('Waiting for prepayment')),
    (WAITING_FOR_SUPPLEMENT, _('Waiting for supplement')),
    (BILLED, _('Billed')),
    (PREPAID, _('Prepayment received')),
    (PAID, _('Paid')),
    (PROXY_ADDED, _('Proxy added')),
    (SHIPPED, _('Shipped')),
    (DELIVERED, _('Delivered')),
    (CANCELLED, _('Cancelled')),
    (FINISHED, _('Finished')),
]

PASS = 'PS'
WAYBILL = 'WB'
BILL = 'BL'

DOCUMENT_TYPE_CHOICES = [
    (PASS, _('Pass')),
    (WAYBILL, _('Waybill')),
    (BILL, _('Bill'))
]


class Elevator(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    number = models.CharField(
        max_length=2,
        unique=True,
        default='00',
        verbose_name=_('Number')
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owner',
        verbose_name=_('Owner')
    )
    title_ru = models.CharField(
        max_length=128,
        unique=True,
        verbose_name=_('Russian title')
    )
    title_kk = models.CharField(
        max_length=128,
        unique=True,
        verbose_name=_('Kazakh title')
    )
    description_ru = models.TextField(
        null=True,
        blank=True,
        verbose_name=_('Russian description')
    )
    description_kk = models.TextField(
        null=True,
        blank=True,
        verbose_name=_('Kazakh description')
    )
    logo = models.ImageField(
        upload_to='images/logos/',
        null=True,
        blank=True,
        verbose_name=_('Logo')
    )
    address_ru = models.CharField(
        max_length=255,
        verbose_name=_('Russian address')
    )
    address_kk = models.CharField(
        max_length=255,
        verbose_name=_('Kazakh address')
    )
    phone_number = PhoneNumberField(
        verbose_name=_('Phone Number')
    )
    email = models.EmailField(
        null=True,
        blank=True,
        verbose_name=_('Email')
    )
    website = models.URLField(
        max_length=300,
        null=True,
        blank=True,
        verbose_name=_('Website')
    )
    bin = models.CharField(
        max_length=80,
        null=True,
        blank=True,
        verbose_name=_('BIN')
    )
    bik = models.CharField(
        max_length=80,
        null=True,
        blank=True,
        verbose_name=_('BIK')
    )
    checking_account = models.CharField(
        max_length=128,
        null=True,
        blank=True,
        verbose_name=_('Checking account')
    )
    cities = models.ManyToManyField(
        City,
        related_name='cities',
        verbose_name=_('Cities')
    )
    railway_station = models.ForeignKey(
        RailwayStation,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='elevator',
        verbose_name=_('Railway station')
    )
    slug = models.SlugField(
        blank=True,
        verbose_name=_('Slug')
    )

    def __str__(self):
        return self.title_ru

    def save(self, *args, **kwargs):
        self.slug = slugify(self.title_ru)

        if self.logo:
            new_image = compress(self.logo)
            self.logo = new_image

        if not self.pk:
            model = apps.get_model('elevators', 'Elevator')

            try:
                last_elevator = model.objects.latest('number')

                if last_elevator == self:
                    self.number = last_elevator.number
                else:
                    self.number = f'{(int(last_elevator.number) + 1):02d}'
            except model.DoesNotExist:
                self.number = '01'

        super().save(*args, **kwargs)

    class Meta:
        ordering = ['title_ru']
        verbose_name = _('Elevator')
        verbose_name_plural = _('Elevators')


class Administrator(models.Model):
    elevator = models.ForeignKey(
        Elevator,
        on_delete=models.CASCADE,
        related_name='elevator_administrator',
    )
    administrator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='administrator',
    )


class Accountant(models.Model):
    elevator = models.ForeignKey(
        Elevator,
        on_delete=models.CASCADE,
        related_name='elevator_accountant',
    )
    accountant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='accountant',
    )


class Product(models.Model):
    elevator = models.ForeignKey(
        Elevator,
        on_delete=models.CASCADE,
        related_name='product_elevator',
        verbose_name=_('Elevator')
    )
    set_number = models.CharField(
        max_length=128,
        verbose_name=_('Set number')
    )
    type = models.ForeignKey(
        ProductType,
        on_delete=models.PROTECT,
        related_name='product_type',
        verbose_name=_('Type')
    )
    price = models.PositiveIntegerField(
        verbose_name=_('Price')
    )
    min_limit = models.PositiveIntegerField(
        verbose_name=_('Minimum limit')
    )
    max_limit = models.PositiveIntegerField(
        verbose_name=_('Maximum limit')
    )
    residue = models.PositiveIntegerField(
        verbose_name=_('Residue')
    )
    image = models.ImageField(
        upload_to='images/products/',
        null=True,
        blank=True,
        verbose_name=_('Image')
    )
    status = models.CharField(
        max_length=2,
        choices=STATUS_CHOICES,
        default=ACTIVE,
        verbose_name=_('Status')
    )
    display = models.BooleanField(
        default=False,
        verbose_name=_('Display on landing')
    )

    def __str__(self):
        return self.type.title_ru

    def save(self, *args, **kwargs):
        if self.image:
            new_image = compress(self.image)
            self.image = new_image

        super().save(*args, **kwargs)

    class Meta:
        unique_together = ['elevator', 'type']
        ordering = ['-id']
        verbose_name = _('Product')
        verbose_name_plural = _('Products')


class Delivery(models.Model):
    elevator = models.ForeignKey(
        Elevator,
        on_delete=models.CASCADE,
        related_name='delivery_elevator',
        verbose_name=_('Elevator')
    )
    type = models.ForeignKey(
        DeliveryType,
        on_delete=models.PROTECT,
        related_name='delivery_type',
        verbose_name=_('Type')
    )
    title_ru = models.CharField(
        max_length=128,
        null=True,
        blank=True,
        verbose_name=_('Russian title')
    )
    title_kk = models.CharField(
        max_length=128,
        null=True,
        blank=True,
        verbose_name=_('Kazakh title')
    )
    price = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Price')
    )
    status = models.CharField(
        max_length=2,
        choices=STATUS_CHOICES,
        default=ACTIVE,
        verbose_name=_('Status')
    )

    def __str__(self):
        return self.type.title_ru

    class Meta:
        unique_together = ['elevator', 'type', 'title_ru']
        ordering = ['elevator__title_ru']
        verbose_name = _('Delivery')
        verbose_name_plural = _('Deliveries')


class Payment(models.Model):
    elevator = models.ForeignKey(
        Elevator,
        on_delete=models.CASCADE,
        related_name='payment_elevator',
        verbose_name=_('Elevator')
    )
    type = models.ForeignKey(
        PaymentType,
        on_delete=models.PROTECT,
        related_name='payment_type',
        verbose_name=_('Type')
    )
    minutes = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Minutes until cancellation')
    )
    status = models.CharField(
        max_length=2,
        choices=STATUS_CHOICES,
        default=ACTIVE,
        verbose_name=_('Status')
    )

    def __str__(self):
        return self.type.title_ru

    class Meta:
        unique_together = ['elevator', 'type']
        ordering = ['elevator__title_ru']
        verbose_name = _('Payment')
        verbose_name_plural = _('Payments')


class Vehicle(models.Model):
    elevator = models.ForeignKey(
        Elevator,
        on_delete=models.CASCADE,
        related_name='vehicle_elevator',
        verbose_name=_('Elevator')
    )
    title = models.CharField(
        max_length=128,
        verbose_name=_('Title')
    )
    wialon_id = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name=_('Wialon ID')
    )

    def __str__(self):
        return self.title

    class Meta:
        unique_together = ['elevator', 'wialon_id']
        ordering = ['elevator__title_ru']
        verbose_name = _('Vehicle')
        verbose_name_plural = _('Vehicles')


class Geolocation(models.Model):
    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name='geolocation',
        verbose_name=_('Vehicle'),
    )
    position = models.PointField(
        srid=3857,
        verbose_name=_('Position')
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Created at')
    )

    def __str__(self):
        return self.vehicle.title + ': ' + str(self.created_at)

    class Meta:
        ordering = ['-created_at']
        verbose_name = _('Geolocation')
        verbose_name_plural = _('Geolocations')


class Order(models.Model):
    number = models.CharField(
        max_length=9,
        unique=True,
        default='00-000000',
        verbose_name=_('Number')
    )
    client = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='order_client',
        verbose_name=_('Client')
    )
    elevator = models.ForeignKey(
        Elevator,
        on_delete=models.PROTECT,
        related_name='order_elevator',
        verbose_name=_('Elevator')
    )
    delivery = models.ForeignKey(
        Delivery,
        on_delete=models.PROTECT,
        related_name='order_delivery',
        verbose_name=_('Delivery')
    )
    payment = models.ForeignKey(
        Payment,
        on_delete=models.PROTECT,
        related_name='order_payment',
        verbose_name=_('Payment')
    )
    railway_station = models.ForeignKey(
        RailwayStation,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='order_railway_station',
        verbose_name=_('Railway station')
    )
    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='order_vehicle',
        verbose_name=_('Vehicle')
    )
    city = models.ForeignKey(
        City,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='order_address',
        verbose_name=_('City')
    )
    address = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name=_('Address')
    )
    title = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name=_('Title')
    )
    bin = models.CharField(
        max_length=80,
        null=True,
        blank=True,
        verbose_name=_('BIN')
    )
    bik = models.CharField(
        max_length=80,
        null=True,
        blank=True,
        verbose_name=_('BIK')
    )
    checking_account = models.CharField(
        max_length=128,
        null=True,
        blank=True,
        verbose_name=_('Checking account')
    )
    delivery_payment = models.PositiveIntegerField(
        verbose_name=_('Delivery payment')
    )
    pre_payment = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name=_('Prepayment')
    )
    proxy_fullname = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name=_('Proxy fullname')
    )
    proxy_number = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name=_('Proxy number')
    )
    proxy_start_date = models.DateField(
        null=True,
        blank=True,
        verbose_name=_('Proxy start date')
    )
    proxy_end_date = models.DateField(
        null=True,
        blank=True,
        verbose_name=_('Proxy end date')
    )
    status = models.CharField(
        max_length=2,
        choices=ORDER_STATUS_CHOICES,
        default=ACCEPTED,
        verbose_name=_('Status')
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Created at')
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Updated at')
    )

    def schedule_payment_expiration(self):
        minutes = Payment.objects.get(elevator=self.elevator, type=self.payment.type).minutes

        payment_expired.apply_async(
            eta=tz.make_aware(datetime.now(), pytz.timezone('Asia/Almaty')) + timedelta(minutes=minutes),
            kwargs={'order_pk': self.pk}
        )

    def __str__(self):
        return str(self.pk)

    def save(self, *args, **kwargs):
        if not self.pk:
            model = apps.get_model('elevators', 'Order')

            try:
                last_order = model.objects.filter(elevator=self.elevator).latest('number')

                if last_order == self:
                    self.number = last_order.number
                else:
                    self.number = self.elevator.number + '-' + f'{(int(last_order.number.split("-")[1]) + 1):06d}'

            except model.DoesNotExist:
                self.number = self.elevator.number + '-000001'

        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']
        verbose_name = _('Order')
        verbose_name_plural = _('Orders')


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name=_('Order')
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name='order_item',
        verbose_name=_('Product')
    )
    amount = models.PositiveIntegerField(
        verbose_name=_('Amount')
    )
    product_payment = models.PositiveIntegerField(
        verbose_name=_('Product payment')
    )

    def __str__(self):
        return self.product.type.title_ru

    class Meta:
        unique_together = ['order', 'product']
        verbose_name = _('Order item')
        verbose_name_plural = _('Order items')


class Document(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='documents',
        verbose_name=_('Order')
    )
    type = models.CharField(
        max_length=2,
        choices=DOCUMENT_TYPE_CHOICES,
        default=PASS,
        verbose_name=_('Type')
    )
    document = models.FileField(
        upload_to='documents/',
        verbose_name=_('Document')
    )

    def __str__(self):
        return str(self.order.id) + ': ' + self.get_type_display()

    class Meta:
        verbose_name = _('Document')
        verbose_name_plural = _('Documents')


class Profit(models.Model):
    elevator = models.ForeignKey(
        Elevator,
        on_delete=models.CASCADE,
        related_name='elevator_profit',
        verbose_name=_('Elevator')
    )
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='order_profit',
        verbose_name=_('Order')
    )
    profit = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Profit')
    )
    created_at = models.DateField(
        auto_now_add=True,
        verbose_name=_('Created at')
    )
