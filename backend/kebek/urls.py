from django.conf import settings
from django.conf.urls.i18n import i18n_patterns
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, reverse_lazy
from django.views.generic.base import RedirectView

from rest_framework.routers import DefaultRouter

from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from push_notifications.api.rest_framework import GCMDeviceAuthorizedViewSet

from .addresses.urls import router as addresses
from .management.urls import router as management
from .elevators.urls import router as elevators
from .notify.urls import router as notify
from .policies.urls import router as policies
from .users.urls import router as users

router = DefaultRouter()
router.register('device/gcm', GCMDeviceAuthorizedViewSet)
router.registry.extend(addresses.registry)
router.registry.extend(management.registry)
router.registry.extend(elevators.registry)
router.registry.extend(notify.registry)
router.registry.extend(policies.registry)
router.registry.extend(users.registry)


urlpatterns = i18n_patterns(
    path('admin/', admin.site.urls),

    path('', RedirectView.as_view(url=reverse_lazy('api-root'), permanent=False)),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    path('tinymce/', include('tinymce.urls')),

    # Version 1
    path('api/v1/', include(
        [
            path('users/', include('kebek.users.urls')),
        ]
        + router.urls
    )),
    path('', include('kebek.elevators.urls')),

    prefix_default_language=False,
) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
