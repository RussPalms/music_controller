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