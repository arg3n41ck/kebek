from rest_framework import serializers

from .models import Notification


class NotificationDatelessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = (
            'id',
            'title',
            'content',
            'read',
            'order_status',
        )


class NotificationSerializer(NotificationDatelessSerializer):
    class Meta(NotificationDatelessSerializer.Meta):
        fields = NotificationDatelessSerializer.Meta.fields + (
            'created_at',
        )


class NotificationGroupedSerializer(serializers.ModelSerializer):
    notifications = NotificationDatelessSerializer(read_only=True, many=True)

    class Meta:
        model = Notification
        fields = (
            'created_at',
            'notifications',
        )


class NotificationIdsSerializer(serializers.Serializer):
    ids = serializers.ListField(child=serializers.IntegerField())

    class Meta:
        fields = (
            'ids',
        )


class NotificationUnreadSerializer(serializers.Serializer):
    unread = serializers.IntegerField()

    class Meta:
        fields = (
            'unread',
        )
