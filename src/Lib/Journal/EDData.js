module.exports = {
  Player: {
    CMDR: null,
    Cargo: [],
    Rank: {
      CQC: {
        Rank: 0,
        Progress: 0
      },
      Combat: {
        Rank: 0,
        Progress: 0
      },
      Empire: {
        Rank: 0,
        Progress: 0
      },
      Explore: {
        Rank: 0,
        Progress: 0
      },
      Federation: {
        Rank: 0,
        Progress: 0
      },
      Trade: {
        Rank: 0,
        Progress: 0
      }
    },
    Pos: {
      StarSystem: null,
      Docked: true,
      Body: null,
      BodyType: null,
      StarPos: null,
      Scoopable: null,
      Supercruise: null
    },
    Fuel: {
      Current: null,
      Max: null
    },
    Materials: {
      Raw: [],
      Manufactured: []
    }
  },
  Gamemode: null,
  CanSynthesizeLifesupport: false
};
