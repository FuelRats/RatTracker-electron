import * as React from "react";
import { RootStore } from "../Lib/Stores";
import withRatData from "src/Lib/Decorators";
import { observer } from "mobx-react";
@observer
class AssignedCaseView extends React.Component<
	{
		store: RootStore;
	} & {}
> {
	render() {
		return <div>Assigned Case View</div>;
	}
}

export default withRatData()(AssignedCaseView);
