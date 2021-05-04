from django.shortcuts import render, redirect #redirect is how we redirect to a different webpage
from .credentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
#import * imports everything from the file so we can use anything defined in there
from .util import *
from api.models import Room

class AuthURL(APIView):
    def get(self, request, format=None):
        #this is all the information we want to access
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            #this will allow us to authenticate a user
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        #this generates a url for us    
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)

def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        #send the request and convert that request into json
    }).json() 

    #after we get the response we want to get the access token and the refresh token and other info
    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(
        request.session.session_key, access_token, token_type, expires_in, refresh_token)

    #this is redirecting to the frontend view
    return redirect('frontend:')

#call the utils function and return a json response
#this is an endpoint that we can hit that will tell us whether or not we're authenticated
class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(
            self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)

#responsible to returning information about current song
class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        #get access to room object to figure out who the host is
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        #now we can get information using the host's token
        endpoint = "player/currently-playing"
        #now we need to send a request to spotify
        #this is a get request so we don't have to put a boolean value for put and post
        response = execute_spotify_api_request(host, endpoint)

        #if there's no song currently playing we're not going to get any information back
        if 'error' in response or 'item' not in response:
            #so if that's the case return that to the front end
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        #after looking through the json we can parse it 
        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        #this is going to handle multiple artists
        artist_string = ""

        #we have all the artists in a string separated by commas
        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get('name')
            artist_string += name

        #this is going to contain all the information we need to send to the frontend
        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': 0,
            'id': song_id
        }
        
        #song is our custom object that we'll send to the frontend
        #our application is calling this endpoint, this endpoint in turn calls the spotify endpoint, which then gives
        #us information, we parse through it, then send back the necessary information
        return Response(song, status=status.HTTP_200_OK)
