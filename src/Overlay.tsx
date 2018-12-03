import * as React from "react";
import "./Overlay.css";

import { withRatData, RatDataProps } from "./Lib/Decorators";

@withRatData
class Overlay extends React.Component<RatDataProps> {
	constructor(props: RatDataProps) {
		super(props);
	}

	public render() {
		return (
			<div className="rootElement overlay">
				<div>
					Hi there,{" "}
					{this.props.store.authenticated
						? this.props.store.userProfile.data.attributes.email
						: "you're not authenticated"}
				</div>
			</div>
		);
	}
}

export default Overlay;
