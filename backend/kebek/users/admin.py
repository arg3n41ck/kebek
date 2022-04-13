from django.contrib.auth.admin import UserAdmin
from django.contrib.gis import admin
from django.utils.translation import gettext_lazy as _

from typing import Set

from .models import User, Address, Requisites


class InlineAddressAdmin(admin.TabularInline):
    model = Address
    extra = 1


class InlineRequisitesAdmin(admin.TabularInline):
    model = Requisites
    extra = 1


@admin.register(User)
class UserAdmin(UserAdmin):
    inlines = [InlineAddressAdmin, InlineRequisitesAdmin]
    list_display = (
        'id',
        'username',
        'email',
        'first_name',
        'phone_number',
        'user_type',
        'user_role',
        'date_joined',
        'is_staff',
        'is_active',
    )
    readonly_fields = (
        'date_joined',
        'last_login',
    )
    list_filter = (
        'user_type',
        'user_role',
        'date_joined',
        'is_superuser',
        'is_active',
        'groups',
    )
    fieldsets = (
        (
            None,
            {
                'fields': (
                    'username',
                    'password',
                )
            }
        ),
        (
            _('Personal info'),
            {
                'fields': (
                    'first_name',
                    'last_name',
                    'email',
                )
            }
        ),
        (
            _('Permissions'),
            {
                'fields': (
                    'is_active',
                    'is_staff',
                    'is_superuser',
                    'groups',
                    'user_permissions',
                )
            },
        ),
        (
            _('Important dates'),
            {
                'fields': (
                    'last_login',
                    'date_joined',
                )
            }
        ),
    )
    fieldsets = UserAdmin.fieldsets + (
        (_('Additional info'),
         {'fields': (
             'user_type',
             'user_role',
             'phone_number',
             'image',
             'notifications_sms',
             'notifications_email',
         )
         }),
    )

    def has_delete_permission(self, request, obj=None):
        """
        When obj is None, the user requested the list view.
        When obj is not None, the user requested the change view of a specific instance.
        """
        return (
            request.user.is_superuser
            or request.user.groups.filter(name='Поддержка').exists()
        )

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        is_superuser = request.user.is_superuser
        disabled_fields = set()  # type: Set[str]

        if not is_superuser:
            disabled_fields |= {
                'username',
                'is_staff',
                'is_superuser',
                'groups',
                'user_permissions',
            }

        # Prevent non-superusers from editing their own permissions
        if not is_superuser and obj is not None and obj == request.user:
            disabled_fields |= {
                'is_staff',
                'is_superuser',
                'groups',
                'user_permissions',
            }

        for f in disabled_fields:
            if f in form.base_fields:
                form.base_fields[f].disabled = True

        return form
