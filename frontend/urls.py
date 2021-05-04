# from django.contrib import admin
from django.urls import path
from .views import index

#django needs to know that this urls.py file belongs to the frontend app
#this is so that we can access the frontend with our spotifycallback function
app_name = 'frontend'

urlpatterns = [
    # this renders the index path whenever we render the home page
    path('', index, name =''),
    path('join', index),
    path('create', index),
    #this sets up a dynamic url in this case it is creating a string
    path('room/<str:roomCode>', index)
]