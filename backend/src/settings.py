import os
import sentry_sdk
from pathlib import Path
from django.utils.translation import gettext_lazy as _

from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.celery import CeleryIntegration

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.gis',

    # Third party apps
    'rest_framework',
    'rest_framework_gis',
    'rest_framework.authtoken',
    'admin_reorder',
    'corsheaders',
    'django_filters',
    'django_unused_media',
    'drf_spectacular',
    'memcache_status',
    'phonenumber_field',
    'push_notifications',
    'tinymce',

    # Local apps
    'kebek.addresses.apps.AddressesConfig',
    'kebek.elevators.apps.ElevatorConfig',
    'kebek.notify.apps.NotifyConfig',
    'kebek.management.apps.ManagementConfig',
    'kebek.policies.apps.PoliciesConfig',
    'kebek.users.apps.UsersConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'admin_reorder.middleware.ModelAdminReorder',
]

CORS_ORIGIN_ALLOW_ALL = True
ROOT_URLCONF = 'src.urls'
FILE_UPLOAD_PERMISSIONS = 0o644

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'src.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

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
# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.sqlite3",
#         "NAME": BASE_DIR / "db.sqlite3"
#     }
# }



# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

APPEND_SLASH = False
TIME_ZONE = 'Asia/Almaty'

RUSSIAN = 'ru'
KAZAKH = 'kk'

LANGUAGE_CODE = 'ru'
LANGUAGES = [
    (RUSSIAN, _('Russian')),
    (KAZAKH, _('Kazakh')),
]

LOCALE_PATHS = [BASE_DIR / 'locale']

USE_I18N = True

USE_TZ = True

LOGIN_REDIRECT_URL = '/'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_ROOT = BASE_DIR / 'staticfiles'
STATIC_URL = '/staticfiles/'
MEDIA_ROOT = BASE_DIR / 'media'
MEDIA_URL = '/media/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'users.User'

# Email
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

ADMINS = (('Author', 'freckled.cellofun@gmail.com'),)

FILE_UPLOAD_HANDLERS = [
        'django.core.files.uploadhandler.TemporaryFileUploadHandler',
    ]

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


REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'kebek.elevators.pagination.MainPagination',
    'PAGE_SIZE': 10,
    'DATETIME_FORMAT': '%Y-%m-%dT%H:%M:%S%z',
    'DEFAULT_RENDERER_CLASSES': ('rest_framework.renderers.JSONRenderer',),
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAuthenticated',),
    'DEFAULT_AUTHENTICATION_CLASSES': ('rest_framework.authentication.TokenAuthentication',),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

ADMIN_REORDER = (
    {
        'app': 'users',
        'models': (
            'users.User',
            'auth.Group',
        )
    },
    'elevators',
    'management',
    'addresses',
    'policies',
    'notify',
)

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        'LOCATION': os.environ.get('MEMCACHED_ADDRESS'),
    }
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'Kebek Web API',
    'DESCRIPTION': 'Web API for Kebek Mobile Application',
    'VERSION': '1.0.0',
    'AUTHENTICATION_WHITELIST': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'SCHEMA_PATH_PREFIX': r'/api/v[0-9]',
    'SWAGGER_UI_SETTINGS': {
        'url': 'https://kebek.kz/static/openapi.yaml',
    },
}


# CELERY SETTIGS
CELERY_BROKER_URL = 'redis://redis:6379/0'
CELERY_RESULT_BACKEND = 'redis://redis:6379'

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
CELERY_TASK_DEFAULT_QUEUE = 'src_queue'


PUSH_NOTIFICATIONS_SETTINGS = {
    'FCM_API_KEY': os.environ.get('FCM_API_KEY', ''),
    'APNS_CERTIFICATE': os.environ.get('APNS_CERTIFICATE_PATH', ''),
}

sentry_sdk.init(
    dsn=os.environ.get('SENTRY_DSN', ''),
    integrations=[DjangoIntegration(), CeleryIntegration()],
    send_default_pii=True,
)
