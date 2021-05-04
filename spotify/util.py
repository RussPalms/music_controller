from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get

BASE_URL = "https://api.spotify.com/v1/me/"

def get_user_tokens(session_id):
    #checking to see if we have a token associated with a specific user
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

#this is going to save the token 
def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    #this is telling us when the token is going to expire
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token', 
                                    'refresh_token', 'expires_in' 'token_type'])
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token, 
                                refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
        tokens.save()

#check to see if the user is in the database and see if the token is expired or not if the token is 
#expired we need to authenticate it if it is not we need to refresh it
def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        expiry = tokens.expires_in
        #if the current expiry time has passed, refresh the token
        if expiry <= timezone.now():
            refresh_spotify_token(session_id)

        return True

    return False

#this is returning a new access and refresh token that we can use for our api
def refresh_spotify_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token

    response = post('http://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    #this is in case spotify changes something in the future
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')

    update_or_create_user_tokens(
        session_id, access_token, 
        token_type, expires_in, refresh_token)

#the session_id is going to be the token for the host in the room
def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_id)
    #this is how we send the correct authorization token to spotify
    headers = {'Content-Type': 'application/json', 
                'Authorization': "Bearer " +  tokens.access_token}

    #the underscores are to mirror the put and post functions
    if post_:
        #this is going to send our post request to whatever endpoint we put in
        post(BASE_URL + endpoint, headers=headers)
    if put_:
        put(BASE_URL + endpoint, headers=headers)
    
    #the empty dictionary is simply just syntax for the get request function
    #when we send a get request we're looking for information
    response = get(BASE_URL + endpoint, {}, headers=headers)
    try:
        return response.json()
    except:
        return {'Error': 'Issue with request'}

def play_song(session_id):
    return execute_spotify_api_request(session_id, "player/play", put_=True)

def pause_song(session_id):
    return execute_spotify_api_request(session_id, "player/pause", put_=True)