# Generated by Django 2.2.12 on 2022-03-17 11:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_auto_20220215_1206'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='notifications_email',
            field=models.BooleanField(default=True, verbose_name='Send email notifications?'),
        ),
        migrations.AddField(
            model_name='user',
            name='notifications_sms',
            field=models.BooleanField(default=True, verbose_name='Send sms notifications?'),
        ),
    ]
