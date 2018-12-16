module.exports = {
    localData: {
        Player: {
            CMDR: null,
            Rank: {
                CQC: {
                    Rank: 0,
                    Progress: 0,
                },
                Combat: {
                    Rank: 0,
                    Progress: 0,
                },
                Empire: {
                    Rank: 0,
                    Progress: 0,
                },
                Explore: {
                    Rank: 0,
                    Progress: 0,
                },
                Federation: {
                    Rank: 0,
                    Progress: 0,
                },
                Trade: {
                    Rank: 0,
                    Progress: 0,
                },
            },
            Pos: {
                StarSystem: null,
                Docked: true,
                Body: null,
                BodyType: null,
                StarPos: null,
                Scoopable: null,
                Supercruise: null,
            },
            Fuel: {
                Current: null,
                Max: null,
            },
            Materials: {
                Raw: [],
                Manufactured: []
            }
        },
        Gamemode: null,
        CanSynthesizeLifesupport: false
    },
    isJson(line) {
        try {
            JSON.parse(line);
        } catch (e) {
            return false;
        }

        return true;
    },
    parseStatusFile(line) {
        if (this.isJson(line)) {
            const status = JSON.parse(line);
            console.log(status);
        }
    },
    parseLogLine(line) {
        if (this.isJson(line)) {
            const logItem = JSON.parse(line);
            switch (logItem.event) {
                case 'Continued':
                    // TODO: Handle continued logs
                    break;
                case 'AfmuRepairs':
                case 'ApproachBody':
                case 'ApproachSettlement':
                case 'BuyAmmo':
                case 'BuyDrones':
                case 'Bounty':
                case 'BuyExplorationData':
                case 'BuyTradeData':
                case 'CapShipBond':
                case 'Cargo':
                case 'CargoDepot':
                case 'ChangeCrewRole':
                case 'CollectCargo':
                case 'CommunityGoal':
                case 'CommunityGoalDiscard':
                case 'CommunityGoalJoin':
                case 'CommunityGoalReward':
                case 'ClearSavedGame':
                case 'CrewAssign':
                case 'CrewFire':
                case 'CrewHire':
                case 'CrewLaunchFighter':
                case 'CrewMemberJoins':
                case 'CrewMemberQuits':
                case 'CrewMemberRoleChange':
                case 'DatalinkScan':
                case 'DatalinkVoucher':
                case 'DataScanned':
                case 'DockFigher':
                case 'DockSRV':
                case 'EjectCargo':
                case 'EndCrewSession':
                case 'EngineerApply':
                case 'EngineerContribution':
                case 'EngineerCraft':
                case 'EngineerLegacyConvert':
                case 'EngineerProgress':
                case 'FactionKillBond':
                case 'FetchRemoteModule':
                case 'FighterDestroyed':
                case 'FighterRebuilt':
                case 'Fileheader':
                case 'Friends':
                case 'Interdiction':
                case 'HeatWarning':
                case 'JetConeBoost':
                case 'JetConeDamage':
                case 'JoinACrew':
                case 'KickCrewMember':
                case 'MarketBuy':
                case 'MarketSell':
                case 'MassModuleStore':
                case 'MiningRefined':
                case 'MissionAccepted':
                case 'MissionAbandoned':
                case 'MissionCompleted':
                case 'MissionFailed':
                case 'MissionRedirected':
                case 'Missions':
                case 'ModuleInfo':
                case 'ModuleBuy':
                case 'ModuleRetrieve':
                case 'ModuleSell':
                case 'ModuleSellRemote':
                case 'ModuleStore':
                case 'ModuleSwap':
                case 'NavBeaconScan':
                case 'NewCommander':
                case 'NpcCrewPaidWage':
                case 'NpcCrewRank':
                case 'LaunchDrone':
                case 'LaunchFighter':
                case 'LaunchSRV':
                case 'LeaveBody':
                case 'Outfitting':
                case 'Passengers':
                case 'PayBounties':
                case 'PayFines':
                case 'PayLegacyFines':
                case 'Powerplay':
                case 'PowerplayCollect':
                case 'PowerplayDefect':
                case 'PowerplayDeliver':
                case 'PowerplayFastTrack':
                case 'PowerplayJoin':
                case 'PowerplayLeave':
                case 'PowerplaySalary':
                case 'PowerplayVote':
                case 'PowerplayVoucher':
                case 'Promotion':
                case 'PVPKill':
                case 'QuitACrew':
                case 'RebootRepair':
                case 'RedeemVoucher':
                case 'Repair':
                case 'RepairDrone':
                case 'RepairAll':
                case 'Reputation':
                case 'Ressurect':
                case 'RestockVehicle':
                case 'Scan':
                case 'Scanned':
                case 'ScientificResearch':
                case 'Screenshot':
                case 'SearchAndRescue':
                case 'SellExplorationData':
                case 'SellDrones':
                case 'SellShipOnRebuy':
                case 'SetUserShipName':
                case 'Shipyard':
                case 'ShipyardBuy':
                case 'ShipyardNew':
                case 'ShipyardSell':
                case 'ShipyardTransfer':
                case 'ShipyardSwap':
                case 'ShipTargeted':
                case 'Shutdown':
                case 'Statistics':
                case 'StoredShips':
                case 'StoredModules':
                case 'TechnologyBroker':
                case 'Touchdown':
                case 'UnderAttack':
                case 'USSDrop':
                case 'VehicleSwitch':
                    // We'll just ignore these events, since they contain nothing funny at the moment.
                    console.log(line);
                    break;
                case 'DiscoveryScan':
                case 'Music':
                    break;
                case 'Died':
                    // TODO: Notification about client dead
                    console.log(logItem);
                    break;
                case 'EscapeInterdiction':
                    console.log(logItem);
                    break;
                case 'HeatDamage':
                    console.log(logItem);
                    break;
                case 'HullDamage':
                    console.log(logItem);
                    break;
                case 'Interdicted':
                    console.log(logItem);
                    break;
                case 'Commander':
                    this.localData.Player.CMDR = {
                        Commander: logItem.Name
                    };
                    break;
                case 'CommitCrime':
                    console.log(logItem);
                    break;
                case 'CockpitBreached':
                    console.log(logItem);
                    break;
                case 'LoadGame':
                    delete logItem.event;
                    delete logItem.timestamp;
                    this.localData.Player.CMDR = logItem;
                    if (typeof logItem.FuelCapacity !== 'undefined') {
                        this.localData.Player.Fuel.Max = logItem.FuelCapacity;
                    }
                    if (typeof logItem.FuelLevel !== 'undefined') {
                        this.localData.Player.Fuel.Current = logItem.FuelLevel;
                    }
                    this.localData.Gamemode = logItem.GameMode;
                    break;
                case 'Location':
                    this.localData.Player.Pos = {
                        ...this.localData.Player.Pos,
                        ...logItem
                    };
                    break;
                case 'StartJump':
                    this.localData.Player.Pos = {
                        ...this.localData.Player.Pos,
                        ...logItem
                    };
                    this.localData.Player.Pos.Docked = false;
                    this.localData.Player.Pos.Body = null;
                    this.localData.Player.Pos.StarPos = null;
                    this.localData.Player.Pos.BodyType = null;
                    this.localData.Player.Pos.Scoopable = [
                        'K', 'G', 'B', 'F', 'O', 'A', 'M',
                    ].findIndex((item) => item === logItem.StarClass) !== -1;
                    break;
                case 'FSDJump':
                    this.localData.Player.Pos = {
                        ...this.localData.Player.Pos,
                        ...logItem
                    };
                    this.localData.Player.Pos.Docked = false;
                    this.localData.Player.Pos.Body = null;
                    this.localData.Player.Pos.BodyType = null;
                    if (typeof logItem.FuelLevel !== 'undefined') {
                        this.localData.Player.Fuel.Current = logItem.FuelLevel;
                    }
                    break;
                case 'Shipyard':
                    this.localData.Player.Pos = {
                        ...this.localData.Player.Pos,
                        ...{
                            StarSystem: logItem.StarSystem,
                            Body: logItem.StationName
                        }
                    };
                    break;
                case 'Market':
                    this.localData.Player.Pos = {
                        ...this.localData.Player.Pos,
                        ...{
                            StarSystem: logItem.StarSystem,
                            Body: logItem.StationName
                        }
                    };
                    break;
                case 'ShieldState':
                    console.log(logItem);
                    break;
                case 'FuelScoop':
                    this.localData.Player.Fuel.Current = logItem.Total;
                    break;
                case 'RefuelAll':
                    this.localData.Player.Fuel.Current = this.localData.Player.Fuel.Max;
                    break;
                case 'RefuelPartial':
                    console.log(logItem);
                    break;
                case 'SupercruiseEntry':
                    this.localData.Player.Pos.Docked = false;
                    this.localData.Player.Pos.Body = null;
                    this.localData.Player.Pos.BodyType = null;
                    this.localData.Player.Pos.SuperCruise = true;
                    break;
                case 'SupercruiseExit':
                    this.localData.Player.Pos.Docked = false;
                    this.localData.Player.Pos.Body = null;
                    this.localData.Player.Pos.BodyType = null;
                    this.localData.Player.Pos.SuperCruise = false;
                    break;
                case 'Undocked':
                    this.localData.Player.Pos.Docked = false;
                    this.localData.Player.Pos.Body = null;
                    this.localData.Player.Pos.BodyType = null;
                    break;
                case 'Docked':
                    this.localData.Player.Pos = {
                        ...this.localData.Player.Pos,
                        ...logItem
                    };
                    this.localData.Player.Pos.Docked = true;
                    this.localData.Player.Pos.Body = logItem.StationName;
                    this.localData.Player.Pos.BodyType = logItem.StationType;
                    this.localData.Player.Pos.SuperCruise = false;
                    break;
                case 'DockingCancelled':
                    console.log(logItem);
                    break;
                case 'DockingDenied':
                    console.log(logItem);
                    break;
                case 'DockingTimeout':
                    console.log(logItem);
                    break;
                case 'DockingRequested':
                    // TODO: Add notification to client-kiwi that they have reached a station
                    console.log(logItem);
                    break;
                case 'DockingGranted':
                    // TODO: See above
                    console.log(logItem);
                    break;
                case 'Rank':
                    this.localData.Player.Rank.CQC.Rank = logItem.CQC;
                    this.localData.Player.Rank.Combat.Rank = logItem.Combat;
                    this.localData.Player.Rank.Empire.Rank = logItem.Empire;
                    this.localData.Player.Rank.Explore.Rank = logItem.Explore;
                    this.localData.Player.Rank.Federation.Rank = logItem.Federation;
                    this.localData.Player.Rank.Trade.Rank = logItem.Trade;
                    break;
                case 'Progress':
                    this.localData.Player.Rank.CQC.Progress = logItem.CQC;
                    this.localData.Player.Rank.Combat.Progress = logItem.Combat;
                    this.localData.Player.Rank.Empire.Progress = logItem.Empire;
                    this.localData.Player.Rank.Explore.Progress = logItem.Explore;
                    this.localData.Player.Rank.Federation.Progress = logItem.Federation;
                    this.localData.Player.Rank.Trade.Progress = logItem.Trade;
                    break;
                case 'Loadout':
                    // We want to see what type of ship the user is using.
                    console.log(logItem);
                    break;
                case 'SRVDestroyed':
                    console.log(logItem);
                    break;
                case 'SendText':
                case 'ReceiveText':
                    // TODO: Add a chatbox, where you can see all communication
                    console.log(logItem);
                    break;
                case 'Materials':
                    let hasIronForSynth = false;
                    let hasNickelForSynth = false;

                    for (let index = 0; index < logItem.Raw.length; index++) {
                        const element = logItem.Raw[index];
                        if (element.Name === 'iron' && element.Count >= 2) {
                            hasIronForSynth = true;
                        } else if (element.Name === 'nickel' && element.Count >= 1) {
                            hasNickelForSynth = true;
                        }
                    }

                    this.localData.CanSynthesizeLifesupport = (hasIronForSynth && hasNickelForSynth);
                    this.localData.Player.Materials = {
                        ...this.localData.Player.Materials,
                        ...{
                            Raw: logItem.Raw,
                            Manufactured: logItem.Manufactured
                        }
                    };
                    break;
                case 'SelfDestruct':
                    console.log(logItem);
                    break;
                case 'SystemsShutdown':
                    console.log(logItem);
                    break;
                case 'MaterialTrade':
                    console.log(logItem);
                    break;
                case 'MaterialCollected':
                    // TODO: Increase the stored materials, and update the `cansynthesizelifesupport`-variable
                    console.log(logItem);
                    break;
                case 'MaterialDiscovered':
                    console.log(logItem);
                    break;
                case 'MaterialDiscarded':
                    console.log(logItem);
                    break;
                case 'Synthesis':
                    // TODO: Decrease the stored materials, and update the `cansynthesizelifesupport`-variable
                    console.log(logItem);
                    break;
                case 'WingAdd':
                    console.log(logItem);
                    break;
                case 'WingInvite':
                    console.log(logItem);
                    break;
                case 'WingLeave':
                    console.log(logItem);
                    break;
                case 'WingJoin':
                    console.log(logItem);
                    break;
                default:
                    console.log(line);
                    break;
            }
        }
    },
}