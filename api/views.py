from django.shortcuts import render
# # because we're working with the web, we need to import the library that deals with HttpResponses
# from django.http import HttpResponse
# this lets us create a class that inherits from a generic api view
from rest_framework import generics
# getting our serializer class
from .serializers import RoomSerializer
# we also need to import our model
from .models import Room

# # Create your views here.
# # These views represent our application's endpoints. It comes after the slash and is basically
# # a location on the webserver that you're going to

# # whenever we create a view, we need to have this request parameter in our function
# # what this function will do is return a response
# def main(request):
#     return HttpResponse("<h1>Hello</h1>")

# this allows us to create a room and return all the different rooms
class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer