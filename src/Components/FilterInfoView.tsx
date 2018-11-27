import * as React from "react";
import { withRatData, RatDataProps } from "src/Lib/Decorators";

@withRatData
class FilterInfoView extends React.Component<RatDataProps> {
	render() {
		return <div>Filter Info View</div>;
	}
}

export default FilterInfoView;
