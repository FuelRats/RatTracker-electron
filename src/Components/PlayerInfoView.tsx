import * as React from "react";
import { withRatData, RatDataProps } from "src/Lib/Decorators";

@withRatData
class PlayerInfoView extends React.Component<RatDataProps> {
	getStatusFlags(flags: number) {
		let _flags = [];

		if (flags & EDStatusFlags.Docked) _flags.push("Docked, on landing pad");
		if (flags & EDStatusFlags.Landed) _flags.push("Landet, on surface");
		if (flags & EDStatusFlags.LandingGearDown)
			_flags.push("Landing gear down");
		if (flags & EDStatusFlags.ShieldsUp) _flags.push("Shields up");
		if (flags & EDStatusFlags.SuperCruise) _flags.push("Supercruise");
		if (flags & EDStatusFlags.FlightAssistOff)
			_flags.push("Flight Assist Off");
		if (flags & EDStatusFlags.HardpointsDeployed)
			_flags.push("Hardpoints deployed");
		if (flags & EDStatusFlags.InWing) _flags.push("In Wing");
		if (flags & EDStatusFlags.LightsOn) _flags.push("Lights On");
		if (flags & EDStatusFlags.CargoScoopDeployed)
			_flags.push("Cargo Scoop Deployed");
		if (flags & EDStatusFlags.SilentRunning) _flags.push("Silent Running");
		if (flags & EDStatusFlags.ScoopingFuel) _flags.push("Scooping Fuel");
		if (flags & EDStatusFlags.SrvHandbrake) _flags.push("SRV - Handbrake");
		if (flags & EDStatusFlags.SrvTurretView)
			_flags.push("SRV - Turret View");
		if (flags & EDStatusFlags.SrvTurretRetracted)
			_flags.push("SRV - Turret Retracted");
		if (flags & EDStatusFlags.SrvDriveAssist)
			_flags.push("SRV - Drive Assist");
		if (flags & EDStatusFlags.FsdMasslocked)
			_flags.push("FSD - Mass Locked");
		if (flags & EDStatusFlags.FsdCharging) _flags.push("FSD - Charging");
		if (flags & EDStatusFlags.FsdCooldown) _flags.push("FSD - Cooldown");
		if (flags & EDStatusFlags.LowFuel) _flags.push("Low fuel (< 25%)");
		if (flags & EDStatusFlags.OverHeating)
			_flags.push("Overheating (> 100%)");
		if (flags & EDStatusFlags.HasLatLong) _flags.push("Near planet");
		if (flags & EDStatusFlags.IsInDanger) _flags.push("Is in danger");
		if (flags & EDStatusFlags.BeingInterdicted)
			_flags.push("Being interdicted");
		if (flags & EDStatusFlags.InMainShip) _flags.push("In Main Ship");
		if (flags & EDStatusFlags.InFighter) _flags.push("In Fighter");
		if (flags & EDStatusFlags.InSRV) _flags.push("In SRV");
		if (flags & EDStatusFlags.HudInAnalysisMode)
			_flags.push("Hud in Analysis Mode");
		if (flags & EDStatusFlags.NightVision) _flags.push("Night Vision");

		if (flags == 0) _flags.push("Offline");

		return <div>{_flags.join("<br />")}</div>;
	}

	render() {
		let _data = this.props.store.journalData.Data();
		return (
			<div>
				<div>
					<b>Player Info View</b>
				</div>
				<table style={{ width: "100%" }}>
					<tbody>
						<tr>
							<td>Commander</td>
							<td align="right">{_data.Player.CMDR.Commander}</td>
						</tr>
						<tr>
							<td>Current system</td>
							<td align="right">{_data.Player.Pos.StarSystem}</td>
						</tr>
						{_data.Player.Pos.Docked ? (
							<tr>
								<td>Docked at</td>
								<td align="right">
									{_data.Player.Pos.Body} (
									{_data.Player.Pos.BodyType})
								</td>
							</tr>
						) : null}
						<tr>
							<td>Current ship</td>
							<td align="right">
								{_data.Player.CMDR.ShipName}
								<br />
								{_data.Player.CMDR.Ship} (
								{_data.Player.CMDR.ShipIdent})
							</td>
						</tr>
						<tr>
							<td>Gamemode</td>
							<td align="right">{_data.Gamemode}</td>
						</tr>
						<tr>
							<td style={{ verticalAlign: "top" }}>Status</td>
							<td align="right">
								{this.getStatusFlags(_data.Status.Flags)}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}

enum EDStatusFlags {
	Offline = 0,
	Docked = 1,
	Landed = 2,
	LandingGearDown = 4,
	ShieldsUp = 8,
	SuperCruise = 16,
	FlightAssistOff = 32,
	HardpointsDeployed = 64,
	InWing = 128,
	LightsOn = 256,
	CargoScoopDeployed = 512,
	SilentRunning = 1024,
	ScoopingFuel = 2048,
	SrvHandbrake = 4096,
	SrvTurretView = 8192,
	SrvTurretRetracted = 16384,
	SrvDriveAssist = 32768,
	FsdMasslocked = 65536,
	FsdCharging = 131072,
	FsdCooldown = 262144,
	LowFuel = 524288,
	OverHeating = 1048576,
	HasLatLong = 2097152,
	IsInDanger = 4194304,
	BeingInterdicted = 8388608,
	InMainShip = 16777216,
	InFighter = 33554432,
	InSRV = 67108864,
	HudInAnalysisMode = 134217728,
	NightVision = 268435456
}

export default PlayerInfoView;
