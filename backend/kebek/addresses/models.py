from django.contrib.gis.db import models
from django.utils.translation import gettext_lazy as _


class RailwayStation(models.Model):
    title_ru = models.CharField(
        max_length=64,
        verbose_name=_('Russian title')
    )
    title_kk = models.CharField(
        max_length=64,
        verbose_name=_('Kazakh title')
    )
    description_ru = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name=_('Russian description')
    )
    description_kk = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name=_('Kazakh description')
    )
    code = models.CharField(
        max_length=8,
        null=True,
        blank=True,
        verbose_name=_('Code')
    )

    def __str__(self):
        return self.title_ru + ': ' + self.description_ru

    class Meta:
        ordering = ['title_ru']
        verbose_name = _('Railway station')
        verbose_name_plural = _('Railway stations')


class District(models.Model):
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
        verbose_name = _('District')
        verbose_name_plural = _('Districts')


class City(models.Model):
    district = models.ForeignKey(
        District,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='city',
        verbose_name=_('District')
    )
    title_ru = models.CharField(
        max_length=32,
        verbose_name=_('Russian title')
    )
    title_kk = models.CharField(
        max_length=32,
        verbose_name=_('Kazakh title')
    )

    def __str__(self):
        return self.district.title_ru + ': ' + self.title_ru

    class Meta:
        ordering = ['district', 'title_ru']
        verbose_name = _('City')
        verbose_name_plural = _('Cities')
