import * as React from "react";
import "./Overlay.css";

import { withRatData, RatDataProps } from "./Lib/Decorators";
import { RootStore } from "./Lib/Stores";
import { RatSocket } from "./Lib/Api/RatSocket";
import { Auth } from "./Lib/Auth/Auth";
import { copySystemName } from "./Lib/CopyString";

@withRatData
class Overlay extends React.Component<RatDataProps> {
  // @ts-ignore
  private ratSocket: RatSocket;

  public constructor(props: { store: RootStore }) {
    super(props);

    this.state = {
      CanUseRatTracker: true,
    };

    this.ratSocket = new RatSocket();

    this.ratSocket
      .on("ratsocket:connect", async () => await this.loadInitialData())
      .on("fuelrats.rescuecreate", (data: any) => this.updateRescues(data))
      .on("fuelrats.rescueupdate", (data: any) => this.updateRescues(data))
      .on("fuelrats.rescuedelete", (data: any) => this.updateRescues(data))
      .on("rattracker.friendrequest", (data: any) => this.updateRescues(data))
      .on("rattracker.wingrequest", (data: any) => this.updateRescues(data))
      .on("rattracker.systemreached", (data: any) => this.updateRescues(data));
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
    } else {
      this.setState({
        CanUseRatTracker: false,
      });
    }

    const winInst = (window as any).windowInstance;
    const header = document.getElementsByClassName("header")[0];
    winInst.setIgnoreMouseEvents(true, { forward: true });

    header!.addEventListener("mouseleave", () => {
      winInst.setIgnoreMouseEvents(true, { forward: true });
    });
    header!.addEventListener("mouseenter", () => {
      winInst.setIgnoreMouseEvents(false, { forward: true });
    });

    const root = document.getElementById("root");

    (window as any).dragItem = document.getElementsByClassName("overlay")[0];
    (window as any).dragHandle = header;

    root!.addEventListener("mousedown", (window as any).dragStart, false);
    root!.addEventListener("mouseup", (window as any).dragEnd, false);
    root!.addEventListener("mousemove", (window as any).drag, false);

    document.getElementsByTagName("body")[0].style.overflow = "hidden";
  }

  updateRescues(data: any) {
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

  public async componentDidMount() {
    if (!this.ratSocket.connected && this.props.store.authenticated) {
      await this.ratSocket.connect(Auth.getToken() as string);
      await this.ratSocket.subscribe();
    }
  }

  public render() {
    let currentRatName = "";
    let currentRatId = "";

    for (let included in this.props.store.userProfile.included) {
      let item = this.props.store.userProfile.included[included];
      if (item.type == "rats") {
        currentRatName = item.attributes.name;
        currentRatId = item.id;
        break;
      }
    }

    let rescueItems = [];
    for (let rescueKey in this.props.store.rescues) {
      let rescue = this.props.store.rescues[rescueKey];
      let assignedRescue = false;
      if (rescue.relationships.rats.data) {
        rescue.relationships.rats.data.map((rat: any) => {
          let _rat = this.props.store.rats[rat.id];

          if (!!_rat && _rat.id == currentRatId) {
            assignedRescue = true;
          }
          return null;
        });
      }
      if (assignedRescue) {
        rescueItems.push(
          <tr
            key={rescue.id}
            className="rescueRow"
            onClick={(e) => copySystemName(rescue.attributes.system, e)}
          >
            <td align={"center"}>#{rescue.attributes.data.boardIndex}</td>
            <td>{rescue.attributes.client}</td>
            <td>{rescue.attributes.system}</td>
            <td align={"center"}>{rescue.attributes.codeRed ? "✅" : "❌"}</td>
          </tr>
        );
      }
    }

    if (rescueItems.length == 0) {
      rescueItems.push(
        <tr key={-1} className="rescueRow noAssignedCase">
          <td colSpan={4} style={{ textAlign: "center" }}>
            <i>Not assigned to any case</i>
          </td>
        </tr>
      );
    }

    return (
      <div className="rootElement overlay">
        <div className="header">
          RatTracker
          <div style={{ float: "right" }} className="ratName">
            {currentRatName}
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th className="caseNumber">Case No.</th>
              <th>Client</th>
              <th>System</th>
              <th className="codeRed">Code Red</th>
            </tr>
          </thead>
          <tbody className="rescueRows">{rescueItems}</tbody>
        </table>
      </div>
    );
  }
}

export default Overlay;
