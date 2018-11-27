import * as React from "react";
import { withRatData, RatDataProps } from "src/Lib/Decorators";

@withRatData
class PlayerInfoView extends React.Component<RatDataProps> {
	render() {
		return <div>Player Info View</div>;
	}
}

export default PlayerInfoView;
