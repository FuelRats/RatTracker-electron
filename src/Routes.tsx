import * as React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import App from "./App";
import RescueWindow from "./RescueWindow";
import NotDrilled from "./NotDrilled";
import Overlay from "./Overlay";

const Routes = () => (
	<Router>
		<Switch>
			<Route path="/" exact={true} component={App} />
			<Route path="/NotDrilled" exact={true} component={NotDrilled} />
			<Route path="/Rescues" exact={true} component={RescueWindow} />
			<Route path="/Overlay" exact={true} component={Overlay} />
		</Switch>
	</Router>
);

export default Routes;
