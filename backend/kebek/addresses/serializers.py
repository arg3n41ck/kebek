from rest_framework import serializers

from .models import RailwayStation, District, City


class RailwayStationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RailwayStation
        fields = (
            'id',
            'title_ru',
            'title_kk',
            'description_ru',
            'description_kk',
            'code',
        )


class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = District
        fields = (
            'id',
            'title_ru',
            'title_kk',
        )


class CitySerializer(serializers.ModelSerializer):
    district = DistrictSerializer(read_only=True)

    class Meta:
        model = City
        fields = (
            'id',
            'title_ru',
            'title_kk',
            'district',
        )
