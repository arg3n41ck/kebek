import uuid

from rest_framework import serializers

from phonenumber_field.serializerfields import PhoneNumberField

from ..addresses.serializers import CitySerializer
from ..elevators.models import Elevator, Accountant, Administrator
from .models import User, Address, Requisites, SMSVerification, ACCOUNTANT, ADMINISTRATOR, OWNER


class AddressCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = (
            'id',
            'city',
            'address',
        )


class AddressSerializer(AddressCreateSerializer):
    city = CitySerializer()


class RequisitesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Requisites
        fields = (
            'id',
            'title',
            'bin',
            'bik',
            'checking_account',
        )


class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'first_name',
        )


class ClientSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(required=False)
    email = serializers.SerializerMethodField(required=False)
    phone_number = PhoneNumberField()

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'first_name',
            'user_type',
            'email',
            'phone_number',
            'image',
        )

    def get_email(self, obj) -> str:
        return obj.email or None

    def get_image(self, obj) -> str:
        return self.context['request'].build_absolute_uri(obj.image.url) if obj.image else None


class UserSerializer(ClientSerializer):
    image = serializers.ImageField(required=False)
    email = serializers.EmailField(required=False)
    phone_number = PhoneNumberField(required=False)

    class Meta(ClientSerializer.Meta):
        fields = ClientSerializer.Meta.fields + (
            'user_type',
            'user_role',
        )
        read_only_fields = (
            'username',
            'user_type',
            'user_role',
        )


class UserFullSerializer(ClientSerializer):
    addresses = serializers.SerializerMethodField()
    requisites = serializers.SerializerMethodField()

    class Meta(ClientSerializer.Meta):
        fields = ClientSerializer.Meta.fields + (
            'notifications_sms',
            'notifications_email',
            'user_type',
            'user_role',
            'addresses',
            'requisites',
        )
        read_only_fields = (
            'username',
            'user_type',
            'user_role',
        )

    def get_addresses(self, obj):
        addresses = Address.objects.filter(user=obj)
        data = AddressSerializer(addresses, many=True).data

        return data

    def get_requisites(self, obj):
        requisites = Requisites.objects.filter(user=obj)
        data = RequisitesSerializer(requisites, many=True).data

        return data


class UserCreateSerializer(serializers.ModelSerializer):
    username = PhoneNumberField()

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'password',
        )
        extra_kwargs = {
            'password': {'write_only': True}
        }


class UserNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'notifications_sms',
            'notifications_email',
        )


class StaffCreateSerializer(serializers.ModelSerializer):
    email = serializers.CharField(required=False)
    phone_number = PhoneNumberField()
    elevator = serializers.CharField()

    class Meta:
        model = User
        fields = (
            'first_name',
            'email',
            'phone_number',
            'elevator',
            'user_role',
        )


class StaffSerializer(serializers.ModelSerializer):
    username = PhoneNumberField()
    first_name = serializers.CharField()
    email = serializers.SerializerMethodField(required=False)
    phone_number = PhoneNumberField()
    elevators = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'first_name',
            'email',
            'phone_number',
            'elevators',
            'user_role',
        )

    def get_email(self, obj) -> str:
        return obj.email or None

    def get_elevators(self, obj) -> list:
        try:
            role = User.objects.get(username=obj.username).user_role
        except User.DoesNotExist:
            role = obj.user_role

        if role == ACCOUNTANT:
            try:
                return Accountant.objects.filter(accountant=obj).values_list('elevator_id', flat=True)
            except Accountant.DoesNotExist:
                return []
        elif role == ADMINISTRATOR:
            try:
                return Administrator.objects.filter(administrator=obj).values_list('elevator_id', flat=True)
            except Administrator.DoesNotExist:
                return []
        else:
            return Elevator.objects.filter(owner=obj).values_list('id', flat=True)


class StaffDeleteSerializer(serializers.ModelSerializer):
    username = PhoneNumberField()

    class Meta:
        model = User
        fields = (
            'username',
        )


class UserResponseSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    token = serializers.CharField()

    class Meta:
        model = User
        fields = (
            'user',
            'token',
        )


class UserSendCodeSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    type = serializers.CharField()

    class Meta:
        model = User
        fields = (
            'username',
            'type',
        )


class UserResetPasswordSerializer(serializers.ModelSerializer):
    key = serializers.CharField()
    new_password = serializers.CharField()

    class Meta:
        model = User
        fields = (
            'key',
            'new_password',
        )


class UserChangePasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()

    class Meta:
        model = User
        fields = (
            'old_password',
            'new_password',
        )


class UserKeySerializer(serializers.ModelSerializer):
    key = serializers.SerializerMethodField()

    class Meta:
        model = SMSVerification
        fields = (
            'key',
        )

    def get_key(self, obj) -> str:
        return obj.pk


class UserActivateSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    code = serializers.CharField()

    class Meta:
        model = User
        fields = (
            'username',
            'code',
        )


class StaffIdsSerializer(serializers.Serializer):
    ids = serializers.ListField(child=serializers.IntegerField())

    class Meta:
        fields = (
            'ids',
        )


class SuccessSerializer(serializers.Serializer):
    success = serializers.BooleanField()

    class Meta:
        fields = (
            'success',
        )
