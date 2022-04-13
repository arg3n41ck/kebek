import os
import sentry_sdk

from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.celery import CeleryIntegration
from decouple import config

from .common import Common

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Production(Common):
    INSTALLED_APPS = Common.INSTALLED_APPS
    SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
    ALLOWED_HOSTS = ['*']

    # Postgis
    DATABASES = {
        'default': {
            'ENGINE': 'django.contrib.gis.db.backends.postgis',
            'NAME': os.environ.get('POSTGRES_DB'),
            'USER': os.environ.get('POSTGRES_USER'),
            'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
            'HOST': os.environ.get('POSTGRES_HOST'),
            'PORT': '5432',
        }
    }

    # CELERY SETTIGS
    CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL')
    CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND')

    # Celery Data Format
    CELERY_ACCEPT_CONTENT = ['application/json']
    CELERY_TASK_SERIALIZER = 'json'
    CELERY_RESULT_SERIALIZER = 'json'
    CELERY_TIMEZONE = 'Asia/Almaty'
    imports = ('indicators.tasks',)

    CELERY_TASK_ACKS_LATE = False
    CELERY_TASK_QUEUE_MAX_PRIORITY = 10
    CELERY_CREATE_MISSING_QUEUES = True
    CELERY_TASK_REMOTE_TRACEBACKS = True
    CELERY_TASK_DEFAULT_QUEUE = 'kebek_queue'

    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'verbose': {
                'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d'
                + ' %(message)s'
            },
            'simple': {'format': '[%(levelname)s] %(message)s'},

        },
        'filters': {
            'require_debug_false': {'()': 'django.utils.log.RequireDebugFalse'}
        },
        'handlers': {
            'file': {
                'level': 'INFO',
                'filters': ['require_debug_false'],
                'class': 'logging.handlers.RotatingFileHandler',
                'filename': os.path.join(os.path.dirname(BASE_DIR), 'info.log'),
                'maxBytes': 1024 * 1024 * 5,
                'backupCount': 5,
                'formatter': 'verbose',
            },
            'console': {'class': 'logging.StreamHandler', 'formatter': 'simple'},
        },
        'loggers': {
            '': {'handlers': ['file', 'console'], 'level': 'INFO'},
        },
    }

    PUSH_NOTIFICATIONS_SETTINGS = {
        'FCM_API_KEY': os.environ.get('FCM_API_KEY', ''),
        'APNS_CERTIFICATE': os.environ.get('APNS_CERTIFICATE_PATH', ''),
    }

    sentry_sdk.init(
        dsn=config('SENTRY_DSN', ''),
        integrations=[DjangoIntegration(), CeleryIntegration()],
        send_default_pii=True,
    )
