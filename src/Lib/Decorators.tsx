import { RootStore } from "./Stores";
import { inject, observer } from "mobx-react";
import * as React from "react";

export type RatDataProps = {
	store: RootStore;
};

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export default function withRatData() {
	return function<T extends RatDataProps>(
		component: React.ComponentClass<T>
	) {
		class RatDataKeeper extends React.Component<any, any> {
			render() {
				const Component = component as any;
				return <Component {...this.state} {...this.props} />;
			}
		}
		return (inject("store")(
			observer(RatDataKeeper)
		) as any) as React.ComponentClass<Omit<T, keyof RatDataProps>>;
	};
}
