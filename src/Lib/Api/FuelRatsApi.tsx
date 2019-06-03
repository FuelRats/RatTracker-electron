import { Auth } from "../Auth/Auth";
import { RatConfig } from "../../Config";

export class FuelRatsApi {
  constructor() {}

  public async getProfile() {
    const response = await fetch(`${RatConfig.ApiUri}/profile`, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
        Authorization: `Bearer ${Auth.getToken()}`
      }
    }).then(res => {
      return res;
    });
    return response;
  }
}
