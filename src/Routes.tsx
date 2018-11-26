import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from "./App";
import RescueWindow from "./RescueWindow";

const Routes = () => (
	<Router>
		<Switch>
			<Route path="/" exact={true} component={App} />
			<Route path="/Rescues" exact={true} component={RescueWindow} />
		</Switch>
	</Router>
);

export default Routes;
