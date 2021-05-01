"""music_app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include # always add include whenever you need to include the urls for your new app

urlpatterns = [
    # this is the main url whenever something is typed in
    path('admin/', admin.site.urls),
    # what this says is whatever is entered in the path, dispatch it to api.urls
    path('api/', include('api.urls')),
    # this is the path that points towards the frontend
    path('', include('frontend.urls'))
]
