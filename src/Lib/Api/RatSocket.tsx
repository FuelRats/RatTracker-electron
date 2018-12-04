import { RatEmitter } from "./RatEmitter";
import { RatConfig } from "../../Config";

export class RatSocket extends RatEmitter {
	private socket: WebSocket | null;
	private currentToken: string | null;
	private clientId: string | null;
	private welcomeTimeout: number | null;
	private openRequests: any;
	public connected: boolean;
	constructor() {
		super(true, [
			"rescueCreated",
			"rescueUpdated",
			"rescueDeleted",
			"connection",
			"ratsocket:connect",
			"ratsocket:disconnect",
			"ratsocket:error",
			"ratsocket:reconnect"
		]);

		this.socket = null;
		this.currentToken = null;
		this.clientId = RatConfig.GetRequestId("rtClient");
		this.welcomeTimeout = null;
		this.openRequests = {};
		this.connected = false;
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
							title: "Request Timeout"
						}
					],
					meta: {}
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
								title: "Error."
							}
						],
						meta: {}
					});
				};

			this.once("connection", onConnect)!.once(
				"ratsocket:error",
				onError
			);

			this.socket = new WebSocket(
				`${RatConfig.WssUri}?bearer=${this.currentToken}`
			);
			this.socket.onopen = () => {
				this.connectionOpened();
			};
			this.socket.onclose = data => {
				this.connectionClosed(data);
			};
			this.socket.onerror = data => {
				this.errorReceived(data);
				reject(data);
			};
			this.socket.onmessage = data => {
				this.messageReceived(data);
			};
		});
	}

	connectionOpened() {
		window.console.log("RatTracker - Connection opened");
		this.connected = true;
	}

	connectionClosed(data: Object) {
		window.console.log("RatTracker - Connection closed, reopening");
		window.console.debug(data);
		this.connected = false;
	}

	errorReceived(data: Object) {
		window.console.error(data);
	}

	messageReceived(data: any) {
		window.console.debug("RatTracker incoming data: " + data.data);

		let _data = JSON.parse(data.data);

		if (
			_data.meta.reqId &&
			this.openRequests.hasOwnProperty(_data.meta.reqId)
		) {
			this.openRequests[_data.meta.reqId](_data);
			delete this.openRequests[_data.meta.reqId];
		} else if (_data.meta.event) {
			console.log(_data.meta.event);
			this._emitEvent(_data.meta.event, _data);
		} else {
			window.console.warn(_data);
		}
	}

	async send(payload: Object) {
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

	request(msg: any) {
		if (typeof msg !== "object") {
			throw new TypeError("I want an object");
		}

		if (!Array.isArray(msg.action) || msg.action.length !== 2) {
			throw new RangeError("You must supply an array with two items.");
		}

		if (!msg.meta) {
			msg.meta = {};
		}

		if (!msg.meta.reqId) {
			msg.meta.reqId = RatConfig.GetRequestId("req");
		}

		msg.meta.clientId = this.clientId;

		if (!msg.data) {
			msg.data = {};
		}

		return new Promise((resolve, reject) => {
			let requestId = msg.meta.reqId;
			let cmd_timeout = window.setTimeout(() => {
				reject({
					errors: [
						{
							code: 408,
							detail: "Server produced no response.",
							status: "Request Timeout",
							title: "Request Timeout"
						}
					],
					meta: msg.meta
				});
			}, 15000);

			this.openRequests[requestId] = (response: any) => {
				window.clearTimeout(cmd_timeout);
				if (response.errors) {
					reject(response);
				}
				resolve(response);
			};

			this.send(msg);
		});
	}

	subscribe(channel: string) {
		let msg = { action: ["stream", "subscribe"], id: channel };
		return this.request(msg);
	}
}
