from django.shortcuts import render
# # because we're working with the web, we need to import the library that deals with HttpResponses
# from django.http import HttpResponse
# this lets us create a class that inherits from a generic api view
# status gives us access to http status codes which we need to use when we
# return our custom response
from rest_framework import generics, status
# getting our serializer class
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
# we also need to import our model
from .models import Room
# this is a generic api view
from rest_framework.views import APIView
# this is so that we can send a custom response for our view
from rest_framework.response import Response
from django.http import JsonResponse


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

#this is to retrieve information from a created room
class GetRoom(APIView):
    serializer_class = RoomSerializer
    #this is getting the keyword argument for code
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        #GET is getting information from the url from the get request the get is looking for any parameters 
        #in the url and this is getting anything that matches the word 'code'
        code = request.GET.get(self.lookup_url_kwarg)
        #this makes sure we have a room and if we do, grab that value
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                #this is serializing a room, getting the data which will be a python dictionary 
                data = RoomSerializer(room[0]).data
                #this is checking to see if the data that we get is from the host
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            #now return this response if there is no room
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)
        
        #now take care of the case when there is no room in our url
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)
        #this should find the room that we're looking for
        if code != None:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]
                #this tells us that the user in its current session is in this room
                self.request.session['room_code'] = code
                return Response({'message': 'Room Joined!'}, status.HTTP_200_OK)
            
            return Response({'Bad Request': 'Invalid Room Code'}, status.HTTP_400_BAD_REQUEST)

        return Response({'Bad Request': 'Invalid  post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)

# what APIView does is overwrite some default methods
class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        # first checkt os see if the current user has an active session with our web 
        # server if it doesn't then create the session
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        # this will create our serializer and give us a python representation of it
        # and it will be able to check to see if the data sent was valid
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            # look at the same room in our database that is trying to create a room now
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                # whenever you're updating an object and using this method of resaving it,
                # you need to pass in the update fields with the fields you want to update
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            #this is how we get information from a session
            'code': self.request.session.get('room_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)

class LeaveRoom(APIView):
    #this is a post request, because we will be changing information on the server in this case, the fact that
    #we alredy have a room code
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            #this is returning to us the room code and removing it from the session
            self.request.session.pop('room_code')
            #checking if they're hosting a room
            host_id = self.request.session.session_key
            #if the host leaves, then everyone needs to be kicked out
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()
        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)

class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    #patch is used to update something on the server
    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            code = serializer.data.get('code')
            #find the room that has the code
            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({'msg': 'Room not found.'}, status=status.HTTP_NOT_FOUND)

            room = queryset[0]
            #check to see if whomever is updating the room is the owner of the room
            user_id = self.request.session.session_key
            if room.host != user_id:
                return Response({'msg': 'You are not the host of this room.'}, status=status.HTTP_403_FORBIDDEN)
            
            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = room.votes_to_skip
            room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

        return Response({'Bad Request': 'Invalid Data...'}, status=status.HTTP_400_BAD_REQUEST)