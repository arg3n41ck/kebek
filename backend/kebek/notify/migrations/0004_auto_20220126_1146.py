# Generated by Django 2.2.12 on 2022-01-26 11:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notify', '0003_notification_order'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='created_at',
            field=models.DateField(auto_now_add=True),
        ),
    ]
