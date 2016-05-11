# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-02-25 10:44
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('webgallery', '0005_auto_20160225_1344'),
    ]

    operations = [
        migrations.AlterField(
            model_name='commententry',
            name='forImageEntry',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='webgallery.ImageEntry'),
        ),
        migrations.AlterField(
            model_name='drawingentry',
            name='forImageEntry',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='webgallery.ImageEntry'),
        ),
        migrations.AlterField(
            model_name='image',
            name='entry',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='webgallery.ImageEntry'),
        ),
    ]
