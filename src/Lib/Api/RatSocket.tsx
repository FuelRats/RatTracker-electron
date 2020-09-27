import { RatEmitter } from "./RatEmitter";
import { RatConfig } from "../../Config";

export class RatSocket extends RatEmitter {
  private socket: WebSocket | null;
  private currentToken: string | null;
  private welcomeTimeout: number | null;
  private openRequests: any;
  public connected: boolean;
  constructor() {
    super(true, [
      "fuelrats.rescuecreate",
      "fuelrats.rescueupdate",
      "fuelrats.rescuedelete",
      "rattracker.friendrequest",
      "rattracker.wingrequest",
      "rattracker.systemreached",
      "connection",
      "ratsocket:connect",
      "ratsocket:disconnect",
      "ratsocket:error",
      "ratsocket:reconnect",
    ]);

    this.socket = null;
    this.currentToken = null;
    this.welcomeTimeout = null;
    this.openRequests = {};
    this.connected = false;

    window.setInterval(() => this.checkConnectionAndReconnectIfNeeded(), 30000);
  }

  async connect(token: string) {
    this.currentToken = token;

    return new Promise((resolve, reject) => {
      this.welcomeTimeout = window.setTimeout(() => {
        window.console.error("RatTracker - Socket error, Timeout");
        reject({
          errors: [
            {
              code: 408,
              detail: "No response from server",
              status: "Request Timeout",
              title: "Request Timeout",
            },
          ],
          meta: {},
        });
      }, 60000);

      let onConnect = (data: Object) => {
          window.clearTimeout(this.welcomeTimeout!);
          this.off("ratsocket:error", onError);
          this._emitEvent("ratsocket:connect", data);
          resolve(data);
        },
        onError = (data: Object) => {
          window.clearTimeout(this.welcomeTimeout!);
          this.off("connection", onConnect);
          reject({
            errors: [
              {
                code: 500,
                detail: data,
                status: "Error.",
                title: "Error.",
              },
            ],
            meta: {},
          });
        };

      this.once("connection", onConnect)!.once("ratsocket:error", onError);

      this.socket = new WebSocket(
        `${RatConfig.WssUri}?bearer=${this.currentToken}`,
        "FR-JSONAPI-WS"
      );
      this.socket.onopen = () => {
        this.connectionOpened();
      };
      this.socket.onclose = (data) => {
        this.connectionClosed(data);
      };
      this.socket.onerror = (data) => {
        this.errorReceived(data);
        reject(data);
      };
      this.socket.onmessage = (data) => {
        this.messageReceived(data);
      };
    });
  }

  connectionOpened() {
    window.console.log("RatTracker - Connection opened");
    this.connected = true;
  }

  async connectionClosed(data: Object) {
    window.console.log("RatTracker - Connection closed, reopening");
    window.console.debug(data);
    this.connected = false;
    await this.checkConnectionAndReconnectIfNeeded();
  }

  errorReceived(data: Object) {
    window.console.error(data);
  }

  messageReceived(data: any) {
    window.console.debug("RatTracker incoming data: ", data.data);

    let _data = JSON.parse(data.data);

    if (_data[0] && this.openRequests.hasOwnProperty(_data[0])) {
      this.openRequests[_data[0]](_data);
      delete this.openRequests[_data[0]];
    } else if (_data[0]) {
      this._emitEvent(_data[0], _data);
    } else {
      window.console.warn(_data);
    }
  }

  async checkConnectionAndReconnectIfNeeded() {
    if (
      this.socket &&
      this.socket!.readyState !== 1 &&
      this.socket!.readyState > 1
    ) {
      await this.connect(this.currentToken!);
    }

    return this;
  }

  async send(payload: Object) {
    console.log("RatSocket::Send", payload);
    if (this.socket!.readyState !== 1) {
      if (this.socket!.readyState > 1) {
        await this.connect(this.currentToken!);
      }
      setTimeout(() => {
        this.send(payload);
      });
      return this;
    }

    this.socket!.send(JSON.stringify(payload));
    return this;
  }

  request(
    endpoint: Array<string>,
    query?: any,
    body?: any
  ): Promise<Array<any>> {
    if (!Array.isArray(endpoint) || endpoint.length < 1) {
      throw new RangeError("You must supply an array with two items.");
    }

    return new Promise((resolve, reject) => {
      let reqId = RatConfig.GetRequestId("req");
      let cmd_timeout = window.setTimeout(() => {
        reject({
          errors: [
            {
              code: 408,
              detail: "Server produced no response.",
              status: "Request Timeout",
              title: "Request Timeout",
            },
          ],
        });
      }, 15000);

      this.openRequests[reqId] = (response: any) => {
        window.clearTimeout(cmd_timeout);
        if (response.errors) {
          reject(response);
        }
        resolve(response);
      };

      let requestObject = [reqId, endpoint];

      if (query) {
        requestObject.push(query);
      }

      if (body) {
        requestObject.push(body);
      }

      this.send(requestObject);
    });
  }

  subscribe() {
    return this.request(
      ["events", "subscribe"],
      {
        events: [
          "fuelrats.rescuecreate",
          "fuelrats.rescueupdate",
          "fuelrats.rescuedelete",
          "rattracker.friendrequest",
          "rattracker.wingrequest",
          "rattracker.systemreached",
        ],
      },
      null
    );
  }
}
