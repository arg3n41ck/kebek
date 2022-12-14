# Generated by Django 2.2.12 on 2021-12-22 15:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('elevators', '0005_auto_20211222_1447'),
        ('notify', '0002_notification_receiver'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='order',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='orders', to='elevators.Order'),
        ),
    ]
