import * as React from "react";
import { withRatData, RatDataProps } from "src/Lib/Decorators";
import { observer } from "mobx-react";
@observer
class AssignedCaseView extends React.Component<RatDataProps> {
	render() {
		return <div>Assigned Case View</div>;
	}
}

export default withRatData()(AssignedCaseView);
