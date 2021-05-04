// useState and useEffect are hooks
// we can use the useEffect to replace lifecycle methods
import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, IconButton } from "@material-ui/core";
// this is just going to consist of two pages (the help page and a back page)
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { Link } from "react-router-dom";

// I want to tell my state which page I'm on
// it doesn't matter what the value in the parentheses are, it's just convension to name them the same as 
// the state variable
const pages = {
    JOIN: "pages.join",
    CREATE: "pages.create",
};

// functional components use functions rather than classes
export default function Info(prop) {
    // this is defining our states
    // page is our variable and setPage is the function that sets our state for our variable
    // in the useState we want to pass in the value we want to initialize our state variable two
    // now whenever I want to acces the state I can use the variable page and it will start by giving me 1
    const [page, setPage] = useState(pages.JOIN);

    // we can access the state in these methods, because they're local to this functional
    // component and they don'tfunctions necessarily need to be nested inside the Info function
    function joinInfo() {
        return "Join page";
    }

    function createInfo() {
        return "Create page";
    }

    // everything that happens inside the body of this function is what would happen if we hooked into the 
    // lifecycle methods componentDidMount, componentWillMount, and componentWillUnmount
    // it takes care of all those initialization operations
    // useEffect allows us to return some function from the function we pass it and by doing that it'll automatically
    // call that function for us in turn for coponentWillUnmount
    useEffect(() => {
    console.log('ran');
    return () => console.log("cleanup");
    });
    
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    What is House Party?
                </Typography>
                <Grid item xs={12} align="center">
                    {/* body1 is similar to a standard p tag in html */}
                    <Typography variant="body1">
                        {/* we're going to be using the ternary operator */}
                        { page === pages.JOIN ? joinInfo() : createInfo()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <IconButton 
                        onClick={() => {
                            page === pages.CREATE ? setPage(pages.JOIN) : setPage(pages.CREATE);
                        }}
                        >
                            {/* this is showing the kind of icon base on what page we're on */}
                            { page === pages.CREATE ? (
                                <NavigateBeforeIcon />
                            ) : (
                                <NavigateNextIcon />
                            )}
                    </IconButton>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}