from django.conf.urls import url

from . import views

urlpatterns = [

    url(r'^getLoggedUser/$', views.getLoggedUser, name='getLoggedUser'),
    url(r'^getdirectory/(?P<id>\w+)/$', views.getDirectory, name='getDirectory'),
    url(r'^getNextImg/(?P<id>\w+)/(?P<owner>\w+)/$', views.getNextImg, name='getNextImg'),
    url(r'^getPrevImg/(?P<id>\w+)/(?P<owner>\w+)/$', views.getPrevImg, name='getPrevImg'),
    url(r'^getComments/(?P<id>\w+)/$', views.getComments, name='getComments'),
    url(r'^getDrawing/(?P<id>\w+)/$', views.getDrawing, name='getDrawing'),
    url(r'^img/(?P<id>\d+)/$', views.getImage, name='getImage'),
    url(r'^img/(?P<id>\d+)/info/$', views.getImageInfo, name='getImageInfo'),
    url(r'^addImage/$', views.addImage, name='addImage'),
    url(r'^addDrawing/(?P<id>\w+)/$', views.addDrawing, name='addDrawing'),
    url(r'^deleteImage/(?P<id>\w+)/(?P<ownerID>\w+)/$', views.deleteImage, name='deleteImage'),
    url(r'^eraseImg/(?P<id>\d+)/$', views.eraseImg, name='eraseImg'),
    url(r'^deleteComment/img/(?P<idi>\w+)/cmt/(?P<idc>\w+)/$', views.deleteComment, name='deleteComment'),
    url(r'^img/(?P<id>\w+)/addComment/$', views.addComment, name='addComment'),
    url(r'^getAllUsers/$', views.getAllUsers, name='getAllUsers'),
]

