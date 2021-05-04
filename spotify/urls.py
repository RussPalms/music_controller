from django.contrib import admin
from django.urls import path, include 
from .views import *

urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    #this is the path to access the callback function after authentication
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('current-song', CurrentSong.as_view())
]