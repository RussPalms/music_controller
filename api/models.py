from django.db import models
# these next two imports for for generating our unique code
import string
import random

# we want to create a unique code for our room
def generate_unique_code():
    length = 6

    # we're going to generate a bunch of codes until we find one that's unique
    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        # next we're going to check to see if all the codes in our room is unique
        if Room.objects.filter(code=code).count() == 0:
            break
    return code

# Create your models here.
# this is the database for the room
class Room(models.Model):
    # this is defining the constraints for our field
    code = models.CharField(max_length=8, default=generate_unique_code, unique=True)
    # this is going to contain information that links back to the host
    host = models.CharField(max_length=50, unique=True)
    # this next field allows the guest to play the music
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    # this means we never have to pass the date-time to our object
    # meaning whenever we create a room it automotically adds the date and time that we're at
    created_at = models.DateTimeField(auto_now_add=True)