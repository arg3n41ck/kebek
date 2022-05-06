from django.db.models import Sum

from rest_framework import serializers

from phonenumber_field.serializerfields import PhoneNumberField

from ..addresses.models import City, RailwayStation
from ..addresses.serializers import CitySerializer, RailwayStationSerializer
from ..management.models import ProductType, DeliveryType, PaymentType
from ..management.serializers import ProductTypeSerializer, DeliveryTypeSerializer, PaymentTypeSerializer
from ..notify.models import Notification
from ..notify.serializers import NotificationSerializer
from ..users.models import User
from ..users.serializers import OwnerSerializer, ClientSerializer
from .models import (
    Product,
    Delivery,
    Payment,
    Elevator,
    Document,
    Profit,
    Vehicle,
    Order,
    OrderItem,
    History,
    ACTIVE,
    ACCEPTED,
    BILLED,
    PAID,
)


class ProductInitialSerializer(serializers.ModelSerializer):
    type = ProductTypeSerializer(read_only=True)
    price = serializers.IntegerField()
    min_limit = serializers.IntegerField()
    max_limit = serializers.IntegerField()
    residue = serializers.IntegerField()
    image = serializers.SerializerMethodField(required=False)

    class Meta:
        model = Product
        fields = (
            'id',
            'set_number',
            'type',
            'price',
            'min_limit',
            'max_limit',
            'residue',
            'image',
        )

    def get_image(self, obj):
        return self.context['request'].build_absolute_uri(obj.image.url) if obj.image else None


class DeliveryInitialSerializer(serializers.ModelSerializer):
    type = DeliveryTypeSerializer(read_only=True)
    price = serializers.IntegerField()

    class Meta:
        model = Delivery
        fields = (
            'id',
            'type',
            'title_ru',
            'title_kk',
            'price',
        )


class PaymentInitialSerializer(serializers.ModelSerializer):
    type = PaymentTypeSerializer(read_only=True)
    minutes = serializers.IntegerField()

    class Meta:
        model = Payment
        fields = (
            'id',
            'type',
            'minutes',
        )


class ProductCreateSerializer(ProductInitialSerializer):
    elevator = serializers.PrimaryKeyRelatedField(queryset=Elevator.objects.all())
    type = serializers.PrimaryKeyRelatedField(queryset=ProductType.objects.all())

    class Meta(ProductInitialSerializer.Meta):
        fields = ProductInitialSerializer.Meta.fields + (
            'elevator',
        )


class DeliveryCreateSerializer(DeliveryInitialSerializer):
    elevator = serializers.PrimaryKeyRelatedField(queryset=Elevator.objects.all())
    type = serializers.PrimaryKeyRelatedField(queryset=DeliveryType.objects.all())

    class Meta(DeliveryInitialSerializer.Meta):
        fields = DeliveryInitialSerializer.Meta.fields + (
            'elevator',
        )


class PaymentCreateSerializer(PaymentInitialSerializer):
    elevator = serializers.PrimaryKeyRelatedField(queryset=Elevator.objects.all())
    type = serializers.PrimaryKeyRelatedField(queryset=PaymentType.objects.all())

    class Meta(PaymentInitialSerializer.Meta):
        fields = PaymentInitialSerializer.Meta.fields + (
            'elevator',
        )


class ProductListSerializer(ProductInitialSerializer):
    class Meta(ProductInitialSerializer.Meta):
        fields = ProductInitialSerializer.Meta.fields + (
            'status',
        )


class DeliveryListSerializer(DeliveryInitialSerializer):
    class Meta(DeliveryInitialSerializer.Meta):
        fields = DeliveryInitialSerializer.Meta.fields + (
            'status',
        )


class PaymentListSerializer(PaymentInitialSerializer):
    class Meta(PaymentInitialSerializer.Meta):
        fields = PaymentInitialSerializer.Meta.fields + (
            'status',
        )


class ElevatorSerializer(serializers.ModelSerializer):
    phone_number = PhoneNumberField(required=False)
    logo = serializers.SerializerMethodField()
    slug = serializers.CharField(read_only=True)

    class Meta:
        model = Elevator
        fields = (
            'id',
            'title_ru',
            'title_kk',
            'address_ru',
            'address_kk',
            'phone_number',
            'email',
            'website',
            'logo',
            'slug',
        )

    def get_logo(self, obj):
        return self.context['request'].build_absolute_uri(obj.logo.url) if obj.logo else None


class ElevatorFullSerializer(ElevatorSerializer):
    railway_station = serializers.PrimaryKeyRelatedField(queryset=RailwayStation.objects.all())
    cities = serializers.PrimaryKeyRelatedField(queryset=City.objects.all(), many=True)
    products = serializers.SerializerMethodField()
    deliveries = serializers.SerializerMethodField()
    payments = serializers.SerializerMethodField()
    owner = OwnerSerializer(read_only=True)

    class Meta(ElevatorSerializer.Meta):
        fields = ElevatorSerializer.Meta.fields + (
            'description_ru',
            'description_kk',
            'bin',
            'bik',
            'checking_account',
            'railway_station',
            'cities',
            'products',
            'deliveries',
            'payments',
            'owner',
        )

    def to_representation(self, value):
        data = super().to_representation(value)

        railway_station = RailwayStationSerializer(value.railway_station)
        data['railway_station'] = railway_station.data or None

        data['cities'] = []
        for entry in value.cities.all():
            city = CitySerializer(entry).data
            data['cities'].append(city)

        return data

    def get_products(self, obj):
        products = Product.objects.filter(elevator=obj, status=ACTIVE)
        return ProductListSerializer(products, context={'request': self.context['request']}, many=True).data

    def get_deliveries(self, obj):
        deliveries = Delivery.objects.filter(elevator=obj, status=ACTIVE)
        return DeliveryListSerializer(deliveries, context={'request': self.context['request']}, many=True).data

    def get_payments(self, obj):
        payments = Payment.objects.filter(elevator=obj, status=ACTIVE)
        return PaymentListSerializer(payments, context={'request': self.context['request']}, many=True).data


class ElevatorOrderSerializer(serializers.ModelSerializer):
    AD = serializers.SerializerMethodField()
    BD = serializers.SerializerMethodField()
    PD = serializers.SerializerMethodField()

    class Meta:
        model = Elevator
        fields = (
            'id',
            'title_ru',
            'title_kk',
            'AD',
            'BD',
            'PD',
        )

    def get_AD(self, obj):
        return Order.objects.filter(elevator=obj, status=ACCEPTED).count()

    def get_BD(self, obj):
        return Order.objects.filter(elevator=obj, status=BILLED).count()

    def get_PD(self, obj):
        return Order.objects.filter(elevator=obj, status=PAID).count()


class ProfitSerializer(serializers.ModelSerializer):
    profit = serializers.IntegerField()

    class Meta:
        model = Profit
        fields = (
            'created_at',
            'profit',
        )


class ElevatorProfitSerializer(serializers.ModelSerializer):
    profits = ProfitSerializer(read_only=True, many=True)

    class Meta:
        model = Elevator
        fields = (
            'id',
            'title_ru',
            'title_kk',
            'profits',
        )


class ProductSerializer(ProductCreateSerializer):
    elevator = ElevatorSerializer(read_only=True)
    type = ProductTypeSerializer(read_only=True)
    image = serializers.SerializerMethodField()

    class Meta(ProductCreateSerializer.Meta):
        fields = ProductCreateSerializer.Meta.fields + (
            'status',
        )

    def get_image(self, obj):
        return self.context['request'].build_absolute_uri(obj.image.url) if obj.image else None


class DeliverySerializer(DeliveryCreateSerializer):
    elevator = ElevatorSerializer(read_only=True)
    type = DeliveryTypeSerializer(read_only=True)

    class Meta(DeliveryCreateSerializer.Meta):
        fields = DeliveryCreateSerializer.Meta.fields + (
            'status',
        )


class PaymentSerializer(serializers.ModelSerializer):
    elevator = ElevatorSerializer(read_only=True)
    type = PaymentTypeSerializer(read_only=True)
    minutes = serializers.IntegerField()

    class Meta(PaymentCreateSerializer.Meta):
        fields = PaymentCreateSerializer.Meta.fields + (
            'status',
        )


class ProductStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            'status',
        )


class DeliveryStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = (
            'status',
        )


class PaymentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = (
            'status',
        )


class OrderItemCreateSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    amount = serializers.IntegerField()
    product_payment = serializers.IntegerField()

    class Meta:
        model = OrderItem
        fields = (
            'id',
            'product',
            'amount',
            'product_payment',
        )


class OrderItemSerializer(OrderItemCreateSerializer):
    product = ProductListSerializer(read_only=True)
    amount = serializers.IntegerField()
    product_payment = serializers.IntegerField()

    class Meta:
        model = OrderItem
        fields = (
            'id',
            'product',
            'amount',
            'product_payment',
        )


class DocumentSerializer(serializers.ModelSerializer):
    document = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = (
            'id',
            'type',
            'document',
        )

    def get_document(self, obj):
        return self.context['request'].build_absolute_uri(obj.document.url) if obj.document else None


class DocumentCreateSerializer(DocumentSerializer):
    document = serializers.FileField()

    class Meta(DocumentSerializer.Meta):
        fields = DocumentSerializer.Meta.fields + (
            'order',
        )


class VehicleListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = (
            'id',
            'type',
            'document',
        )


class VehicleSerializer(VehicleListSerializer):
    elevator = serializers.PrimaryKeyRelatedField(queryset=Elevator.objects.all())

    class Meta(VehicleListSerializer.Meta):
        fields = VehicleListSerializer.Meta.fields + (
            'elevator',
        )

    def to_representation(self, value):
        data = super().to_representation(value)

        elevator = ElevatorSerializer(value.elevator)
        data['elevator'] = elevator.data

        return data


class OrderCreateSerializer(serializers.ModelSerializer):
    client = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), allow_null=True)
    elevator = serializers.PrimaryKeyRelatedField(queryset=Elevator.objects.all())
    delivery = serializers.PrimaryKeyRelatedField(queryset=Delivery.objects.all())
    payment = serializers.PrimaryKeyRelatedField(queryset=Payment.objects.all())
    railway_station = serializers.PrimaryKeyRelatedField(queryset=PaymentType.objects.all(), required=False, allow_null=True, default=None)
    # vehicle = serializers.PrimaryKeyRelatedField(queryset=Vehicle.objects.all(), required=False, allow_null=True, default=None)
    city = serializers.PrimaryKeyRelatedField(queryset=City.objects.all(), required=False, allow_null=True, default=None)
    delivery_payment = serializers.IntegerField()
    # pre_payment = serializers.IntegerField()

    class Meta:
        model = Order
        fields = (
            'id',
            'client',
            'elevator',
            'delivery',
            'payment',
            'railway_station',
            # 'vehicle',
            'city',
            'address',
            'title',
            'bin',
            'bik',
            'checking_account',
            'delivery_payment',
            # 'pre_payment',
        )


class OrderPatchSerializer(OrderCreateSerializer):
    delivery = serializers.PrimaryKeyRelatedField(queryset=Delivery.objects.all(), allow_null=True)
    payment = serializers.PrimaryKeyRelatedField(queryset=Payment.objects.all(), allow_null=True)

    class Meta(OrderCreateSerializer.Meta):
        pass


class OrderSerializer(OrderCreateSerializer):
    client = ClientSerializer(read_only=True)
    elevator = ElevatorSerializer(read_only=True)
    products = serializers.SerializerMethodField()
    delivery = DeliveryListSerializer(read_only=True)
    payment = PaymentListSerializer(read_only=True)
    railway_station = RailwayStationSerializer(read_only=True)
    # vehicle = VehicleListSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    proxy_number = serializers.IntegerField()

    class Meta(OrderCreateSerializer.Meta):
        fields = OrderCreateSerializer.Meta.fields + (
            'products',
            'proxy_fullname',
            'proxy_number',
            'proxy_start_date',
            'proxy_end_date',
            'status',
            'documents',
            'created_at',
            'updated_at',
            'number',
        )
        read_only_fields = (
            'created_at',
            'updated_at',
            'number',
        )

    def get_products(self, obj):
        items = OrderItem.objects.filter(order=obj.id)
        data = OrderItemSerializer(items, many=True, context=self.context).data

        return data


class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = (
            'title',
            'content',
            'created_at',
        )


class OrderSingleSerializer(OrderSerializer):
    history = serializers.SerializerMethodField()

    class Meta(OrderSerializer.Meta):
        fields = OrderSerializer.Meta.fields + (
            'history',
        )

    def get_history(self, obj):
        notifications = History.objects.filter(order=obj)
        data = HistorySerializer(notifications, many=True).data

        return data


class OrderProxySerializer(serializers.ModelSerializer):
    proxy_fullname = serializers.CharField()
    proxy_number = serializers.IntegerField()
    proxy_start_date = serializers.DateField()
    proxy_end_date = serializers.DateField()

    class Meta:
        model = Order
        fields = (
            'proxy_fullname',
            'proxy_number',
            'proxy_start_date',
            'proxy_end_date',
        )


class OrderStatusSerializer(serializers.ModelSerializer):
    products = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            'status',
            'products',
        )


class OrderIdsSerializer(serializers.Serializer):
    ids = serializers.ListField(child=serializers.IntegerField())

    class Meta:
        fields = (
            'ids',
        )


class StatusIdsSerializer(serializers.Serializer):
    status = serializers.CharField()
    ids = serializers.ListField(child=serializers.IntegerField())

    class Meta:
        fields = (
            'status',
            'ids',
        )


class ElevatorGeneralSerializer(serializers.Serializer):
    orders = serializers.IntegerField()
    orders_FD = serializers.IntegerField()
    profit = serializers.IntegerField()

    class Meta:
        fields = (
            'orders',
            'orders_FD',
            'profit',
        )
