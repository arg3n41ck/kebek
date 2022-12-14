# Generated by Django 2.2.12 on 2022-02-03 10:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notify', '0004_auto_20220126_1146'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='notification',
            options={'ordering': ['-id'], 'verbose_name': 'Notification', 'verbose_name_plural': 'Notifications'},
        ),
        migrations.AddField(
            model_name='notification',
            name='in_history',
            field=models.BooleanField(default=True),
        ),
    ]
