import * as React from "react";
import { withRatBoardData, BoardProps } from "../Lib/Decorators";
import "./BoardView.css";
import { action } from "mobx";
import { copySystemName } from "../Lib/CopyString";

@withRatBoardData
class BoardView extends React.Component<BoardProps> {
  @action.bound
  selectRescue(rescueId: string, e: any) {
    this.props.store.selectedRescue = rescueId;
  }

  render() {
    let rescueItems = [];
    for (let rescueKey in this.props.store.rescues) {
      let rescue = this.props.store.rescues[rescueKey];
      rescueItems.push(
        <tr
          key={rescue.id}
          className="rescueRow"
          onClick={(e) => this.selectRescue(rescue.id, e)}
        >
          <td align={"center"}>#{rescue.attributes.commandIdentifier}</td>
          <td align={"center"}>
            {rescue.attributes.platform != null
              ? rescue.attributes.platform.toUpperCase()
              : "unknown"}
          </td>
          <td>{rescue.attributes.client}</td>
          <td onClick={(e) => copySystemName(rescue.attributes.system, e)}>
            {rescue.attributes.system}
          </td>
          <td align={"center"}>
            {rescue.attributes.codeRed != null && rescue.attributes.codeRed
              ? "✅"
              : "❌"}
          </td>
          <td align={"center"}>
            {rescue.attributes.status == null ||
            rescue.attributes.status === "open"
              ? "✅"
              : "❌"}
          </td>
          <td colSpan={2}>
            {rescue.relationships.rats.data &&
              rescue.relationships.rats.data.map((rat: any) => {
                let _rat = this.props.store.rats[rat.id];

                if (!!_rat) {
                  return (
                    <li key={_rat.id + "-" + rescue.id}>
                      {_rat.attributes.name}
                    </li>
                  );
                }
                return null;
              })}
          </td>
        </tr>
      );
    }

    return (
      <table>
        <thead>
          <tr>
            <th className="caseNumber">Case No.</th>
            <th className="platform">Platform</th>
            <th>Client</th>
            <th>System</th>
            <th className="codeRed">Code Red</th>
            <th className="active">Active</th>
            <th>Assigned Rats</th>
            <th>
              <a className="reloadButton" onClick={this.props.onReload}>
                🔄
              </a>
            </th>
          </tr>
        </thead>
        <tbody className="rescueRows">{rescueItems}</tbody>
      </table>
    );
  }
}

export default BoardView;
