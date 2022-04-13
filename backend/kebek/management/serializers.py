from rest_framework import serializers

from .models import ProductType, DeliveryType, PaymentType


class DeliveryTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryType
        fields = (
            'id',
            'title_ru',
            'title_kk',
        )


class ProductTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductType
        fields = (
            'id',
            'title_ru',
            'title_kk',
        )


class PaymentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentType
        fields = (
            'id',
            'title_ru',
            'title_kk',
            'natural_person',
            'legal_person',
        )


class ConstSerializer(serializers.Serializer):
    const = serializers.CharField()

    class Meta:
        fields = (
            'const',
        )


class TranslationSerializer(serializers.Serializer):
    language = ConstSerializer(read_only=True)

    class Meta:
        fields = (
            'language',
        )
