import os

from configurations import Configuration
from decouple import config
from django.utils.translation import gettext_lazy as _

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

RUSSIAN = 'ru'
KAZAKH = 'kk'


class Common(Configuration):
    INSTALLED_APPS = (
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
    )

    # https://docs.djangoproject.com/en/2.0/topics/http/middleware/
    MIDDLEWARE = (
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
    )

    CORS_ORIGIN_ALLOW_ALL = True
    ALLOWED_HOSTS = ['*']
    ROOT_URLCONF = 'kebek.urls'
    SECRET_KEY = config('DJANGO_SECRET_KEY')
    WSGI_APPLICATION = 'kebek.wsgi.application'

    FILE_UPLOAD_PERMISSIONS = 0o644

    # Email
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

    ADMINS = (('Author', 'freckled.cellofun@gmail.com'),)

    # Postgres
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

    # General
    APPEND_SLASH = False
    TIME_ZONE = 'Asia/Almaty'

    LANGUAGE_CODE = 'ru'
    LANGUAGES = [
        (RUSSIAN, _('Russian')),
        (KAZAKH, _('Kazakh')),
    ]

    SITE_ROOT = os.path.dirname(os.path.realpath(__name__))
    LOCALE_PATHS = [os.path.join(SITE_ROOT, 'locale')]

    # If you set this to False, Django will make some optimizations so as not
    # to load the internationalization machinery.
    USE_I18N = True
    USE_L10N = True
    USE_TZ = True
    LOGIN_REDIRECT_URL = '/'

    # Static files (CSS, JavaScript, Images)
    # https://docs.djangoproject.com/en/2.0/howto/static-files/
    STATIC_ROOT = os.path.normpath(os.path.join(os.path.dirname(BASE_DIR), 'static'))
    STATICFILES_DIRS = [os.path.join(os.path.dirname(BASE_DIR), 'assets')]
    STATIC_URL = '/static/'
    STATICFILES_FINDERS = (
        'django.contrib.staticfiles.finders.FileSystemFinder',
        'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    )

    # Media files
    MEDIA_ROOT = os.path.join(os.path.dirname(BASE_DIR), 'media')
    MEDIA_URL = '/media/'

    TEMPLATES = [
        {
            'BACKEND': 'django.template.backends.django.DjangoTemplates',
            'DIRS': [os.path.join(os.path.dirname(BASE_DIR), 'templates')],
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

    # Set DEBUG to False as a default for safety
    # https://docs.djangoproject.com/en/dev/ref/settings/#debug
    DEBUG = os.environ.get('DEBUG', True)

    # Password Validation
    # https://docs.djangoproject.com/en/2.0/topics/auth/passwords/#module-django.contrib.auth.password_validation
    AUTH_PASSWORD_VALIDATORS = [
        {
            'NAME': 'django.contrib.auth.password_validation'
                    + '.UserAttributeSimilarityValidator',
        },
        {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
        {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
        {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
    ]

    # Handlers
    FILE_UPLOAD_HANDLERS = [
        'django.core.files.uploadhandler.TemporaryFileUploadHandler',
    ]

    # Logging
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
        'filters': {'require_debug_true': {'()': 'django.utils.log.RequireDebugTrue'}},
        'handlers': {
            'console': {
                'level': 'DEBUG',
                'class': 'logging.StreamHandler',
                'formatter': 'simple',
            },
        },
        'loggers': {
            '': {'handlers': ['console'], 'level': 'INFO'},
            'django': {'handlers': ['console'], 'level': 'INFO', 'propagate': False},
        },
    }

    # Custom user app
    AUTH_USER_MODEL = 'users.User'

    # Django Rest Framework
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
            'url': 'http://127.0.0.1:8000/static/openapi.yaml',
        },
    }
