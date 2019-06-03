import * as React from "react";
import { withRatData, RatDataProps } from "../Lib/Decorators";
import { observable } from "mobx";

@withRatData
class AssignedCaseView extends React.Component<RatDataProps> {
  @observable private assignedRescue: any;

  render() {
    return (
      <div>
        <div>
          <b>Assigned Case View</b>
        </div>
        {this.assignedRescue ? (
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td>Client:</td>
                <td>{this.assignedRescue.attributes.client}</td>
              </tr>
              <tr>
                <td>System:</td>
                <td>{this.assignedRescue.attributes.system}</td>
              </tr>
              <tr>
                <td>Status:</td>
                <td>{this.assignedRescue.attributes.status}</td>
              </tr>
              <tr>
                <td>Code Red:</td>
                <td>{this.assignedRescue.attributes.codeRed ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: "top" }}>Rats:</td>
                <td>
                  {this.assignedRescue.relationships.rats.data &&
                    this.assignedRescue.relationships.rats.data.map(
                      (rat: any) => {
                        let _rat = this.props.store.rats.filter((r: any) => {
                          return r.id == rat.id;
                        });
                        if (_rat.length > 0) {
                          _rat = _rat[0];
                          return (
                            <div key={_rat.id + "-" + this.assignedRescue.id}>
                              {_rat.attributes.name}
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
          <i>Not assigned to any rescue</i>
        )}
      </div>
    );
  }
}

export default AssignedCaseView;
