# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2017-01-13 16:32
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Calling', '0020_task_contact'),
    ]

    operations = [
        migrations.AlterField(
            model_name='opportunity',
            name='comments',
            field=models.CharField(max_length=1000, null=True),
        ),
    ]