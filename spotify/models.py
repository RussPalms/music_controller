from django.db import models
from api.models import Room

#associating the user key with the access token
class SpotifyToken(models.Model):
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=250)
    access_token = models.CharField(max_length=250)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)

# we need to make sure that every time a new song comes on we clear all the current votes, because those votes
# were for the previous song
class Vote(models.Model):
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    song_id = models.CharField(max_length=50)
    # when we have a foreign key we are passing in the instance of another object, in this case a room object
    # this will store a reference to our room in our vote
    # the on_delete just says that if this room gets deleted what should we do
    # what CASCADE does is delete anything that's referencing this room/the previous room
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    
