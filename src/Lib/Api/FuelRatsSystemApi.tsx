import { RatConfig } from "../../Config";

export class FuelRatsApi {
	constructor() {}

	public async fetchSystem(systemName: string) {
		const response = await fetch(`${RatConfig.SystemApiUri}/api/systems?filter[name.eq]=${systemName.toUpperCase()}`, {
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				Accept: "application/json"
			}
		}).then(res => {
			return res;
		});
		return response;
	}
}
