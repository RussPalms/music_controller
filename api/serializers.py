from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        # this contains all the fields we want to include in our serialization
        # these should match whatever is in your model
        # the id field is used to identify a model
        # it's automatically created when a model is created and in this case, when 
        # we insert a new room into our database
        fields = ('id', 'code', 'host', 'guest_can_pause', 'votes_to_skip', 'created_at')

# this is to set up a new post request
class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        # these are the fields that we want to send in our post request
        fields = ('guest_can_pause', 'votes_to_skip')

class UpdateRoomSerializer(serializers.ModelSerializer):
    #redifining the codefield in our model so that we don't use the already defined one
    #this is because we need to reuse the code that has already been defined since at this point in time
    #we are already in a room
    code = serializers.CharField(validators=[])
    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip', 'code')