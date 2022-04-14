from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


PRIVACY_POLICY = 'PP'
TERMS_CONDITIONS = 'TC'
ABOUT = 'AU'
RUSSIAN = 'ru'

POLICY_TYPE_CHOICE = [
    (PRIVACY_POLICY, _('Privacy policy')),
    (TERMS_CONDITIONS, _('Terms and conditions')),
    (ABOUT, _('About')),
]


class Policy(models.Model):
    type = models.CharField(
        max_length=2,
        choices=POLICY_TYPE_CHOICE,
        verbose_name=_('Type')
    )
    language = models.CharField(
        max_length=2,
        choices=settings.LANGUAGES,
        default=RUSSIAN,
        verbose_name=_('Language')
    )

    def __str__(self):
        return self.type + ': ' + self.language

    class Meta:
        unique_together = ('type', 'language')
        verbose_name = _('Policy')
        verbose_name_plural = _('Policies')


class PolicySubsection(models.Model):
    policy = models.ForeignKey(
        Policy,
        related_name='policy',
        on_delete=models.CASCADE
    )
    title = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name=_('Subtitle')
    )
    content = models.TextField(
        verbose_name=_('Content')
    )


class FAQ(models.Model):
    language = models.CharField(
        max_length=2,
        choices=settings.LANGUAGES,
        default=RUSSIAN,
        verbose_name=_('Language')
    )

    def __str__(self):
        return self.language

    class Meta:
        verbose_name = _('FAQ')
        verbose_name_plural = _('FAQ')


class QA(models.Model):
    faq = models.ForeignKey(
        FAQ,
        related_name='qa',
        on_delete=models.CASCADE
    )
    question = models.CharField(
        max_length=255,
        verbose_name=_('Question')
    )
    answer = models.TextField(
        verbose_name=_('Answer')
    )


class SupportTicket(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='support_tickets',
        verbose_name=_('User'),
    )
    content = models.TextField(
        verbose_name=_('Content')
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Created At')
    )

    class Meta:
        verbose_name = _('User request')
        verbose_name_plural = _('User requests')
