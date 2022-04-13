import json

from django.http import HttpResponse

from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny

from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema

from .models import ProductType, DeliveryType, PaymentType, Translation
from .serializers import ProductTypeSerializer, DeliveryTypeSerializer, PaymentTypeSerializer, TranslationSerializer


class ProductTypeViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    Lists product types
    """

    permission_classes = [AllowAny]
    queryset = ProductType.objects.all()
    serializer_class = ProductTypeSerializer


class DeliveryTypeViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    Lists delivery types
    """

    permission_classes = [AllowAny]
    queryset = DeliveryType.objects.all()
    serializer_class = DeliveryTypeSerializer


class PaymentTypeViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    Lists payment types
    """

    permission_classes = [AllowAny]
    queryset = PaymentType.objects.all()
    serializer_class = PaymentTypeSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['natural_person', 'legal_person']


class TranslationViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    Lists translations
    """

    permission_classes = [AllowAny]
    serializer_class = TranslationSerializer
    queryset = Translation.objects.all()

    @extend_schema(
        responses={200: TranslationSerializer},
    )
    @action(
        detail=False,
        methods=['get'],
        url_path='translations',
        url_name='translations'
    )
    def get_language(self, request, *args, **kwargs):
        data, ru, kk = ({} for _ in range(3))
        translations = Translation.objects.all()

        for item in translations:
            ru[item.const] = item.title_ru
            kk[item.const] = item.title_kk

        data['ru'] = ru
        data['kk'] = kk

        response = HttpResponse(json.dumps(data, ensure_ascii=False), content_type='application/json')
        response['Content-Disposition'] = 'attachment; filename=index.json'

        return response
