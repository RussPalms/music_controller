# from django.contrib import admin
from django.urls import path
from .views import index

urlpatterns = [
    # this renders the index path whenever we render the home page
    path('', index)
]