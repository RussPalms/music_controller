//this component is going to display information about the song
import React, { Component } from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  //this is going to display the current time of the song
  LinearProgress,
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";

export default class MusicPlayer extends Component {
  constructor(props) {
    //we always need to do this whenever we create a new react component
    super(props);
  }

  pauseSong() {
    const requestOptions = {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
    };
        fetch("/spotify/pause", requestOptions);
  }

  playSong() {
    const requestOptions = {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
    };
        fetch("/spotify/play", requestOptions);
  }

  skipSong() {
    const requestOptions = {
        method: 'POST',
        headers: { "Content-Type": "application/json" }
    };
        fetch("/spotify/skip", requestOptions)
  }

  //we want this to just look like a generic media player
  render() {
    //this will give us the progress of the current state of the song
    const songProgress = (this.props.time / this.props.duration) * 100;

    return (
        //cards are basically styled components that have rounded corners
      <Card>
          {/* align center should align everything vertically in the grid */}
        <Grid container alignItems="center">
            {/* xs=4 is going to be for the album cover and it's going to be on the
            furthest left with everything to the right*/}
          <Grid item align="center" xs={4}>
              {/* this is the image of the albumn cover 
              we're going to pass everything we know about a song to
              this component here
              the height and width 100% just makes sure it fills the entire container*/}
            <img src={this.props.image_url} height="100%" width="100%" />
          </Grid>
          {/* if you think of the text relative to the album cover and the title is going
          to be 2/3 the size of the grid */}
          <Grid item align="center" xs={8}>
            <Typography component="h5" variant="h5">
              {this.props.title}
            </Typography>
            {/* textSeondary is a nice gray color and subtitle1 will make it a little 
            dimmer and smaller for the title*/}
            <Typography color="textSecondary" variant="subtitle1">
              {this.props.artist}
            </Typography>
            {/* since we don't want the buttons to be in the same grid
            we'll put them in a div */}
            <div>
                {/* to use the IconButton you need to put an icon inside of the tag 
                then inside you can do things like the onClick*/}
              <IconButton onClick={() => {
                // we're calling the pause/play button and it will depend on whether or not a song is play or not
                  this.props.is_playing ? this.pauseSong() : this.playSong();
              }}
              >
                  {/* this will show a different icon based on wheteher or 
                  not a song is playing */}
                {this.props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              {/* we're using an arrow function so that we don't have to bind the skipSong function to the this 
              keyword inside the constructor, but it doesn't even matter in this case, because we're not
              even using the this keyword in the function*/}
              <IconButton onClick={() => this.skipSong()}>
                  {/* this is displaying the number of current votes and number of required votes to skip*/}
                    {this.props.votes} /{" "} 
                    {this.props.votes_required}
                    <SkipNextIcon /> 
              </IconButton>
            </div>
          </Grid>
        </Grid>
        {/* determinate gives us the value of the progress bar 
        the progress bar moves as we continue to get a new duration of the song*/}
        <LinearProgress variant="determinate" value={songProgress} />
      </Card>
    );
  }
}