var roleHarvester = require("role.upgrader");
var helpers = require("helpers");

var roleBuilder = {
  /** @param {Creep} creep **/
  run: function(builders, room) {
    var hasSpecial = _(builders).some({ memory: { isSpecial: true } });

    if (builders.length > 4 && !hasSpecial) {
      builders[0].memory.isSpecial = true;
    }

    var target;

    if (room.memory.buildTargetId != 0) {
      target = Game.getObjectById(room.memory.buildTargetId);
    }

    if (!target || target.progress == target.progressTotal) {
      target = _(room.find(FIND_CONSTRUCTION_SITES)).first();

      if (target) {
        room.memory.buildTargetId = target.id;
        console.log(
          "Got new build target " + target.strucureType + " at " + target.pos
        );
      } else {
        room.memory.buildTargetId = 0;
      }
    }

    if (!room.memory.maxRepairHp) {
      room.memory.maxRepairHp = 50000;
    }

    builders.forEach(builder => runCreep(builder, target, room));
  },
  runCreep: runCreep
};

function runCreep(creep, target, room) {
  if (creep.memory.isRemote) {
    var claimFlag = Game.flags["Claim"];

    if (claimFlag.room && claimFlag.room.name !== creep.room.name) {
      creep.moveTo(claimFlag);
      return;
    }
  }

  if (creep.memory.building && creep.carry.energy == 0) {
    creep.memory.building = false;
    creep.say("harvesting");
  }
  if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
    creep.memory.building = true;
    creep.say("building");
  }

  if (creep.memory.building) {
    if (target && !creep.memory.isSpecial) {
      if (creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    } else {
      var closestDamagedStructure;

      if (creep.memory.isSpecial) {
        var brokenRoad = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: structure =>
            structure.hits < structure.hitsMax &&
            structure.structureType !== STRUCTURE_WALL &&
            structure.structureType !== STRUCTURE_RAMPART
        });

        if (brokenRoad) {
          closestDamagedStructure = brokenRoad;
        }
      } else {
        closestDamagedStructure = creep.pos.findClosestByRange(
          FIND_STRUCTURES,
          {
            filter: structure =>
              structure.hits < structure.hitsMax &&
              structure.hits < room.memory.maxRepairHp
          }
        );
      }

      if (closestDamagedStructure) {
        if (creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE) {
          creep.moveTo(closestDamagedStructure);
        }
        return;
      } else if (!creep.memory.isSpecial) {
        //room.memory.maxRepairHp = room.memory.maxRepairHp + 50000;
      }

      roleHarvester.run([creep]);
    }
  } else {
    if (!helpers.harvestFromContainer(creep)) {
      helpers.harvest(creep);
    }
  }
}

module.exports = roleBuilder;
