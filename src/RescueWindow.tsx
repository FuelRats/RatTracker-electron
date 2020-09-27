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
import { withRatData, RatDataProps } from "./Lib/Decorators";
import { Redirect } from "react-router-dom";

const electron = window.require("electron");

const { getGlobal } = electron.remote;

@withRatData
class RescueWindow extends React.Component<
  RatDataProps,
  { CanUseRatTracker: boolean }
> {
  // @ts-ignore
  private ratSocket: RatSocket;

  private journalReader: any;

  public constructor(props: { store: RootStore }) {
    super(props);

    this.journalReader = getGlobal("JournalReader");
    this.props.store.journalData = this.journalReader.Data();

    this.state = {
      CanUseRatTracker: true,
    };

    this.ratSocket = new RatSocket();

    this.ratSocket
      .on("ratsocket:connect", async () => await this.loadInitialData())
      .on("fuelrats.rescuecreate", (data: any) => {
        console.log("create", data);
        this.updateRescues(data);
      })
      .on("fuelrats.rescueupdate", (data: any) => {
        console.log("update", data);
        this.updateRescues(data);
      })
      .on("fuelrats.rescuedelete", (data: any) => {
        console.log("delete", data);
        this.updateRescues(data);
      })
      .on("rattracker.friendrequest", (data: any) => {
        console.log("friend", data);
        this.updateRescues(data);
      })
      .on("rattracker.wingrequest", (data: any) => {
        console.log("wing", data);
        this.updateRescues(data);
      })
      .on("rattracker.systemreached", (data: any) => {
        console.log("system", data);
        this.updateRescues(data);
      });
  }

  async loadInitialData() {
    let _profile: any = (
      await this.ratSocket.request(["profiles", "read"], {})
    )[2];

    this.props.store.userProfile = _profile;

    const isDrilled = (_profile.data.meta.permissions as Array<
      string
    >).includes("dispatch.read");

    if (isDrilled) {
      let _rescues: any = (
        await this.ratSocket.request(["rescues", "search"], {
          filter: { status: { ne: "closed" } },
        })
      )[2];
      this.updateRescues(_rescues);

      setInterval(() => {
        this.props.store.journalData = this.journalReader.Data();
      }, 1000);
    } else {
      this.setState({
        CanUseRatTracker: false,
      });
    }
  }

  updateRescues(data: any) {
    if (
      Array.isArray(data) &&
      (data[0].startsWith("fuelrats.") || data[0].startsWith("rattracker."))
    ) {
      data = data[3];
    }

    let rats: any = {};
    if (!!data.included) {
      rats = data.included.filter((inc: any) => {
        return inc.type === "rats";
      });

      for (let newRat of rats) {
        this.props.store.rats[newRat.id] = newRat;
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
        this.props.store.rescues[newRescue.id] = newRescue;
      }

      for (let removeRescue of removeRescues) {
        delete this.props.store.rescues[removeRescue.id];
      }
    }
  }

  reloadBoard = async () => {
    console.log("Reloading board");
    await this.loadInitialData();
    console.log("Reloading board done");
  };

  public async componentDidMount() {
    if (!this.ratSocket.connected && this.props.store.authenticated) {
      await this.ratSocket.connect(Auth.getToken() as string);
      await this.ratSocket.subscribe();
    }
  }

  public render() {
    if (!this.state.CanUseRatTracker) {
      return <Redirect to={{ pathname: "/NotDrilled" }} />;
    }
    return (
      <div className="rootElement">
        <div className="mainContainer">
          <div className="gridItem rescuesView">
            <BoardView {...this.props} onReload={this.reloadBoard} />
          </div>
          <div className="gridItem selectedCaseView">
            <SelectedCaseView {...this.props} />
          </div>
          <div className="gridItem assignedCaseView">
            <AssignedCaseView {...this.props} />
          </div>
          <div className="gridItem playerInfoView">
            <PlayerInfoView {...this.props} />
          </div>
          <div className="gridItem filterInfoView">
            <FilterInfoView {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

export default RescueWindow;

declare global {
  interface Window {
    require: any;
  }
}
