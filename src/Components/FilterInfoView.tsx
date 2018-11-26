import { observer } from "mobx-react";
import * as React from "react";
import { withRatData, RatDataProps } from "src/Lib/Decorators";

@observer
class FilterInfoView extends React.Component<RatDataProps> {
	render() {
		return <div>Filter Info View</div>;
	}
}

export default withRatData()(FilterInfoView);
