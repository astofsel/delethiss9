# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2017-01-05 23:49
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Calling', '0008_auto_20170106_0047'),
    ]

    operations = [
        migrations.AlterField(
            model_name='opportunity',
            name='size',
            field=models.DecimalField(decimal_places=2, max_digits=11),
        ),
    ]
