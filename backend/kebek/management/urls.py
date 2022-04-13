from rest_framework.routers import DefaultRouter

from .views import ProductTypeViewSet, DeliveryTypeViewSet, PaymentTypeViewSet, TranslationViewSet

router = DefaultRouter()
router.register('products/types', ProductTypeViewSet, basename='ProductTypes')
router.register('deliveries/types', DeliveryTypeViewSet, basename='DeliveryTypes')
router.register('payments/types', PaymentTypeViewSet, basename='PaymentTypes')
router.register('', TranslationViewSet, basename='Translations')
