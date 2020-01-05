var helpers = require("helpers");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");

var roleHarvester = {
  run: function(harvesters, room) {
    harvesters.forEach(harvester => run(harvester, room));
  }
};

function run(creep, room) {
  //creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);

  if (creep.memory.hasEnergy && creep.carry.energy == 0) {
    creep.memory.hasEnergy = false;
    creep.say("harvesting");
  }

  if (!creep.memory.hasEnergy && creep.carry.energy == creep.carryCapacity) {
    creep.memory.hasEnergy = true;
    creep.say("storing");
  }

  if (creep.memory.hasEnergy) {
    var targets = creep.room.find(FIND_STRUCTURES, {
      filter: structure => {
        return (
          structure.structureType == STRUCTURE_STORAGE &&
          structure.store[RESOURCE_ENERGY] < structure.storeCapacity
        );
      }
    });

    if (targets.length == 0) {
      targets = creep.room.find(FIND_STRUCTURES, {
        filter: structure => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN) &&
            structure.energy < structure.energyCapacity
          );
        }
      });
    }

    if (targets.length == 0 && room.controller.level < 4) {
      targets = creep.room.find(FIND_STRUCTURES, {
        filter: structure => {
          return (
            structure.structureType == STRUCTURE_CONTAINER &&
            structure.store[RESOURCE_ENERGY] < structure.storeCapacity
          );
        }
      });
    }

    if (targets.length > 0) {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
      }
    } else {
      var target = _(room.find(FIND_CONSTRUCTION_SITES)).first();

      if (target) {
        roleBuilder.runCreep(creep, target, room);
      } else {
        roleUpgrader.runCreep(creep);
      }
    }
  } else {
    helpers.harvest(creep);
  }
}

module.exports = roleHarvester;
