import * as React from "react";
import { withRatData, RatDataProps } from "src/Lib/Decorators";

@withRatData
class AssignedCaseView extends React.Component<RatDataProps> {
	render() {
		return <div>Assigned Case View</div>;
	}
}

export default AssignedCaseView;
