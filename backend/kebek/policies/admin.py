from django.contrib.gis import admin

from .models import Policy, PolicySubsection, FAQ, QA, SupportTicket


class InlinePolicySubsectionAdmin(admin.TabularInline):
    model = PolicySubsection
    extra = 1


class InlineQAAdmin(admin.TabularInline):
    model = QA
    extra = 1


@admin.register(Policy)
class PolicyAdmin(admin.ModelAdmin):
    inlines = [InlinePolicySubsectionAdmin]
    list_display = (
        'id',
        'type',
        'language',
    )


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    inlines = [InlineQAAdmin]
    list_display = (
        'id',
        'language',
    )


@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'content',
        'created_at',
    )
