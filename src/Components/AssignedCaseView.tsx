import {inject, observer} from "mobx-react";
import * as React from "react";
import {RootStore} from "../Lib/Stores";

@inject('store')
@observer
class AssignedCaseView extends React.Component<{
    store?: RootStore
}, {}> {
    render() {
        return <div>Assigned Case View</div>
    }
}

export default AssignedCaseView;
