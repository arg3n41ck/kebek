from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class AddressesConfig(AppConfig):
    name = 'kebek.addresses'
    verbose_name = _('Addresses')
