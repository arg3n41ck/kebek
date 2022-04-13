from rest_framework import serializers

from .models import Policy, PolicySubsection, FAQ, QA, SupportTicket


class PolicySubsectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PolicySubsection
        fields = (
            'id',
            'title',
            'content',
        )


class PolicySerializer(serializers.ModelSerializer):
    policy = PolicySubsectionSerializer(many=True, read_only=True)

    class Meta:
        model = Policy
        fields = (
            'id',
            'type',
            'language',
            'policy',
        )


class QASerializer(serializers.ModelSerializer):
    class Meta:
        model = QA
        fields = (
            'id',
            'question',
            'answer',
        )


class FAQSerializer(serializers.ModelSerializer):
    qa = QASerializer(many=True, read_only=True)

    class Meta:
        model = FAQ
        fields = (
            'id',
            'language',
            'qa',
        )


class SupportTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = (
            'content',
        )
