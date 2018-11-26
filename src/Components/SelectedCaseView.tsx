import { observer } from "mobx-react";
import * as React from "react";
import { withRatData, RatDataProps } from "src/Lib/Decorators";
import { autorun, observable } from "mobx";

@observer
class SelectedCaseView extends React.Component<RatDataProps> {
	constructor(props: RatDataProps) {
		super(props);
		autorun(() => {
			this.fetchRescueInfo(this.props.store.selectedRescue);
		});
	}

	@observable private selectedRescue: any;

	fetchRescueInfo(rescueId: string) {
		if (!rescueId) {
			console.log("No rescue selected");
			this.selectedRescue = null;
		} else {
			if (!!this.props.store.rescues[rescueId]) {
				this.selectedRescue = this.props.store.rescues[rescueId];
			}
		}
	}

	render() {
		return (
			<div>
				<div>Selected Case</div>
				{this.selectedRescue ? (
					<table style={{ width: "100%" }}>
						<tbody>
							<tr>
								<td>Client:</td>
								<td>{this.selectedRescue.attributes.client}</td>
							</tr>
							<tr>
								<td>System:</td>
								<td>{this.selectedRescue.attributes.system}</td>
							</tr>
							<tr>
								<td>Status:</td>
								<td>{this.selectedRescue.attributes.status}</td>
							</tr>
							<tr>
								<td style={{ verticalAlign: "top" }}>Rats:</td>
								<td>
									{this.selectedRescue.relationships.rats
										.data &&
										this.selectedRescue.relationships.rats.data.map(
											(rat: any) => {
												let _rat = this.props.store.rats.filter(
													(r: any) => {
														return r.id == rat.id;
													}
												);
												if (_rat.length > 0) {
													_rat = _rat[0];
													return (
														<div
															key={
																_rat.id +
																"-" +
																this
																	.selectedRescue
																	.id
															}
														>
															{
																_rat.attributes
																	.name
															}
														</div>
													);
												}
												return null;
											}
										)}
								</td>
							</tr>
							<tr>
								<td>Distance:</td>
								<td>
									<i>Not implemented</i>
								</td>
							</tr>
							<tr>
								<td>Jumps:</td>
								<td>
									<i>Not implemented</i>
								</td>
							</tr>
						</tbody>
					</table>
				) : (
					<i>No rescue selected</i>
				)}
			</div>
		);
	}
}

export default withRatData()(SelectedCaseView);
