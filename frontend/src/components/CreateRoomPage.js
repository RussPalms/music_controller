import React, { Component } from "react";
//all this can be done on one line
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
//collapse allows things to appear or disappear
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

export default class CreateRoomPage extends Component{
    //these are the default parameters
    static defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
        updateCallback: () => {},
    };
    constructor(props) {
        super(props);
        // this is going to handle the state of the buttons
        this.state = {
            guestCanPause: this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip,
            errorMsg: "",
            successMsg: "",
        };

        // this is binding the method to the class so that inside the method we have 
        // access to the this keyword
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this)
        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
        this.handleUpdateButtonPressed = this.handleUpdateButtonPressed(this);
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

    handleUpdateButtonPressed() {
        const requestOptions = {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            votes_to_skip: this.state.votesToSkip,
            guest_can_pause: this.state.guestCanPause,
            code: this.props.roomCode,
          }),
        };
        fetch("/api/update-room", requestOptions)
            .then((response) => {
                if (response.ok) {
                    this.setState({
                    successMsg: "Room updated successfully!"
                    });
                } else {
                    this.setState({
                    errorMsg: "Error updating room..."
                    });
                }
                this.props.updateCallback();
            });
      }

    renderCreateButtons() {
        return (
          <Grid container spacing={1}>
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
              <Button color="secondary" variant="contained" to="/" component={Link}>
                Back
              </Button>
            </Grid>
          </Grid>
        );
      }
    
      renderUpdateButtons() {
        return (
          <Grid item xs={12} align="center">
            <Button
              color="primary"
              variant="contained"
              onClick={this.handleUpdateButtonPressed}
            >
              Update Room
            </Button>
          </Grid>
        );
      }

    render() {
        const title = this.props.update ? "Update Room" : "Create a Room"
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
                    <Collapse
                        in={this.state.errorMsg != "" || this.state.successMsg != ""}
                    >
                        {this.state.successMsg != "" ? (
                        <Alert
                            severity="success"
                            onClose={() => {
                            this.setState({ successMsg: "" });
                            }}
                        >
                            {this.state.successMsg}
                        </Alert>
                        ) : (
                        <Alert
                            severity="error"
                            onClose={() => {
                            this.setState({ errorMsg: "" });
                            }}
                        >
                            {this.state.errorMsg}
                        </Alert>
                        )}
                    </Collapse>
                </Grid>
                {/* typography is basically just a nicely styled header from 
                material-ui */}
                <Grid item xs={12} align="center">
                    <Typography component='h4' variant='h4'>
                        {title}
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
                                defaultValue={this.props.guestCanPause.toString()} 
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
                            defaultValue={this.state.votesToSkip}
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
                <Grid>
                    {this.props.update
                        ? this.renderUpdateButtons()
                        : this.renderCreateButtons()}
                </Grid>
            </Grid>
        );
    }
}