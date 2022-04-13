from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from ..elevators.models import Order, ORDER_STATUS_CHOICES, ACCEPTED


class Notification(models.Model):
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications',
        verbose_name=_('Receiver')
    )
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='orders',
        verbose_name=_('Order')
    )
    order_status = models.CharField(
        max_length=2,
        choices=ORDER_STATUS_CHOICES,
        default=ACCEPTED,
        verbose_name=_('Status')
    )
    title = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name=_('Title')
    )
    content = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_('Content')
    )
    read = models.BooleanField(
        default=False,
        verbose_name=_('Read')
    )
    created_at = models.DateField(
        auto_now_add=True,
        verbose_name=_('Created at')
    )
    in_history = models.BooleanField(
        default=True,
        verbose_name=_('Show in history')
    )

    def mark_as_read(self):
        self.read = True
        self.save()

    def save(self, *args, **kwargs):
        self.status = self.order.status

        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-id']
        verbose_name = _('Notification')
        verbose_name_plural = _('Notifications')
