# from django.contrib import admin
from django.urls import path
from .views import index

urlpatterns = [
    # this renders the index path whenever we render the home page
    path('', index),
    path('join', index),
    path('create', index),
    #this sets up a dynamic url in this case it is creating a string
    path('room/<str:roomCode>', index)
]