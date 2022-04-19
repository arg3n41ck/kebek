import uuid

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.encoding import python_2_unicode_compatible
from django.utils.translation import gettext_lazy as _

from rest_framework.authtoken.models import Token

from faker import Factory as FakerFactory
from phonenumber_field.modelfields import PhoneNumberField

from ..elevators.models import City
from ..elevators.utils import compress
from ..notify.utils import send_sms


NEW_ACCOUNT = 'NA'
RESET_PASSWORD = 'RP'

SMS_TYPE_CHOICES = [
    (NEW_ACCOUNT, _('New Account Activation')),
    (RESET_PASSWORD, _('Reset Password'))
]

ADMINISTRATION = 'AN'
LEGAL_PERSON = 'LP'
NATURAL_PERSON = 'NP'

USER_TYPE_CHOICES = [
    (ADMINISTRATION, _('Administration')),
    (NATURAL_PERSON, _('Natural person')),
    (LEGAL_PERSON, _('Legal person'))
]

OWNER = 'OW'
ACCOUNTANT = 'AC'
ADMINISTRATOR = 'AR'
CLIENT = 'CL'

USER_ROLE_CHOICES = [
    (OWNER, _('Owner')),
    (ACCOUNTANT, _('Accountant')),
    (ADMINISTRATOR, _('Administrator')),
    (CLIENT, _('Client'))
]


@python_2_unicode_compatible
class User(AbstractUser):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    username = models.CharField(
        max_length=16,
        unique=True,
        verbose_name=_('Username'),
    )
    first_name = models.CharField(
        max_length=128,
        blank=True,
        verbose_name=_('Name')
    )
    email = models.EmailField(
        null=True,
        blank=True,
        verbose_name=_('Email address')
    )
    phone_number = PhoneNumberField(
        null=True,
        blank=True,
        verbose_name=_('Phone Number')
    )
    user_type = models.CharField(
        max_length=2,
        choices=USER_TYPE_CHOICES,
        default=LEGAL_PERSON,
        blank=True,
        null=True,
        verbose_name=_('Type of user')
    )
    user_role = models.CharField(
        max_length=2,
        choices=USER_ROLE_CHOICES,
        default=CLIENT,
        verbose_name=_('Role of user')
    )
    image = models.ImageField(
        upload_to='images/users/',
        max_length=150,
        null=True,
        blank=True,
        verbose_name=_('Profile Picture'),
    )
    notifications_sms = models.BooleanField(
        default=True,
        verbose_name=_('Send sms notifications?')
    )
    notifications_email = models.BooleanField(
        default=True,
        verbose_name=_('Send email notifications?')
    )

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')

    def __str__(self):
        return str(self.username)

    def save(self, *args, **kwargs):
        if self.image:
            new_image = compress(self.image)
            self.image = new_image

        super().save(*args, **kwargs)


class SMSVerification(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sms_codes',
        null=True
    )
    code = models.CharField(
        max_length=6,
        blank=True
    )
    activated = models.BooleanField(
        default=False
    )
    type = models.CharField(
        max_length=2,
        choices=SMS_TYPE_CHOICES,
        default=NEW_ACCOUNT,
        verbose_name=_('Type of the SMS Verification')
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    phone_num = PhoneNumberField(
        null=True,
        blank=True,
        verbose_name=_('Phone Number')
    )

    def save(self, *args, **kwargs):
        if self._state.adding is True:
            faker = FakerFactory.create()
            self.code = faker.numerify(text='######')

        super().save(*args, **kwargs)

    def activate_user(self, prompt_code: str):
        if self.code != prompt_code:
            return False

        self.user.is_active = True
        self.user.save()

        self.activate()
        return True

    def activate(self):
        self.activated = True
        self.save()

    def check_code(self, prompt_code: str):
        if self.code != prompt_code:
            return False
        return True

    def send_sms(self):
        if self.user is None:
            temp_phone_num = self.phone_num
        else:
            temp_phone_num = self.user.username

        return send_sms(temp_phone_num, f'Ваш проверочный код для регистрации на kebek.kz: {self.code}')


class Address(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='addresses'
    )
    city = models.ForeignKey(
        City,
        on_delete=models.PROTECT,
        related_name='addresses',
        verbose_name=_('City')
    )
    address = models.CharField(
        max_length=255,
        verbose_name=_('Address')
    )


class Requisites(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='requisites'
    )
    title = models.CharField(
        max_length=255,
        verbose_name=_('Title')
    )
    bin = models.CharField(
        max_length=80,
        verbose_name=_('BIN')
    )
    bik = models.CharField(
        max_length=80,
        verbose_name=_('BIK')
    )
    checking_account = models.CharField(
        max_length=128,
        verbose_name=_('Checking account')
    )


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
