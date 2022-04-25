import logging
import requests

from decouple import config

from django.core.mail import get_connection, send_mail

logger = logging.getLogger()


def html_email(title, content):
    html_content = f'''
    <div style='font-family: 'Rubik', sans-serif; font-weight: normal; line-height: 140%; color: #092F33; background: #FAFCFA; padding: 2rem;'>
    <div style='padding-top: 3rem!important; padding-bottom: 3rem!important;'>
    <div style='width: 100%; padding-right: var(--bs-gutter-x,.75rem); padding-left: var(--bs-gutter-x,.75rem); margin-right: auto; margin-left: auto; padding-top: 3rem!important; padding-bottom: 3rem!important;'>
    <div style='text-align: center!important;'><img alt='Tumar' height='100rem;' src='https://{config('DOMAIN_NAME')}/static/logo.png'></div>
    <div style='text-align: center!important; padding-top: 3rem!important; padding-bottom: 3rem!important;'>
    <h1 style='font-size: 3rem; font-weight: bolder!important; line-height: 1.2;'>{content}</h1>
    <p>{title}</p>
    </div>
    </div>
    </div>
    </div>
    '''

    return html_content


def create_notification(user, order, status, title, content):
    from .models import Notification

    notification = Notification.objects.create(
        receiver=user,
        order=order,
        order_status=status,
        title=title,
        content=content
    )

    unread_count = Notification.objects.filter(receiver=user, read=False).count()

    return notification, unread_count


def send_sms(phone_number, content):
    payload = {
        'login': 'waviot.asia',
        'psw': 'moderator1',
        'phones': phone_number,
        'mes': content
    }
    url = 'https://smsc.kz/sys/send.php'

    try:
        r = requests.get(url, params=payload)

        if r.status_code != requests.codes.ok:
            r.raise_for_status()
            return False

    except Exception as e:
        logger.error(f'Text message was not sent: {e}')
        return False

    logger.info('Text message was sent successfully')
    return True


def send_email(email, title, content):
    connection = get_connection(
        host=config('EMAIL_HOST'),
        username=config('EMAIL_HOST_USER'),
        password=config('EMAIL_HOST_PASSWORD'),
        port=587,
        use_tls=True,
        fail_silently=True
    )

    send_mail(
        subject=content,
        message='',
        from_email=config('EMAIL_HOST_USER'),
        recipient_list=[email],
        fail_silently=True,
        auth_user=config('EMAIL_HOST_USER'),
        auth_password=config('EMAIL_HOST_PASSWORD'),
        connection=connection,
        html_message=html_email(content, title)
    )
