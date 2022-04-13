from rest_framework import filters, mixins, viewsets
from rest_framework.permissions import AllowAny

from django_filters.rest_framework import DjangoFilterBackend

from .models import RailwayStation, City
from .serializers import RailwayStationSerializer, CitySerializer


class RailwayStationViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    Lists railway stations
    """

    permission_classes = [AllowAny]
    queryset = RailwayStation.objects.all()
    serializer_class = RailwayStationSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = ['title_ru', 'title_kk']


class CityViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    Lists cities
    """

    permission_classes = [AllowAny]
    queryset = City.objects.all()
    serializer_class = CitySerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['district']
    search_fields = ['title_ru', 'title_kk']
