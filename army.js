var creepFactory = require("creepFactory");

var createNew = false;
var engage = true;

var numSquads = 1;
var meleePerSquad = 2;
var rangedPerSquad = 0;
var healersPerSquad = 0;

var respawnTicks = 300;

var rangedRole = "ranged";
var meleeRole = "melee";
var healerRole = "healer";

var army = {
  run: run
};

var squads = [];

function run(room) {
  var spawnQueued = false;

  var soldiers = room.find(FIND_MY_CREEPS, {
    filter: { memory: { role: "military" } }
  });

  if (soldiers.length == 0 && !createNew) {
    return;
  }

  var membersPerSquad = meleePerSquad + rangedPerSquad + healersPerSquad;

  for (var squadNum = 1; squadNum < numSquads + 1; squadNum++) {
    var existingMelee = [];
    var existingRanged = [];
    var existingHealers = [];

    var squadMembers = _(soldiers)
      .filter({ memory: { squadNum: squadNum } })
      .value();

    var squadTarget;

    if (squadMembers.length > 0 && engage) {
      var squadTargets = squadMembers[0].pos.findInRange(
        FIND_HOSTILE_CREEPS,
        5
      );

      if (squadTargets && squadTargets.length > 0) {
        squadTarget = squadTargets[0];
      } else {
        squadTargets = squadMembers[0].room.find(FIND_HOSTILE_STRUCTURES); //findInRange(FIND_STRUCTURES, 10, {
        //    filter: { structureType: STRUCTURE_SPAWN }
        //})

        if (squadTargets) {
          squadTarget = squadTargets[0];
        }
      }
    }

    squadMembers.forEach(creep => {
      if (!squadTarget) {
        var squadFlag = Game.flags["Squad" + squadNum];

        if (squadFlag) {
          creep.moveTo(squadFlag);
        } else {
          var flag = Game.flags["Army"];
          creep.moveTo(flag);
        }
      }

      if (creep.memory.squadRole == rangedRole) {
        if (squadTarget) {
          if (creep.rangedAttack(squadTarget) == ERR_NOT_IN_RANGE) {
            creep.moveTo(squadTarget);
          }
        }

        if (creep.ticksToLive < respawnTicks && createNew) {
          createRanged(squadNum);
        }

        existingRanged.push(creep);
      } else if (creep.memory.squadRole == meleeRole) {
        if (squadTarget) {
          if (creep.attack(squadTarget) == ERR_NOT_IN_RANGE) {
            creep.moveTo(squadTarget);
          }
        }

        if (creep.ticksToLive < respawnTicks && createNew) {
          createMelee(squadNum);
        }

        existingMelee.push(creep);
      } else if (creep.memory.squadRole == healerRole) {
        var targets = creep.pos.findInRange(FIND_MY_CREEPS, 10, {
          filter: function(object) {
            return object.hits < object.hitsMax;
          }
        });

        var target;
        if (targets) {
          target = targets[0];
        }

        if (creep.heal(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target);
        }

        if (creep.ticksToLive < respawnTicks && createNew) {
          createHealer(squadNum);
        }

        existingHealers.push(creep);
      }
    });

    var squad = {
      num: squadNum,
      melee: existingMelee,
      ranged: existingRanged,
      healers: existingHealers
    };

    squads.push(squad);

    if (
      !spawnQueued &&
      createNew &&
      room.memory.civilianPopulation >= room.memory.totalCivilians
    ) {
      var spawns = room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_SPAWN }
      });

      createSquad(spawns, squad);
      spawnQueued = squadMembers < membersPerSquad;
    }
  }
}

function createSquad(spawns, squad) {
  if (Game.spawns["Main"].spawning) {
    return;
  }

  if (squad.melee.length < meleePerSquad) {
    createMelee(squad.num, spawns);
  } else if (squad.ranged.length < rangedPerSquad) {
    createRanged(squad.num, spawns);
  } else if (squad.healers.length < healersPerSquad) {
    createHealer(squad.num, spawns);
  }
}

function createMelee(squadNum, spawns) {
  var creep = creepFactory.createCreep(spawns, "military", [
    TOUGH,
    TOUGH,
    TOUGH,
    TOUGH,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    ATTACK,
    ATTACK,
    ATTACK,
    ATTACK,
    ATTACK,
    ATTACK,
    MOVE
  ]);
  setMilitaryRole(creep, meleeRole, squadNum);
}

function createRanged(squadNum, spawns) {
  var creep = creepFactory.createCreep(spawns, "military", [
    RANGED_ATTACK,
    RANGED_ATTACK,
    RANGED_ATTACK,
    TOUGH,
    TOUGH,
    TOUGH,
    TOUGH,
    MOVE,
    MOVE
  ]);
  setMilitaryRole(creep, rangedRole, squadNum);
}

function createHealer(squadNum, spawns) {
  var creep = creepFactory.createCreep(spawns, "military", [
    TOUGH,
    TOUGH,
    MOVE,
    MOVE,
    MOVE,
    HEAL,
    HEAL,
    MOVE
  ]);
  setMilitaryRole(creep, healerRole, squadNum);
}

function setMilitaryRole(creep, role, squadNum) {
  if (creep) {
    creep.memory.squadRole = role;
    creep.memory.squadNum = squadNum;
    console.log(
      "Creaing soldier " +
        creep.name +
        " with role " +
        role +
        " - assigned to Squad" +
        squadNum
    );
  }
}

module.exports = army;
