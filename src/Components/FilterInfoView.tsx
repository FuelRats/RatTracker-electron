import { observer } from "mobx-react";
import * as React from "react";
import { RootStore } from "../Lib/Stores";
import withRatData from "src/Lib/Decorators";

@observer
class FilterInfoView extends React.Component<
	{
		store: RootStore;
	} & {}
> {
	render() {
		return <div>Filter Info View</div>;
	}
}

export default withRatData()(FilterInfoView);
