import { observer } from "mobx-react";
import * as React from "react";
import { withRatData, RatDataProps } from "src/Lib/Decorators";

@observer
class SelectedCaseView extends React.Component<RatDataProps> {
	render() {
		return <div>Selected Case View</div>;
	}
}

export default withRatData()(SelectedCaseView);
