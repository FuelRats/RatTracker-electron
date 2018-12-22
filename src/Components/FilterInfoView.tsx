import * as React from "react";
import { withRatData, RatDataProps } from "../Lib/Decorators";

@withRatData
class FilterInfoView extends React.Component<RatDataProps> {
	render() {
		return (
			<div>
				<div>
					<b>Filter Info View</b>
				</div>
			</div>
		);
	}
}

export default FilterInfoView;
