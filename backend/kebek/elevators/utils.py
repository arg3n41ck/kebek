import io
import qrcode
import requests

from django.contrib.gis.geos import Point
from django.core.files import File
from django.core.files.images import ImageFile

from rest_framework.exceptions import NotFound, PermissionDenied

from decouple import config
from PIL import Image

from ..celery import app


def is_allowed(user, elevator):
    from ..users.models import ACCOUNTANT, ADMINISTRATOR
    from .models import Elevator, Accountant, Administrator

    if user.user_role == ACCOUNTANT:
        try:
            Accountant.objects.get(elevator_id=elevator.id, accountant=user)
        except Accountant.DoesNotExist:
            raise PermissionDenied()

    elif user.user_role == ADMINISTRATOR:
        try:
            Administrator.objects.get(elevator_id=elevator.id, administrator=user)
        except Administrator.DoesNotExist:
            raise PermissionDenied()

    else:
        try:
            Elevator.objects.get(id=elevator.id, owner=user)
        except Elevator.DoesNotExist:
            raise PermissionDenied()


@app.task(
    name='elevators.get_wialon_locations',
    queue='kebek_celerybeat'
)
def get_wialon_locations():
    from .models import Vehicle, Geolocation

    url = 'https://hst-api.wialon.com/wialon/ajax.html'
    token_payload = {
        'svc': 'token/login',
        'params': f'{{"token":{config("WIALON_TOKEN")}}}'
    }

    try:
        r = requests.post(url, params=token_payload)
        if r.status_code != requests.codes.ok:
            r.raise_for_status()
            return False
    except Exception as e:
        print(e)
        return False

    token_data = r.json()

    sid = token_data['eid']
    units = token_data['user']['prp']['m_monu'][1:-1].split(',')

    for unit in units:
        unit_payload = {
            'svc': 'core/search_item',
            'params': f'{{"id":{unit},"flags":1025}}',
            'sid': sid
        }

        try:
            r = requests.post(url, params=unit_payload)
            if r.status_code != requests.codes.ok:
                r.raise_for_status()
                return False
        except Exception as e:
            print(e)
            return False

        unit_data = r.json()

        title = unit_data['item']['nm']
        latitude = unit_data['item']['pos']['y']
        longitude = unit_data['item']['pos']['x']
        vehicle = None

        try:
            vehicle = Vehicle.objects.get(wialon_id=unit)
        except Vehicle.DoesNotExist:
            try:
                vehicle = Vehicle.objects.get(title=title)
                vehicle.wialon_id = unit
                vehicle.save()
            except Vehicle.DoesNotExist:
                print(f'Vehicle {title} ({unit}) not found.')
                pass

        if vehicle:
            Geolocation.objects.create(
                vehicle=vehicle,
                position=Point(
                    float(longitude),
                    float(latitude),
                    srid=4326,
                )
            )


def create_qr(instance):
    from .models import Order, Document, PASS

    try:
        order = Order.objects.get(pk=instance.id)
    except Order.DoesNotExist:
        raise NotFound()

    passes = order.documents.filter(type=PASS)

    if passes:
        passes.delete()

    file_name = str(instance.id) + '_' + instance.elevator.title_ru + '_' + instance.created_at.strftime("%d-%m-%Y %H:%M:%S") + '.png'

    image = qrcode.make(f'https://kebek.kz/pass/{instance.id}/')
    blob = io.BytesIO()
    image.save(blob)
    image_bytes = blob.getvalue()

    file = ImageFile(io.BytesIO(image_bytes), name=file_name)

    Document.objects.create(
        order=order,
        type=PASS,
        document=file
    )


def reorient_image(im):
    try:
        image_exif = im._getexif()
        image_orientation = image_exif[274]
        if image_orientation in (2, '2'):
            return im.transpose(Image.FLIP_LEFT_RIGHT)
        elif image_orientation in (3, '3'):
            return im.transpose(Image.ROTATE_180)
        elif image_orientation in (4, '4'):
            return im.transpose(Image.FLIP_TOP_BOTTOM)
        elif image_orientation in (5, '5'):
            return im.transpose(Image.ROTATE_90).transpose(Image.FLIP_TOP_BOTTOM)
        elif image_orientation in (6, '6'):
            return im.transpose(Image.ROTATE_270)
        elif image_orientation in (7, '7'):
            return im.transpose(Image.ROTATE_270).transpose(Image.FLIP_TOP_BOTTOM)
        elif image_orientation in (8, '8'):
            return im.transpose(Image.ROTATE_90)
        else:
            return im
    except (KeyError, AttributeError, TypeError, IndexError):
        return im


def compress(image):
    if image.size < 600000:
        return image

    im = Image.open(image)

    if im.format != 'PNG':
        im = reorient_image(im)

        if im.mode != 'RGB':
            im = im.convert('RGB')

        im_io = io.BytesIO()
        im.save(im_io, 'JPEG', quality=70)

        new_image = File(im_io, name=image.name)
    else:
        im = reorient_image(im)
        im_io = io.BytesIO()
        im = im.resize((im.size[0] // 2, im.size[1] // 2))
        im.save(im_io, 'PNG', optimize=True, quality=70)

        new_image = File(im_io, name=image.name)

    if new_image:
        return new_image
    return image
