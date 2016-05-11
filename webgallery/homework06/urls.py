"""homework06 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.contrib import admin
from webgallery import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^webgallery/', include('webgallery.urls')),
    url(r'^(?:index.html)?$', views.index, name='index'),
    url(r'^add/$', views.add, name='add'),
    url(r'^credits/$', views.credits, name='credits'),
    url(r'^main/(?P<id>\w+)/$', views.main, name='main'),
]

# Authentication
urlpatterns += [
    url(r'^login/$', 'django.contrib.auth.views.login', { 'template_name': 'webgallery/login.html'}, name='login'),
    url(r'^accounts/login/$', 'django.contrib.auth.views.login', { 'template_name': 'webgallery/login.html'}, name='login'),
    url(r'^logout/$', views.logout_view, name='logout'),
]