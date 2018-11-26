import * as React from "react";
import "./App.css";
import { RootStore } from "./Lib/Stores";
import { RatSocket } from "./Lib/Api/RatSocket";
import { Auth } from "./Lib/Auth/Auth";
import "./RescueWindow.css";
import PlayerInfoView from "./Components/PlayerInfoView";
import BoardView from "./Components/BoardView";
import SelectedCaseView from "./Components/SelectedCaseView";
import AssignedCaseView from "./Components/AssignedCaseView";
import FilterInfoView from "./Components/FilterInfoView";
import { observer } from "mobx-react";
import { withRatData, RatDataProps } from "./Lib/Decorators";

@observer
class RescueWindow extends React.Component<RatDataProps> {
	// @ts-ignore
	private ratSocket: RatSocket;

	public constructor(props: { store: RootStore }) {
		super(props);
		this.ratSocket = new RatSocket();

		this.ratSocket
			.on("ratsocket:connect", async () => await this.fetchRescues())
			.on("rescueCreated", (data: any) => this.updateRescues(data))
			.on("rescueUpdated", (data: any) => this.updateRescues(data))
			.on("rescueDeleted", (data: any) => console.log(data));
	}

	async fetchRescues() {
		let _rescues: any = await this.ratSocket.request({
			action: ["rescues", "read"],
			data: {},
			$not: { status: "closed" }
		});
		this.updateRescues(_rescues);
	}

	updateRescues(data: any) {
		let rats: any = [];
		if (!!data.included) {
			rats = data.included.filter((inc: any) => {
				return inc.type === "rats";
			});

			let removeRats: any[] = this.props.store!.rats.map((r: any) => {
				return r.id;
			});

			for (let newRat of rats) {
				let removeId = this.props.store!.rats.indexOf(
					(r: any) => r.id == newRat.id
				);
				if (removeId > -1) {
					removeRats.splice(removeId, 1);
					this.props.store!.rats[removeId] = newRat;
				} else {
					this.props.store!.rats.push(newRat);
				}
			}

			for (let removeRat of removeRats) {
				let removeId = this.props.store!.rats.indexOf(
					(r: any) => r.id == removeRat
				);
				if (removeId > -1) {
					this.props.store!.rats.splice(removeId, 1);
				}
			}
		}

		let rescues: any = {};

		if (!!data.data) {
			let newRescues = Array.isArray(data.data) ? data.data : [data.data];

			rescues = newRescues.filter((inc: any) => {
				return inc.attributes.status !== "closed";
			});

			let removeRescues = newRescues.filter((inc: any) => {
				return inc.attributes.status === "closed";
			});

			for (let newRescue of rescues) {
				this.props.store!.rescues[newRescue.id] = newRescue;
			}

			for (let removeRescue of removeRescues) {
				delete this.props.store!.rescues[removeRescue.id];
			}
		}
	}

	public async componentDidMount() {
		await this.ratSocket.connect(Auth.getToken() as string);
		await this.ratSocket.subscribe("0xDEADBEEF");
	}

	public render() {
		return (
			<div className="rootElement">
				<div className="mainContainer">
					<div className="gridItem rescuesView">
						<BoardView />
					</div>
					<div className="gridItem selectedCaseView">
						<SelectedCaseView />
					</div>
					<div className="gridItem assignedCaseView">
						<AssignedCaseView />
					</div>
					<div className="gridItem playerInfoView">
						<PlayerInfoView />
					</div>
					<div className="gridItem filterInfoView">
						<FilterInfoView />
					</div>
				</div>
			</div>
		);
	}
}

export default withRatData()(RescueWindow);
