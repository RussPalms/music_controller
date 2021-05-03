import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { FormLabel } from "@material-ui/core";

export default class CreateRoomPage extends Component{
    defaultVotes = 2;
    constructor(props) {
        super(props);
        // this is going to handle the state of the buttons
        this.state = {
            guestCanPause: true,
            votesToSkip: this.defaultVotes
        };

        // this is binding the method to the class so that inside the method we have 
        // access to the this keyword
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this)
        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
    }   

    // e is the object that handles this function
    handleVotesChange(e) {
        // this is the method we want to use when modifying a state in react
        this.setState({
            // this will take the value of the specific function and place it in this
            // variable
            votesToSkip: e.target.value,
        });
    }

    handleGuestCanPauseChange(e) {
        this.setState({
            // this is an inline if statement that will handle the state of the pause button
            guestCanPause: e.target.value === "true" ? true : false,
        });
    }

    handleRoomButtonPressed() {
        // this should just show us our current state in the browser console
        // console.log(this.state);
        // now instead of loggin it lets create a request that will allow us to create the new 
        // with the information from this form
        const requestOptions = {
            method: 'POST',
            // this is telling us what type of contend is comming in
            headers: {'Content-Type': 'application/json'},
            // this is taking a javascript object and turning it into a json string that we can send
            body: JSON.stringify({
                //these field names need to have underscores in order to match what is sent in the server
                //which in this case are the values that we defined in our views.py file in frontend
                //the left is snake-case and the right is camel-case
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause
            })
        };
        //once we get a response take that response and convert it to json
        fetch('/api/create-room', requestOptions)
            .then((response) => response.json())
            //for now just console log it to see our data
            // .then((data) => console.log(data));
            .then((data) => this.props.history.push("/room/" + data.code));
    }

    render() {
        // a grid in material-ui is the standard for aligning items in a grid vertically 
        // or horizontally
        // it uses the css flexbox
        // by default it is a container and will hold items in a column structure
        // the spacing says how many items to put between items in the grid
        // the formula uses number_of_pixels * 8 
        return (
            <Grid container spacing={1}>
                {/* this item will be in the contained grid 
                xs defines the width of the grid should be when the size of it is 
                extra small, 12 is just the moximum value making the maximum
                screen width which fills the entire screen*/}
                <Grid item xs={12} align="center">
                    {/* typography is basically just a nicely styled header from 
                    material-ui */}
                    <Typography component='h4' variant='h4'>
                        Create a Room
                    </Typography>
                </Grid>
                {/* this will set the control of the playback state of our guest */}
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align='center'>Guest Control of Playback State</div>
                        </FormHelperText>
                            <RadioGroup 
                                row 
                                defaultValue="true" 
                                onChange={this.handleGuestCanPauseChange}>
                                <FormControlLabel 
                                    value="true" control={<Radio color="primary" />}
                                    label="Play/Pause"
                                    labelPlacement="bottom"
                                />
                                <FormControlLabel
                                    value="false" control={<Radio color="secondary" />}
                                    label="No Control"
                                    labelPlacement="bottom"
                                />
                            </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField 
                            required={true} 
                            type="number" 
                            onChange={this.handleVotesChange}
                            defaultValue={this.defaultVotes}
                            // the double curly braces denotes us passing in an object
                            // and that object being a javascript script
                            inputProps={{
                                // this just says that the minimum value for this 
                                // text field is 1 this is so that we don't get a 
                                // negative value for votes
                                min: 1,
                                style: { textAlign: "center"}
                            }}
                        />
                            <FormHelperText>
                                <div align="center">Votes Required To Skip Song</div>
                            </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button 
                        color="primary" 
                        variant="contained" 
                        onClick={this.handleRoomButtonPressed}
                        >
                        Create A Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    {/* this simply say that this button will contain a link that
                    will be redirected to / if it is pressed */}
                    <Button color="secondary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        );
    }
}