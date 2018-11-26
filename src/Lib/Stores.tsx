import { observable } from "mobx";

export class RootStore {
	@observable userProfile: any = {};
	@observable authenticated: boolean = false;
	@observable rescues: any = {};
	@observable rats: any = [];
}
