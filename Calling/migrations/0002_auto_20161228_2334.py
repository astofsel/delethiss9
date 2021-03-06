# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-12-28 22:34
from __future__ import unicode_literals

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Calling', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='callaccount',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2016, 12, 28, 22, 33, 45, 263000, tzinfo=utc)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='callaccount',
            name='owner',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='callaccount',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, default=datetime.datetime(2016, 12, 28, 22, 34, 3, 303000, tzinfo=utc)),
            preserve_default=False,
        ),
    ]
