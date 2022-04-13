from rest_framework import filters, mixins, viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema

from .models import Notification
from .serializers import (
    NotificationSerializer,
    NotificationIdsSerializer,
    NotificationUnreadSerializer,
    NotificationGroupedSerializer,
    NotificationDatelessSerializer,
)


class NotificationViewSet(mixins.ListModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    """
    Lists and reads notifications
    """

    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['read', 'order_status']
    search_fields = ['title', 'content']

    def get_queryset(self):
        return Notification.objects.filter(receiver=self.request.user)

    @extend_schema(
        responses={200: NotificationGroupedSerializer},
    )
    @action(
        detail=False,
        methods=['get'],
        url_path='grouped',
        url_name='grouped'
    )
    def grouped(self, request):
        queryset = Notification.objects.filter(receiver=request.user)[:5]
        dates = list(set([item.created_at for item in queryset]))

        data = {'count': queryset.count()}
        results = []

        for date in sorted(dates, reverse=True):
            notifications = []
            query = {'created_at': date}

            for item in queryset:
                if item.created_at == date:
                    notifications.append(NotificationDatelessSerializer(item).data)

            query['notifications'] = notifications
            results.append(query)

        data['results'] = results

        return Response(data, status=status.HTTP_200_OK)

    @extend_schema(
        request=NotificationIdsSerializer,
        responses={200: NotificationSerializer},
    )
    @action(
        detail=False,
        methods=['post'],
        url_path='read',
        url_name='read'
    )
    def read(self, request):
        for notification_id in request.data['ids']:
            try:
                notification = Notification.objects.get(receiver=request.user, id=notification_id)
                notification.mark_as_read()
            except Notification.DoesNotExist:
                pass

        page = self.paginate_queryset(self.get_queryset())
        if page is not None:
            serializer = NotificationSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = NotificationSerializer(self.get_queryset(), many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        responses={200: NotificationUnreadSerializer},
    )
    @action(
        detail=False,
        methods=['get'],
        url_path='unread',
        url_name='unread'
    )
    def unread_count(self, request):
        unread_count = Notification.objects.filter(receiver=request.user, read=False).count()

        return Response({"unread": unread_count}, status=status.HTTP_200_OK)

