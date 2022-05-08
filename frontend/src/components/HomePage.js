import React, { Component } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect,
} from "react-router-dom";
import Info from "./Info";

export default class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			roomCode: null,
		};
		this.clearRoomCode = this.clearRoomCode.bind(this);
	}

	//this is dealing with components before they are rendered on the screen
	//it's a way to hook into the behavior of the react component
	//the reason we're using async is becuase we're putting an asyncronous operation component in componentDidMount
	async componentDidMount() {
		//this is going to return to us whether or not we're in a room and if we are, then get that room code
		fetch("/api/user-in-room")
			// fetch("https://fathomless-fjord-48768.herokuapp.com/api/user-in-room")
			.then((response) => response.json())
			.then((data) => {
				this.setState({
					//this setting of the state will force our component to rerender
					roomCode: data.code,
				});
			});
	}

	renderHomePage() {
		return (
			<Grid container spacing={3}>
				<Grid item xs={12} align="center">
					<Typography variant="h3" compact="h3">
						House Party
					</Typography>
				</Grid>
				<Grid item xs={12} align="center">
					<ButtonGroup
						disableElevation
						variant="contained"
						color="primary"
					>
						<Button color="primary" to="/join" component={Link}>
							Join a Room
						</Button>
						<Button color="default" to="/info" component={Link}>
							Info
						</Button>
						<Button color="secondary" to="/create" component={Link}>
							Create a Room
						</Button>
					</ButtonGroup>
				</Grid>
			</Grid>
		);
	}

	//this will set the state so that our room code is empty
	clearRoomCode() {
		this.setState({
			roomCode: null,
		});
	}

	render() {
		return (
			<Router>
				<Switch>
					<Route
						exact
						path="/"
						render={() => {
							return this.state.roomCode ? (
								<Redirect to={`/room/${this.state.roomCode}`} />
							) : (
								this.renderHomePage()
							);
						}}
					/>
					<Route path="/join" component={RoomJoinPage} />
					<Route path="/info" component={Info} />
					<Route path="/create" component={CreateRoomPage} />
					<Route
						path="/room/:roomCode"
						render={(props) => {
							//this is setting our callback and passing the methon so we can use it later on
							return (
								<Room
									{...props}
									leaveRoomCallback={this.clearRoomCode}
								/>
							);
						}}
					/>
				</Switch>
			</Router>
		);
	}
}
