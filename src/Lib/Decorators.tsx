import { RootStore } from "./Stores";
import { inject, observer } from "mobx-react";
import * as React from "react";

export type RatDataProps = {
	store: RootStore;
};

export function withRatData<T extends React.ComponentClass<RatDataProps>>(
	component: T
): T {
	return inject("store")(observer(component)) as T;
}
