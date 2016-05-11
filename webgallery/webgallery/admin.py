from django.contrib import admin

# Register your models here.

from .models import ImageEntry, Image, CommentEntry, DrawingEntry

admin.site.register(ImageEntry)
admin.site.register(Image)
admin.site.register(CommentEntry)
admin.site.register(DrawingEntry)

