from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.gis import admin
from django.http import HttpResponseRedirect
from django.urls import path
from django.utils.decorators import method_decorator
from django.utils.translation import gettext_lazy as _

from .models import RailwayStation, District, City
from .utils import get_stations


@admin.register(RailwayStation)
class RailwayStationAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title_ru',
        'description_ru',
        'code',
    )
    list_filter = (
        'description_ru',
    )
    search_fields = (
        'title_ru',
        'description_ru',
        'code',
    )
    change_list_template = 'admin/addresses/railwaystation/change_list.html'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                'download-stations/',
                self.download_stations,
                name='download_stations',
            )
        ]
        return custom_urls + urls

    @method_decorator(staff_member_required)
    def download_stations(self, request):
        get_stations()

        self.message_user(request, _('Stations were just updated.'))
        return HttpResponseRedirect('../')

    download_stations.short_description = 'Download stations'


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title_ru',
    )
    search_fields = (
        'title_ru',
    )


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'district',
        'title_ru',
    )
    list_filter = (
        'district',
    )
    search_fields = (
        'title_ru',
    )
