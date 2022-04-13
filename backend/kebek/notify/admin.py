import logging

from django.contrib.gis import admin

from .models import Notification

logger = logging.getLogger(__name__)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'receiver',
        'order_status',
        'title',
        'content',
        'read',
        'created_at',
    )
