from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
import json
import os
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from django.core.urlresolvers import reverse
from .models import ImageEntry, Image, CommentEntry, DrawingEntry
from django.contrib.auth.decorators import login_required
from django.contrib.auth.decorators import permission_required
from django.contrib.auth import logout
from django.contrib.auth.models import User
# Create your views here.

def index(request):
    data = {}
    data['title'] = "Choose the person you'd like to visit"
    response =  render(request,'webgallery/index.html', data)
    return response

@login_required()
def add(request):
    data = {}
    data['title'] = "Add an image"
    data['buttonUrl'] = reverse('main',kwargs={'id':request.user.id})
    data['buttonClass'] = "close_button"
    response =  render(request,'webgallery/admin.html', data)
    return response

@login_required()
def main(request , id):
    data = {}
    data['title'] =  User.objects.get(id = id).username + "  Webgallery"
    if (request.user.id == int(id)):
        data['title'] =  "My Webgallery"
        data['buttonUrl'] = reverse('add',kwargs={})
        data['buttonClass'] = "admin_button"
    response =  render(request,'webgallery/main.html', data)
    return response

@login_required()
def credits(request):
    data = {}
    data['title'] = "Credits"
    data['buttonUrl'] = reverse('index',kwargs={})
    data['buttonClass'] = "close_button"
    response =  render(request,'webgallery/credits.html', data)
    return response

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('webgallery.views.index',))


def getLoggedUser(request):
    entry_list = User.objects.filter(id = request.user.id)
    data = serializers.serialize('json', entry_list)
    return HttpResponse(data, content_type = "application/json")


def e2o(e):
   return json.loads(serializers.serialize('json', [e]))[0];

@login_required()
def getDirectory(request,id):
    entry_list = ImageEntry.objects.filter(owner__id = id)
    data = serializers.serialize('json', entry_list)
    return HttpResponse(data, content_type = "application/json")

@login_required()
def getAllUsers(request):
    entry_list = User.objects.all()
    data = serializers.serialize('json', entry_list)
    return HttpResponse(data, content_type = "application/json")

@login_required()
def getNextImg(request, id, owner):
    next = ImageEntry.objects.filter(owner__id = owner,  id__gt = id)
    if (next):
        next.order_by('id')[0]
    else:
        next = ImageEntry.objects.filter(id=id)
    data = serializers.serialize('json', next)
    return HttpResponse(data, content_type = "application/json")

@login_required()
def getPrevImg(request, id,owner):
    prev = ImageEntry.objects.filter(owner__id = owner,id__lt = id)
    if (prev):
        prev.order_by('-id')[0]
    else:
        prev = ImageEntry.objects.filter(id=id)
    data = serializers.serialize('json', prev)
    return HttpResponse(data, content_type = "application/json")

@login_required()
def getComments(request, id ):
    entry_list = CommentEntry.objects.filter(forImageEntry=id )
    data = serializers.serialize('json', entry_list)
    return HttpResponse(data, content_type = "application/json")

@login_required()
def getDrawing(request, id ):
    entry_list = DrawingEntry.objects.filter(forImageEntry=id )
    data = serializers.serialize('json', entry_list)
    return HttpResponse(data, content_type = "application/json")

@login_required()
def getImage(request,id):
    i = Image.objects.get(id=id)
    return HttpResponse(i.image.read() , content_type=i.mimeType)

@login_required()
def getImageInfo(request, id):
    i = ImageEntry.objects.get(id=id)
    data = serializers.serialize('json',list(i))
    return HttpResponse(data , content_type="application/json")


@login_required()
@csrf_exempt
def addImage(request):
    ownerID = request.POST['owner']
    e = ImageEntry( imageTitle= request.POST['imageTitle'],\
                    imageSource= request.POST['imageSource'],\
                    imageUrl = None,\
                    owner = User.objects.get(id = ownerID) )
    e.save()

    if request.FILES:
        i = Image(entry = e,\
                    image = request.FILES['img_file'],\
                    mimeType=request.FILES['img_file'].content_type)
        i.save()
        e.imageUrl = reverse('getImage',kwargs={'id':i.id})
        e.save()

    else:
        e.imageUrl = request.POST['imageUrl']
        e.save()
    HttpResponseRedirect(reverse('main',kwargs={'id':request.user.id}))
    data = serializers.serialize('json', ImageEntry.objects.all())
    return HttpResponse(data, content_type = "application/json")



@csrf_exempt
def deleteImage(request, id,ownerID):
    prev = ImageEntry.objects.filter(owner__id = ownerID , id__lt = id)
    data = []
    if (prev):
        data = serializers.serialize('json', prev)
    else:
        next = ImageEntry.objects.filter(owner__id = ownerID , id__gt = id)
        if (next):
            data = serializers.serialize('json', next)
    ImageEntry.objects.filter(id=id).delete()
    return HttpResponse(data, content_type = "application/json")

@csrf_exempt
def deleteComment(request, idi, idc):
    CommentEntry.objects.filter(id=idc).delete()
    data = serializers.serialize('json', CommentEntry.objects.filter(forImageEntry=idi))
    return HttpResponse(data, content_type = "application/json")

@csrf_exempt
def eraseImg(request, id):
    dr = DrawingEntry.objects.filter(id=id)
    if dr:
        dr[0].delete()
    data = serializers.serialize('json', [])
    return HttpResponse(data, content_type = "application/json")

@csrf_exempt
def addComment(request , id):
    commentName = request.user.username
    i = ImageEntry.objects.get(id=id)
    e = CommentEntry( forImageEntry = i,\
                      commentName= commentName,\
                      commentContent= request.POST['commentContent'],\
                      commentMadeBy = request.user)
    e.save()
    data = serializers.serialize('json', CommentEntry.objects.filter(forImageEntry=i))  #I am just passing one comment i made right now. Later i might have to filter all the comment with the imagefor value as the pk and then send it
    return HttpResponse(data, content_type = "application/json")

@csrf_exempt
def addDrawing(request, id):
    i = ImageEntry.objects.get(id=id)
    drawing_list = DrawingEntry.objects.filter(forImageEntry=i)
    if drawing_list:
        drawing = drawing_list[0]
        drawing.drawingImage = request.POST['draw']
        drawing.save()
    else:
        e = DrawingEntry( forImageEntry = i,\
                      drawingImage = request.POST['draw'])
        e.save()
    data = serializers.serialize('json', {DrawingEntry.objects.get(forImageEntry=i)})
    return HttpResponse(data, content_type = "application/json")

