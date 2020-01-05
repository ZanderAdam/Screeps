var util = require("util");

var roles = {
  harvester: "harvester",
  hauler: "hauler",
  builder: "builder",
  upgrader: "upgrader",
  remoteHauler: "remoteHauler"
};

function createCreep(room, role) {
  var spawns = room.find(FIND_MY_SPAWNS);

  console.log("Spawning: " + role);
  if (!spawns.length) {
    return;
  }

  var freeSpawns = _(spawns).filter(spawn => {
    return !spawn.spawning;
  });

  if (!freeSpawns) {
    console.log("No Available Spawns in room");
    return;
  }

  var creepParts = getPartsForRole(role, room);

  var creepName = spawns[0].createCreep(creepParts, undefined, {
    role: role,
    room: room.name
  });
  var creep = Game.creeps[creepName];

  if (creep) {
    util.assignSource(creep);
    console.log("Creating " + role + " " + creepName);
  }

  return creep;
}

function getPartsForRole(role, room) {
  var roomLevelLow = room.controller.level < 4;

  if (role === roles.harvester) {
    return roomLevelLow
      ? room.energyAvailable > 400
        ? [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
        : [WORK, CARRY, MOVE]
      : [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
  } else if (role === roles.hauler) {
    return [
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      CARRY,
      MOVE,
      MOVE,
      MOVE,
      MOVE
    ];
  } else if (role === roles.upgrader) {
    return roomLevelLow
      ? [WORK, CARRY, MOVE]
      : [
          WORK,
          WORK,
          WORK,
          WORK,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          CARRY,
          MOVE,
          MOVE,
          MOVE,
          MOVE
        ];
  } else if (role === roles.builder) {
    return roomLevelLow
      ? [WORK, CARRY, MOVE]
      : [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
  } else if (role === roles.remoteHauler) {
    return roomLevelLow
      ? [WORK, CARRY, MOVE]
      : [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
  }
}

module.exports = {
  createCreep: createCreep,
  roles: roles
};
