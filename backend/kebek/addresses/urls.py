from rest_framework.routers import DefaultRouter

from .views import RailwayStationViewSet, CityViewSet

router = DefaultRouter()
router.register('addresses/stations', RailwayStationViewSet, basename='RailwayStations')
router.register('addresses/cities', CityViewSet, basename='Cities')
