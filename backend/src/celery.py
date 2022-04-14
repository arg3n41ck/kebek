import os

from celery import Celery
from celery.schedules import crontab
from configurations import importer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'src.settings')
os.environ.setdefault('DJANGO_CONFIGURATION', 'PROD')

importer.install()

app = Celery('src')

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
