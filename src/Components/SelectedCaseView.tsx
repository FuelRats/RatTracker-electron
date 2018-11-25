import {inject, observer} from "mobx-react";
import * as React from "react";
import {RootStore} from "../Lib/Stores";

@inject('store')
@observer
class SelectedCaseView extends React.Component<{
    store?: RootStore
}, {}> {
    render() {
        return <div>Selected Case View</div>
    }
}

export default SelectedCaseView;
