import React, { Component } from 'react';
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

export default class CreateRoomPage extends Component{
    defaultVotes = 2;
    constructor(props) {
        super(props);
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
                <Grid item xs={12} align="center">
                    <FormControl component="fieldset">
                        <FormHelperText>
                            <div align='center'>Guest Control of Playback State</div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
            </Grid>
        );
    }
}