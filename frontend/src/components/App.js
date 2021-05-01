import React, { Component } from "react";
import { render } from "react-dom";

// setting up a class for react
export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<h2>Testing React Code</h2>);
    }
}

// access the react container
const appDiv = document.getElementById("app");
render(<App />, appDiv);
