# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-12-28 22:11
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Calling', '0021_auto_20161228_2310'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='callaccount',
            name='owner',
        ),
    ]
