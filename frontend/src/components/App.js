import React, { Component } from "react";
import { render } from "react-dom";
import HomePage from "./HomePage";

// setting up a class for react
export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <HomePage />
            </div>
        );
    }
}

// access the react container
const appDiv = document.getElementById("app");
render(<App />, appDiv);
