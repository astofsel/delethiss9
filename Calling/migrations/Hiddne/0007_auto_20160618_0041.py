# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-06-17 23:41
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Calling', '0006_callaccount_notes'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='callaccount',
            name='Notes',
        ),
        migrations.AddField(
            model_name='callaccount',
            name='Notes_CallAccount',
            field=models.CharField(default='', max_length=10000),
        ),
    ]
