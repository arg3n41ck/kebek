from django import forms
from django.contrib.gis import admin
from django.forms import CheckboxInput

from .models import ProductType, DeliveryType, PaymentType, Translation


class PaymentTypeForm(forms.ModelForm):
    class Meta:
        model = PaymentType
        widgets = {
            'natural_person': CheckboxInput(),
            'legal_person': CheckboxInput(),
        }
        fields = '__all__'


@admin.register(ProductType)
class ProductTypeAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title_ru',
    )
    search_fields = (
        'title_ru',
    )


@admin.register(DeliveryType)
class DeliveryTypeAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title_ru',
    )
    search_fields = (
        'title_ru',
    )


@admin.register(PaymentType)
class PaymentTypeAdmin(admin.ModelAdmin):
    form = PaymentTypeForm
    list_display = (
        'id',
        'title_ru',
        'natural_person',
        'legal_person',
    )


@admin.register(Translation)
class TranslationAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'const',
        'title_ru',
        'title_kk',
    )
    search_fields = (
        'const',
        'title_ru',
    )
