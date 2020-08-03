import { RatConfig } from "../../Config";
import { FuelRatsApi } from "../Api/FuelRatsApi";

export class Auth {
  public static getToken() {
    return localStorage.getItem("rt-authtoken") || false;
  }

  public static checkIfAuthenticated() {
    let token = Auth.getToken();
    if (!token || token.length < 6) {
      if (window.location.hash.indexOf("access_token") > -1) {
        token = window.location.hash.replace("#/?access_token=", "");
      } else {
        token = false;
      }
    }
    if (token) {
      localStorage.setItem("rt-authtoken", token);
    }
    return !!token;
  }

  public static async validateToken() {
    const frApi = new FuelRatsApi();
    let profile = await frApi.getProfile();
    let fetchedProfile = await profile.json();
    localStorage.setItem("rt-userProfile", JSON.stringify(fetchedProfile));
    return !!profile && profile.status === 200;
  }

  public static sendToAuthenticate() {
    window.location.href = `${RatConfig.WebUri}/authorize?client_id=${
      RatConfig.ClientId
    }&scope=${encodeURI(RatConfig.Scope)}&state=${encodeURI(
      RatConfig.RandomState()
    )}&response_type=token&redirect_uri=http://rattracker/auth`;
  }
}

export const GetToken = Auth.getToken;
