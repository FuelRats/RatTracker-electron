import * as React from "react";
import { Provider } from "mobx-react";
import { RootStore } from "./Lib/Stores";
import Routes from "./Routes";
import { hot } from "react-hot-loader";
import { Auth } from "./Lib/Auth/Auth";

export interface ILayoutProps {}

class Layout extends React.Component<ILayoutProps, any> {
	store = new RootStore();

	public render() {
		return (
			<Provider store={this.store}>
				<Routes />
			</Provider>
		);
	}

	public async componentDidMount() {
		if (Auth.checkIfAuthenticated() && (await Auth.validateToken())) {
			this.store!.userProfile = JSON.parse(
				localStorage.getItem("rt-userProfile") || "{}"
			);
			this.store!.authenticated = true;
		} else {
			this.store!.authenticated = true;
			Auth.sendToAuthenticate();
		}
	}
}

export default hot(module)(Layout);
