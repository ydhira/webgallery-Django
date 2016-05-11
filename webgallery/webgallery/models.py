from __future__ import unicode_literals
from django.db import models
from datetime import datetime
import os
from django.contrib.auth.models import User

# Create your models here.

def get_image_path(instance, filename):
    return os.path.join('photos', str(instance.id), filename)

class ImageEntry(models.Model):
    owner = models.ForeignKey(User)
    imageTitle = models.CharField(max_length = 200)
    imageUrl = models.URLField(max_length= 200 , null = True)
    imageSource = models.CharField(max_length=200)

    def __unicode__(self):
        return self.imageTitle

class Image(models.Model):
    entry = models.OneToOneField(ImageEntry, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='api')
    mimeType = models.CharField(max_length=20)

class CommentEntry(models.Model):
    commentMadeBy = models.ForeignKey(User,  default=0)
    forImageEntry = models.ForeignKey(ImageEntry, on_delete=models.CASCADE , default=0)
    commentName = models.CharField(max_length = 200)
    commentContent = models.CharField(max_length = 200)
    commentDate = models.DateTimeField(default=datetime.now, blank=True)

class DrawingEntry(models.Model):
    forImageEntry = models.OneToOneField(ImageEntry, on_delete=models.CASCADE)
    drawingImage = models.CharField(max_length=200 , default = "")

