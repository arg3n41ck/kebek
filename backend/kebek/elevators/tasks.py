import logging

from django.core import management

from ..celery import app

logger = logging.getLogger(__name__)


def revoke_task(obj, task_type):
    tasks = app.control.inspect().scheduled()

    for task in tasks['celery@kebek_worker']:
        if task['request']['name'] == task_type and task['request']['kwargs']['order_pk'] == obj.id:
            app.control.revoke(task['request']['id'], terminate=True)


@app.task(
    name='elevators.payment_expired',
    queue='kebek_elevators'
)
def payment_expired(order_pk):
    from .models import Order, CANCELLED

    order = Order.objects.get(id=order_pk)
    order.status = CANCELLED
    order.save()


@app.task(
    name='utils.cleanup_media',
    queue='kebek_celerybeat'
)
def cleanup_media():
    management.call_command('cleanup_unused_media', '--noinput')
