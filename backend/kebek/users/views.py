import logging

from rest_framework import generics, filters, mixins, status, viewsets
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from itertools import chain
from faker import Factory as FakerFactory

from ..elevators.models import Elevator, Order, Accountant, Administrator
from ..elevators.utils import is_allowed
from ..notify.utils import send_sms
from .exceptions import ConflictException
from .models import (
    User,
    Address,
    Requisites,
    SMSVerification,
    NEW_ACCOUNT,
    RESET_PASSWORD,
    ACCOUNTANT,
    ADMINISTRATOR,
    OWNER,
    ADMINISTRATION,
)
from .permissions import IsUserOrReadOnly, IsAdministration
from .serializers import (
    UserCreateSerializer,
    UserSerializer,
    UserFullSerializer,
    UserNotificationSerializer,
    AddressSerializer,
    AddressCreateSerializer,
    RequisitesSerializer,
    UserResponseSerializer,
    UserResetPasswordSerializer,
    UserChangePasswordSerializer,
    UserSendCodeSerializer,
    UserKeySerializer,
    UserActivateSerializer,
    StaffCreateSerializer,
    StaffSerializer,
    ClientSerializer,
    StaffIdsSerializer,
    SuccessSerializer,
)

logger = logging.getLogger(__name__)


class UserViewSet(viewsets.GenericViewSet):
    """
    Manages users
    """

    serializer_class = UserSerializer
    queryset = User.objects.all()

    @extend_schema(
        request=UserSendCodeSerializer,
        responses={200: SuccessSerializer}
    )
    @action(
        detail=False,
        methods=['post'],
        url_path='send-code',
        url_name='send-code',
        permission_classes=[AllowAny]
    )
    def send_code(self, request):
        username = request.data['username']
        sms_type = request.data['type']

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound()

        verification = user.sms_codes.create(type=sms_type)
        result = verification.send_sms()

        if result:
            serializer = SuccessSerializer({'success': True})
        else:
            serializer = SuccessSerializer({'success': False})

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=UserActivateSerializer,
        responses={200: UserKeySerializer}
    )
    @action(
        detail=False,
        methods=['post'],
        url_path='check-code',
        url_name='check-code',
        permission_classes=[AllowAny]
    )
    def check_code(self, request):
        username = request.data['username']
        code = request.data['code']

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound()

        try:
            verification = SMSVerification.objects.filter(
                user=user,
                activated=False,
                type=RESET_PASSWORD
            ).latest('created_at')
        except SMSVerification.DoesNotExist:
            raise NotFound()

        is_same = verification.check_code(code)

        if not is_same:
            raise ConflictException()

        serializer = UserKeySerializer(verification)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=UserResetPasswordSerializer,
        responses={200: SuccessSerializer}
    )
    @action(
        detail=False,
        methods=['post'],
        url_path='password/reset',
        url_name='password/reset',
        permission_classes=[AllowAny]
    )
    def password_reset(self, request):
        pk = request.data['key']
        new_password = request.data['new_password']

        try:
            verification = SMSVerification.objects.get(pk=pk)
        except SMSVerification.DoesNotExist:
            raise NotFound()

        if verification.activated:
            raise ConflictException()

        user = verification.user
        user.set_password(new_password)
        user.save()

        verification.activate()

        serializer = SuccessSerializer({'success': True})

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=UserChangePasswordSerializer,
        responses={200: SuccessSerializer}
    )
    @action(
        detail=False,
        methods=['patch'],
        url_path='password/change',
        url_name='password/change',
        permission_classes=[IsAuthenticated]
    )
    def password_change(self, request):
        old_password = request.data['old_password']
        new_password = request.data['new_password']
        user = self.request.user

        if not user.check_password(old_password):
            raise ConflictException()

        user.set_password(new_password)
        user.save()

        serializer = SuccessSerializer({'success': True})

        return Response(serializer.data, status=status.HTTP_200_OK)


class UserRegisterViewSet(viewsets.GenericViewSet):
    """
    Registers and activates django users and registers social users
    """

    permission_classes = [AllowAny]
    serializer_class = UserCreateSerializer
    queryset = User.objects.all()

    @extend_schema(
        request=UserCreateSerializer,
        responses={201: UserCreateSerializer}
    )
    @action(
        detail=False,
        methods=['post'],
        url_path='register',
        url_name='register'
    )
    def register(self, request):
        first_name = request.data['first_name']
        username = request.data['username']
        password = request.data['password']

        serializer = UserCreateSerializer(data=request.data)

        if serializer.is_valid():
            try:
                user = User.objects.get(username=username)

                if not user.is_active:
                    user.set_password(password)
                    user.save()

                    serializer = UserCreateSerializer(user)

                    verification = SMSVerification.objects.create(user=user, type=NEW_ACCOUNT)
                    verification.send_sms()

                else:
                    raise ConflictException()

            except User.DoesNotExist:
                user = User.objects.create_user(
                    username=username,
                    password=password,
                    first_name=first_name,
                    is_active=False
                )
                serializer = UserCreateSerializer(user)

                verification = SMSVerification.objects.create(user=user, type=NEW_ACCOUNT)
                verification.send_sms()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        request=UserActivateSerializer,
        responses={200: UserResponseSerializer}
    )
    @action(
        detail=False,
        methods=['post'],
        url_path='register/activate',
        url_name='register/activate'
    )
    def register_activate(self, request):
        username = request.data['username'].replace(' ', '')
        code = request.data['code']

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound('User not found')

        verification = SMSVerification.objects.filter(user=user, activated=False, type=NEW_ACCOUNT).latest('created_at')
        is_activated = verification.activate_user(code)

        if not is_activated:
            raise NotFound('SMS not found')

        serializer = UserSerializer(user, context={'request': request})

        token, created = Token.objects.get_or_create(user=user)

        return Response(
            {
                'user': serializer.data,
                'token': token.key
            },
            status=status.HTTP_200_OK
        )


class UserLoginView(ObtainAuthToken):
    """
    Logins users
    """

    @extend_schema(
        responses={200: UserResponseSerializer}
    )
    def post(self, request, *args, **kwargs):
        try:
            User.objects.get(username=request.data['username'].replace(' ', ''))
        except User.DoesNotExist:
            raise NotFound()

        serializer = self.serializer_class(
            data=request.data, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        user_serializer = UserSerializer(user, context={'request': request})

        token, created = Token.objects.get_or_create(user=user)

        return Response(
            {
                'user': user_serializer.data,
                'token': token.key
            },
            status=status.HTTP_200_OK
        )


class UserProfileView(generics.RetrieveAPIView):
    """
    Retrieves users
    """

    permission_classes = [IsAuthenticated]
    serializer_class = UserFullSerializer
    queryset = User.objects.all()

    def get_object(self):
        return self.request.user


class UserGeneralView(generics.RetrieveUpdateAPIView):
    """
    Retrieves and updates users general info
    """

    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(request.user, data=request.data, context={'request': request}, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserNotificationView(generics.UpdateAPIView):
    """
    Updates users notification settings
    """

    permission_classes = [IsAuthenticated]
    serializer_class = UserNotificationSerializer
    queryset = User.objects.all()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(request.user, data=request.data, context={'request': request}, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserAddressesViewSet(viewsets.ModelViewSet):
    """
    Lists, creates updates and deletes user addresses
    """

    permission_classes = [IsAuthenticated]
    serializer_class = AddressSerializer

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return self.serializer_class
        return AddressCreateSerializer

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user).order_by('id')

    def create(self, request, *args, **kwargs):
        serializer = AddressCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = self.perform_create(serializer)
        instance_serializer = self.get_serializer(instance)
        return Response(instance_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = AddressCreateSerializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        instance = self.perform_update(serializer)
        instance_serializer = self.get_serializer(instance, context={'request': request})
        return Response(instance_serializer.data, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)


class UserRequisitesViewSet(viewsets.ModelViewSet):
    """
    Lists, creates updates and deletes user requisites
    """

    permission_classes = [IsAuthenticated]
    serializer_class = RequisitesSerializer

    def get_queryset(self):
        return Requisites.objects.filter(user=self.request.user).order_by('id')

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)


class StaffViewSet(viewsets.ModelViewSet):
    """
    Lists, creates, updates and deletes staff
    """

    permission_classes = [IsAdministration]
    serializer_class = StaffSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['user_role']
    search_fields = ['first_name']

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return self.serializer_class
        return StaffCreateSerializer

    def get_object(self):
        user = self.request.user

        try:
            staff = User.objects.get(id=self.kwargs['pk'])
        except User.DoesNotExist:
            raise NotFound()

        if staff.user_role == ACCOUNTANT:
            try:
                elevator = Accountant.objects.get(accountant=staff).elevator
                is_allowed(user, elevator)
            except Accountant.DoesNotExist:
                raise NotFound('Accountant does not have an assigned elevator')
        elif staff.user_role == ADMINISTRATOR:
            try:
                elevator = Administrator.objects.get(administrator=staff).elevator
                is_allowed(user, elevator)
            except Administrator.DoesNotExist:
                raise NotFound('Administrator does not have an assigned elevator')
        else:
            elevators = Elevator.objects.filter(owner=user)
            for elevator in elevators:
                is_allowed(user, elevator)

        return staff

    def get_queryset(self):
        user = self.request.user
        elevator = self.request.query_params.get('elevator')
        user_role = self.request.query_params.get('user_role')

        if user.user_role == ADMINISTRATOR:
            elevators = Administrator.objects.filter(administrator=user).values_list('elevator', flat=True)
            return User.objects.filter(user_role=ACCOUNTANT, accountant__elevator__id__in=elevators)
        else:
            if elevator:
                if user_role and user_role == ADMINISTRATOR:
                    return User.objects.filter(user_role=ADMINISTRATOR, administrator__elevator__id=elevator)
                elif user_role and user_role == ACCOUNTANT:
                    return User.objects.filter(user_role=ACCOUNTANT, accountant__elevator__id=elevator)
                else:
                    administrators = User.objects.filter(
                        user_role=ADMINISTRATOR,
                        administrator__elevator__id=elevator
                    ).values_list('id', flat=True)
                    accountants = User.objects.filter(
                        user_role=ACCOUNTANT,
                        accountant__elevator__id=elevator
                    ).values_list('id', flat=True)

                    return User.objects.filter(id__in=list(chain(administrators, accountants)))

            elevators = Elevator.objects.filter(owner=user).values_list('id', flat=True)
            administrators = User.objects.filter(
                user_role=ADMINISTRATOR,
                administrator__elevator__id__in=elevators
            ).values_list('id', flat=True)
            accountants = User.objects.filter(
                user_role=ACCOUNTANT,
                accountant__elevator__id__in=elevators
            ).values_list('id', flat=True)

            return User.objects.filter(id__in=list(chain(administrators, accountants)))

    def create(self, request, *args, **kwargs):
        user = request.user

        try:
            elevator = Elevator.objects.get(pk=self.request.data['elevator'])
        except Elevator.DoesNotExist:
            raise NotFound('Elevator not found')

        is_allowed(user, elevator)

        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            phone_number = request.data['phone_number']
            first_name = request.data['first_name']
            user_role = request.data['user_role']
            email = request.data['email'] if 'email' in request.data else None

            faker = FakerFactory.create()
            password = faker.password()
            request.data['password'] = password

            try:
                User.objects.get(username=phone_number)
                raise ConflictException()

            except User.DoesNotExist:
                if user.user_role == OWNER or (user.user_role == ADMINISTRATOR and user_role == ACCOUNTANT):
                    staff = User.objects.create_user(
                        username=phone_number,
                        password=password,
                        first_name=first_name,
                        email=email,
                        phone_number=phone_number,
                        user_type=ADMINISTRATION,
                        user_role=user_role
                    )

                    if user_role == ACCOUNTANT:
                        Accountant.objects.create(
                            elevator_id=elevator.id,
                            accountant=staff
                        )
                    elif user_role == ADMINISTRATOR:
                        Administrator.objects.create(
                            elevator_id=elevator.id,
                            administrator=staff
                        )

                    send_sms(phone_number, f'Ваш временный пароль: {password}\nKEBEK.KZ')

                else:
                    raise PermissionDenied()

                serializer = StaffSerializer(staff)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        user = request.user
        staff = self.get_object()

        try:
            elevator = Elevator.objects.get(pk=self.request.data['elevator'])
        except Elevator.DoesNotExist:
            raise NotFound('Elevator not found')

        is_allowed(user, elevator)

        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if 'first_name' in request.data:
                staff.first_name = request.data['first_name']

            if 'email' in request.data:
                staff.email = request.data['email']

            if 'phone_number' in request.data:
                staff.email = request.data['phone_number']

            if 'user_role' or 'elevator' in request.data:
                user_role = request.data['user_role'] or staff.user_role

                try:
                    elevator = Elevator.objects.get(pk=request.data['elevator'] or staff.elevator)
                except Elevator.DoesNotExist:
                    raise NotFound('Elevator not found')

                is_allowed(user, elevator)

                if user.user_role == OWNER or (user.user_role == ADMINISTRATOR and user_role == ACCOUNTANT):
                    if staff.user_role == ACCOUNTANT:
                        if user_role == ADMINISTRATOR:
                            try:
                                Accountant.objects.get(accountant=staff).delete()
                            except Accountant.DoesNotExist:
                                pass

                            Administrator.objects.create(
                                elevator_id=elevator.id,
                                administrator=staff
                            )
                        else:
                            try:
                                accountant = Accountant.objects.get(accountant=staff)
                                accountant.elevator = elevator
                                accountant.save()
                            except Accountant.DoesNotExist:
                                raise NotFound('Accountant not found')

                    elif staff.user_role == ADMINISTRATOR:
                        if user_role == ACCOUNTANT:
                            try:
                                Administrator.objects.get(administrator=staff).delete()
                            except Administrator.DoesNotExist:
                                pass

                            Accountant.objects.create(
                                elevator_id=elevator.id,
                                accountant=staff
                            )
                        else:
                            try:
                                administrator = Administrator.objects.get(administrator=staff)
                                administrator.elevator = elevator
                                administrator.save()
                            except Administrator.DoesNotExist:
                                raise NotFound('Administrator not found')
                else:
                    raise PermissionDenied()

                staff.user_role = user_role

            staff.save()

            serializer = StaffSerializer(staff)

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        user = request.user
        staff = self.get_object()

        if staff.user_role == ACCOUNTANT:
            try:
                elevator = Accountant.objects.get(accountant=staff).elevator
                is_allowed(user, elevator)
            except Accountant.DoesNotExist:
                raise NotFound('Accountant does not have an assigned elevator')
        elif staff.user_role == ADMINISTRATOR:
            try:
                elevator = Administrator.objects.get(administrator=staff).elevator
                is_allowed(user, elevator)
            except Administrator.DoesNotExist:
                raise NotFound('Administrator does not have an assigned elevator')

        staff.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        request=StaffIdsSerializer,
        responses={200: StaffSerializer},
    )
    @action(
        detail=False,
        methods=['post'],
        url_path='bulk',
        url_name='bulk'
    )
    def delete_staff_bulk(self, request):
        if request.user.user_role == OWNER:
            elevators = Elevator.objects.filter(owner=request.user).values_list('id', flat=True)
            if not elevators:
                raise NotFound('Owner does not have any elevators')

            for user_id in request.data['ids']:
                try:
                    user = User.objects.get(id=user_id)
                except User.DoesNotExist:
                    continue

                if user.user_role == ACCOUNTANT:
                    try:
                        accountant = Accountant.objects.get(accountant=user)
                        if accountant.elevator in elevators:
                            user.delete()
                    except Accountant.DoesNotExist:
                        continue

                elif user.user_role == ADMINISTRATOR:
                    try:
                        administrator = Administrator.objects.get(administrator=user)
                        if administrator.elevator in elevators:
                            user.delete()
                    except Administrator.DoesNotExist:
                        continue

        elif request.user.user_role == ADMINISTRATOR:
            try:
                administrator = Administrator.objects.get(administrator=request.user)
            except Administrator.DoesNotExist:
                raise NotFound('Administrator does not have an assigned elevator')

            for user_id in request.data['ids']:
                try:
                    user = User.objects.get(id=user_id)
                except User.DoesNotExist:
                    continue

                if user.user_role == ACCOUNTANT:
                    try:
                        accountant = Accountant.objects.get(accountant=user)
                        if accountant.elevator == administrator.elevator:
                            user.delete()
                    except Accountant.DoesNotExist:
                        continue

        page = self.paginate_queryset(self.get_queryset())
        if page is not None:
            serializer = self.get_serializer(page, context={'request': request}, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(self.get_queryset(), context={'request': request}, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class ClientsViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    Lists clients
    """

    permission_classes = [IsAdministration]
    serializer_class = ClientSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = ['first_name']

    def get_queryset(self):
        user = self.request.user

        if user.user_role == ADMINISTRATOR:
            try:
                elevators = [Administrator.objects.get(administrator=user).elevator.id]
            except Administrator.DoesNotExist:
                raise NotFound('Administrator does not have an assigned elevator')
        else:
            elevators = Elevator.objects.filter(owner=self.request.user).values_list('id', flat=True)

        clients_ids = Order.objects.filter(elevator__in=elevators).values_list('client', flat=True)

        return User.objects.filter(id__in=clients_ids)
