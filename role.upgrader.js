var helpers = require("helpers");

var roleUpgrader = {
  run: function(upgraders) {
    upgraders.forEach(runCreep);
  },
  runCreep: runCreep
};

function runCreep(creep) {
  if (creep.memory.upgrading && creep.carry.energy == 0) {
    creep.memory.upgrading = false;
    creep.say("collecting");
  }
  if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
    creep.memory.upgrading = true;
    creep.say("upgrading");
  }

  if (creep.memory.upgrading) {
    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller);
    }
  } else {
    if (!helpers.harvestFromContainer(creep)) {
      helpers.harvest(creep);
    }
  }
}

module.exports = roleUpgrader;
