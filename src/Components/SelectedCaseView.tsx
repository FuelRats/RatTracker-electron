import * as React from "react";
import { withRatData, RatDataProps } from "../Lib/Decorators";
import { autorun, observable } from "mobx";
import { copySystemName } from "../Lib/CopyString";

@withRatData
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
      this.selectedRescue = null;
    } else {
      if (!!this.props.store.rescues[rescueId]) {
        this.selectedRescue = this.props.store.rescues[rescueId];
      } else {
        this.selectedRescue = null;
      }
    }
  }

  render() {
    return (
      <div>
        <div>
          <b>Selected Case</b>
        </div>
        {this.selectedRescue ? (
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td>Client:</td>
                <td>{this.selectedRescue.attributes.client}</td>
              </tr>
              <tr>
                <td>System:</td>
                <td
                  onClick={(e) =>
                    copySystemName(this.selectedRescue.attributes.system, e)
                  }
                >
                  {this.selectedRescue.attributes.system}
                </td>
              </tr>
              <tr>
                <td>Status:</td>
                <td>{this.selectedRescue.attributes.status}</td>
              </tr>
              <tr>
                <td>Code Red:</td>
                <td>{this.selectedRescue.attributes.codeRed ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: "top" }}>Rats:</td>
                <td>
                  {this.selectedRescue.relationships.rats.data &&
                    this.selectedRescue.relationships.rats.data.map(
                      (rat: any) => {
                        let _rat = this.props.store.rats[rat.id];

                        if (!!_rat) {
                          return (
                            <div key={_rat.id + "-" + this.selectedRescue.id}>
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
          <i>No rescue selected</i>
        )}
      </div>
    );
  }
}

export default SelectedCaseView;
