from rest_framework.routers import DefaultRouter

from .views import PolicyViewSet, FAQViewSet, SupportTicketViewSet

router = DefaultRouter()
router.register('support/policies', PolicyViewSet, basename='Policies')
router.register('support/faq', FAQViewSet, basename='FAQ')
router.register('support/request', SupportTicketViewSet, basename='SupportTicket')
