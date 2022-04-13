from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated

from django_filters.rest_framework import DjangoFilterBackend

from .models import Policy, FAQ
from .serializers import PolicySerializer, FAQSerializer, SupportTicketSerializer


class PolicyViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    Lists and filters policies
    """

    permission_classes = [AllowAny]
    serializer_class = PolicySerializer
    queryset = Policy.objects.all()

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['type', 'language']


class FAQViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    Lists FAQ
    """

    permission_classes = [AllowAny]
    serializer_class = FAQSerializer
    queryset = FAQ.objects.all()

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['language']


class SupportTicketViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    Creates support tickets
    """

    permission_classes = [IsAuthenticated]
    serializer_class = SupportTicketSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
