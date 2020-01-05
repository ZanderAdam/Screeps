var helpers = require("helpers");

var roleRemoteMiner = {
  run: function(creeps, room) {
    creeps.forEach(creep => run(creep, room));
  }
};

function run(creep) {
  if (creep.memory.hasEnergy && creep.carry.energy == 0) {
    creep.memory.hasEnergy = false;
    creep.say("harvesting");
  }
  if (!creep.memory.hasEnergy && creep.carry.energy == creep.carryCapacity) {
    creep.memory.hasEnergy = true;
    creep.say("storing");
  }

  if (creep.memory.hasEnergy) {
    var targets = room.find(FIND_STRUCTURES, {
      filter: structure => {
        return (
          structure.structureType == STRUCTURE_STORAGE &&
          structure.store[RESOURCE_ENERGY] < structure.storeCapacity
        );
      }
    });

    if (targets.length == 0) {
      targets = room.find(FIND_STRUCTURES, {
        filter: structure => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN) &&
            structure.energy < structure.energyCapacity
          );
        }
      });
    }

    if (targets.length > 0) {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
      }
    }
  } else {
    var flag = Game.flags.RemoteMining;

    if (flag.room && flag.room.name === creep.room.name) {
      helpers.harvest(creep);
    } else {
      creep.moveTo(flag);
    }
  }
}

module.exports = roleRemoteMiner;
