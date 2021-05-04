import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";

//this is the room page that is accessed as soon as a guest is in a room
export default class Room extends Component {
  constructor(props) {
      super(props);
      //this is the information I want to know for each room
      this.state = {
          votesToSkip: 2,
          guestCanPause: false,
          isHost: false,
          showSettings: false,
          spotifyAuthenticated: false
      };
      //match is the prop that stores information about how we got to this component from react router
      this.roomCode = this.props.match.params.roomCode;
      //this updates the state for us and forces a rerender and should give us the room with the room code
      this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
      this.updateShowSettings = this.updateShowSettings.bind(this);
      this.renderSettingsButton = this.renderSettingsButton.bind(this);
      this.renderSettings = this.renderSettings.bind(this);
      this.getRoomDetails = this.getRoomDetails.bind(this);
      this.getRoomDetails();
      this.authenticateSpotify = this.authenticateSpotify.bind(this);
  }

  //this is for retrieving the data that's sent to our api url
  getRoomDetails() {
    //when you're doing an arrow function and there's only one line it just assumes that whatever your write 
    //after it gets returned so no need to have a return statement after
    return fetch("/api/get-room" + "?code=" + this.roomCode)
      .then((response) => {
        if (!response.ok) {
          this.props.leaveRoomCallback();
          this.props.history.push("/");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
        //only call if the user is host
        if (this.state.isHost) {
        this.authenticateSpotify();
        }
      });
  }
  //send a request to the backend and ask if the user is authenticated, but ONLY if the user is a host
  authenticateSpotify() {
    fetch('/spotify/is-authenticated')
      .then((response) => response.json())
      .then((data) => {
        //set the state of whether the user is authenticated or not
        this.setState({spotifyAuthenticated: data.status });
        //if they're not authenticated, then authenticate them
        if (!data.status) {
          fetch('/spotify/get-auth-url')
            .then((response) => response.json())
            //data is going to be the url that we need to authenticate
            .then((data) => {
              //this is going to redirect us to the spotify authorization page
              //it uses a function that is native to javascript
              //then after the user authenticates, it will redirect us to the spotify_callback function
              //that function will then save the token and then redirect us to the frontend
              //then the frontend will redirect us back to the room page
              window.location.replace(data.url);
            })
        }
      })
  }

  leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    //after we've left the room, we'll redirect to go back to the home page
    fetch("/api/leave-room", requestOptions).then((_response) => {
      this.props.leaveRoomCallback();
      this.props.history.push('/');
    });
  }
  
  //this is going to modify the state so that it's equal to this value
  updateShowSettings(value) {
    this.setState({
      showSettings: value,
    });
  }

  renderSettings() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage 
            update={true} 
            votesToSkip={this.state.votesToSkip} 
            guestCanPause={this.state.guestCanPause} 
            roomCode={this.roomCode}
            //we want this createroompage to call a function whenever we update the room so that the parent
            //function get get and update that information
            updateCallback={this.getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          {/* this button will close the settings page without rerouting the page to another url 
          it will basically delete the settings component off of the screen*/}
          <Button 
            variant="contained"
            color="secondary"  
            onClick={() => this.updateShowSettings(false)}
            >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }

  //this is going to return the html to render the settings button
  //the reason we're creating a new method is becuase we only want to show the settings button if the user
  //is a host
  renderSettingsButton() {
    return (
      <Grid item xs={12} align="center">
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => this.updateShowSettings(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  }

  render() {
    //we only want to render this main content if we're not in the settings page
    if (this.state.showSettings) {
      return this.renderSettings();
    }
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {this.roomCode}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Votes: {this.state.votesToSkip}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Guest Can Pause: {this.state.guestCanPause.toString()}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Host: {this.state.isHost.toString()}
          </Typography>
        </Grid>
        {/* this just shows conditionally to show the settings button if the user is a host or not */}
        {this.state.isHost ? this.renderSettingsButton() : null}
        <Grid item xs={12} align="center">
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={this.leaveButtonPressed}
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
  }
}