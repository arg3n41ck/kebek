from __future__ import absolute_import, unicode_literals
import os

from celery import Celery
from celery.schedules import crontab
from configurations import importer

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kebek.config')
os.environ.setdefault('DJANGO_CONFIGURATION', 'Production')

importer.install()

app = Celery('kebek-tasks')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

app.conf.beat_schedule = {
    'scheduled_media_cleanup': {
        'task': 'utils.cleanup_media',
        'schedule': crontab(minute=0, hour=0),
        'options': {'queue': 'kebek_celerybeat'},
    },
    # 'scheduled_get_wialon_locations': {
    #     'task': 'elevators.get_wialon_locations',
    #     'schedule': crontab(minute='*/15'),
    #     'options': {'queue': 'kebek_celerybeat'},
    # },
}
