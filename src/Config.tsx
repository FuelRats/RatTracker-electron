export const RatConfig = {
	ApiUri: "https://api.fuelrats.com",
	ClientId: "0f107a5f-e0d9-4fe8-a9ae-66386cbfc6cd",
	Scope: "user.read.me rescue.read",
	WebUri: "https://fuelrats.com",
	WssUri: "wss://api.fuelrats.com",
	RandomState(): string {
		return this.rand(20, "-rattracker");
	},
	GetRequestId(type: string): string {
		return this.rand(20, `-${type}`);
	},
	rand(length: number, current: string): string {
		current = current ? current : "";
		return length
			? this.rand(
					--length,
					"0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(
						Math.floor(Math.random() * 60)
					) + current
			  )
			: current;
	}
};
