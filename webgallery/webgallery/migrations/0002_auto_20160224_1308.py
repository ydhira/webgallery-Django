# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-02-24 10:08
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('webgallery', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='api')),
                ('mimeType', models.CharField(max_length=20)),
            ],
        ),
        migrations.AddField(
            model_name='commententry',
            name='forImageEntry',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='webgallery.imageEntry'),
        ),
        migrations.AddField(
            model_name='drawingentry',
            name='forImageEntry',
            field=models.OneToOneField(default=0, on_delete=django.db.models.deletion.CASCADE, to='webgallery.imageEntry'),
        ),
        migrations.AlterField(
            model_name='drawingentry',
            name='drawingImage',
            field=models.ImageField(blank=True, null=True, upload_to='api'),
        ),
        migrations.AlterField(
            model_name='imageentry',
            name='imageUrl',
            field=models.URLField(null=True),
        ),
        migrations.AddField(
            model_name='image',
            name='entry',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='webgallery.imageEntry'),
        ),
    ]
