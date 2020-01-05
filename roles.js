var roleBuilder = require("role.builder");
var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleHauler = require("role.hauler");
var roadBuilder = require("role.roadBuilder");
var roleController = require("role.controller");
var roleRemoteHarvester = require("role.remoteMiner");

module.exports = {
  harvester: {
    run: roleHarvester.run,
    getPoplationLimit: function(room) {
      return room.memory.numSources * 3;
    }
  },
  builder: {
    run: roleBuilder.run,
    getPoplationLimit: function(room) {
      return 3;
    }
  },
  upgrader: {
    run: roleUpgrader.run,
    getPoplationLimit: function(room) {
      return 4;
    }
  },
  hauler: {
    run: roleHauler.run,
    getPoplationLimit: function(room) {
      var roomLevelLow = room.controller.level < 4;
      return roomLevelLow ? 0 : 5;
    }
  }
};
