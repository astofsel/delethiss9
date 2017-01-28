# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-06-08 19:05
from __future__ import unicode_literals

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('Calling', '0002_auto_20160608_1956'),
    ]

    operations = [
        migrations.AlterField(
            model_name='callaccount',
            name='uniqueID',
            field=models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False),
        ),
    ]
