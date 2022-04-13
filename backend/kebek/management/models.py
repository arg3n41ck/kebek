from django.contrib.gis.db import models
from django.utils.translation import gettext_lazy as _


class ProductType(models.Model):
    title_ru = models.CharField(
        max_length=32,
        verbose_name=_('Russian title')
    )
    title_kk = models.CharField(
        max_length=32,
        verbose_name=_('Kazakh title')
    )

    def __str__(self):
        return self.title_ru

    class Meta:
        ordering = ['title_ru']
        verbose_name = _('Product type')
        verbose_name_plural = _('Product types')


class DeliveryType(models.Model):
    title_ru = models.CharField(
        max_length=32,
        verbose_name=_('Russian title')
    )
    title_kk = models.CharField(
        max_length=32,
        verbose_name=_('Kazakh title')
    )

    def __str__(self):
        return self.title_ru

    class Meta:
        ordering = ['title_ru']
        verbose_name = _('Delivery type')
        verbose_name_plural = _('Delivery types')


class PaymentType(models.Model):
    title_ru = models.CharField(
        max_length=32,
        verbose_name=_('Russian title')
    )
    title_kk = models.CharField(
        max_length=32,
        verbose_name=_('Kazakh title')
    )
    natural_person = models.BooleanField(
        default=True,
        verbose_name=_('Available for natural person')
    )
    legal_person = models.BooleanField(
        default=True,
        verbose_name=_('Available for legal person')
    )

    def __str__(self):
        return self.title_ru

    class Meta:
        ordering = ['title_ru']
        verbose_name = _('Payment type')
        verbose_name_plural = _('Payment types')


class Translation(models.Model):
    const = models.CharField(
        max_length=128,
        unique=True,
        verbose_name=_('Constant')
    )
    title_ru = models.CharField(
        max_length=255,
        verbose_name=_('Russian title')
    )
    title_kk = models.CharField(
        max_length=255,
        verbose_name=_('Kazakh title')
    )

    def __str__(self):
        return self.title_ru

    class Meta:
        ordering = ['title_ru']
        verbose_name = _('Translation')
        verbose_name_plural = _('Translations')
