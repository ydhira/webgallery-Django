# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-03-11 21:46
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('webgallery', '0018_auto_20160312_0023'),
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
        migrations.AlterField(
            model_name='imageentry',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]