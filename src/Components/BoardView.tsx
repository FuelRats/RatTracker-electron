import {inject, observer} from "mobx-react";
import * as React from "react";
import {RootStore} from "../Lib/Stores";

@inject('store')
@observer
class BoardView extends React.Component<{
    store?: RootStore
}, {}> {
    render() {
        let rescueItems = [];
        for (let rescueKey in this.props.store!.rescues) {
            let rescue = this.props.store!.rescues[rescueKey];
            rescueItems.push(<tr key={rescue.id}>
                <td align={"center"}>#{rescue.attributes.data.boardIndex}</td>
                <td align={"center"}>{rescue.attributes.platform.toUpperCase()}</td>
                <td>{rescue.attributes.client}</td>
                <td>{rescue.attributes.system}</td>
                <td align={"center"}>{rescue.attributes.codeRed ? '✅' : '❌'}</td>
                <td align={"center"}>{rescue.attributes.status === 'open' ? '✅' : '❌'}</td>
                <td>{rescue.relationships.rats.data && rescue.relationships.rats.data.map((rat: any) => {
                    let _rat = this.props.store!.rats.filter((r: any) => {
                        return r.id == rat.id
                    });
                    if (_rat.length > 0) {
                        _rat = _rat[0];
                        return <div key={_rat.id + "-" + rescue.id}>{_rat.attributes.name}</div>
                    }
                    return null;
                })}</td>
            </tr>);
        }

        return <table>
            <thead>
            <tr>
                <th>Case No.</th>
                <th align={"center"}>Platform</th>
                <th>Client</th>
                <th>System</th>
                <th align={"center"}>Code Red</th>
                <th align={"center"}>Active</th>
                <th>Assigned Rats</th>
            </tr>
            </thead>
            <tbody className="rescueRows">
            {rescueItems}
            </tbody>
        </table>
    }
}

export default BoardView;
