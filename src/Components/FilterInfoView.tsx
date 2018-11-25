import {inject, observer} from "mobx-react";
import * as React from "react";
import {RootStore} from "../Lib/Stores";

@inject('store')
@observer
class FilterInfoView extends React.Component<{
    store?: RootStore
}, {}> {
    render() {
        return <div>Filter Info View</div>
    }
}

export default FilterInfoView;
