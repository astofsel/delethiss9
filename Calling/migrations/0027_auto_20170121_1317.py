# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2017-01-21 12:17
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Calling', '0026_auto_20170116_2209'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lead',
            name='URL',
            field=models.URLField(null=True),
        ),
    ]
