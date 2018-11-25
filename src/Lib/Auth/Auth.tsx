import { RatConfig } from "../../Config";
import { FuelRatsApi } from "../Api/FuelRatsApi";

export class Auth {
  public static getToken() {
    return localStorage.getItem('rt-authtoken') || false;
  }

  public static checkIfAuthenticated() {
    const token = Auth.getToken() || window.location.hash || false;
    if (token) {
      localStorage.setItem('rt-authtoken', token.replace('#', ''));
    }
    return !!token;
  }

  public static async validateToken() {
    const frApi = new FuelRatsApi();
    let profile = await frApi.getProfile();
    let fetchedProfile = await profile.json();
    localStorage.setItem('rt-userProfile', JSON.stringify(fetchedProfile));
    return !!profile && profile.status === 200;
  }

  public static sendToAuthenticate() {
    window.location.href = `${RatConfig.WebUri}/authorize?client_id=${RatConfig.ClientId}&scope=${encodeURI(RatConfig.Scope)}&state=${encodeURI(RatConfig.RandomState())}&response_type=token`;
  }
}

export const GetToken = Auth.getToken;
