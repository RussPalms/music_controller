# this file is going to store all the urls that are local to this app
from django.urls import path
# # here we are getting the main function from our views
# from .views import main
from .views import RoomView, CreateRoomView

urlpatterns = [
    # if we get a url that's blank, call the main function
    # this is telling us to tat the RoomView class and give us a view
    path('room', RoomView.as_view()),
    path('create-room', CreateRoomView.as_view())
]
