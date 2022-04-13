from django.urls import path

from rest_framework.routers import DefaultRouter

from .views import (
    ElevatorReadOnlyViewSet,
    ProductReadOnlyViewSet,
    ElevatorViewSet,
    ProductViewSet,
    DeliveryViewSet,
    PaymentViewSet,
    OrderViewSet,
    DocumentViewSet,
    OrderReportViewSet,
    DashboardGeneralViewSet,
    DashboardOrdersViewSet,
    DashboardProfitViewSet,
    PassDetailView,
)

router = DefaultRouter()
router.register('elevators/no-auth', ElevatorReadOnlyViewSet, basename='ElevatorsReadOnly')
router.register('elevators', ElevatorViewSet, basename='Elevators')

router.register('products/no-auth', ProductReadOnlyViewSet, basename='ProductReadOnly')
router.register('products', ProductViewSet, basename='Products')

router.register('deliveries', DeliveryViewSet, basename='Deliveries')

router.register('payments', PaymentViewSet, basename='Payments')

router.register('orders/documents', DocumentViewSet, basename='Documents')
router.register('orders/report', OrderReportViewSet, basename='Report')
router.register('orders', OrderViewSet, basename='Orders')

router.register('dashboard/general', DashboardGeneralViewSet, basename='DashboardGeneral')
router.register('dashboard/orders', DashboardOrdersViewSet, basename='DashboardOrders')
router.register('dashboard/profit', DashboardProfitViewSet, basename='DashboardProfit')

urlpatterns = [
    path('pass/<int:pk>/', PassDetailView.as_view(), name='Pass'),
]
