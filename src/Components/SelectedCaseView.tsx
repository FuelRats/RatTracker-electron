import { observer } from "mobx-react";
import * as React from "react";
import { RootStore } from "../Lib/Stores";
import withRatData from "src/Lib/Decorators";

@observer
class SelectedCaseView extends React.Component<
	{
		store: RootStore;
	} & {}
> {
	render() {
		return <div>Selected Case View</div>;
	}
}

export default withRatData()(SelectedCaseView);
