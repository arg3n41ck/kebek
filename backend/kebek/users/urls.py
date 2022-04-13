from django.urls import path

from rest_framework.routers import DefaultRouter

from .views import (
    UserViewSet,
    UserRegisterViewSet,
    UserAddressesViewSet,
    UserRequisitesViewSet,
    StaffViewSet,
    ClientsViewSet,
    UserLoginView,
    UserGeneralView,
    UserProfileView,
    UserNotificationView,
)

router = DefaultRouter()
router.register('users', UserRegisterViewSet, basename='UsersRegister')
router.register('users', UserViewSet, basename='UsersProfile')
router.register('users/profile/requisites', UserRequisitesViewSet, basename='UserRequisites')
router.register('users/profile/addresses', UserAddressesViewSet, basename='UserAddresses')
router.register('users/staff', StaffViewSet, basename='Staff')
router.register('users/clients', ClientsViewSet, basename='Clients')

urlpatterns = [
    path('login/', UserLoginView.as_view()),
    path('profile/general/', UserGeneralView.as_view()),
    path('profile/notifications/', UserNotificationView.as_view()),
    path('profile/', UserProfileView.as_view()),
]
