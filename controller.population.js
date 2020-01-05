var roles = require("roles");
var creepFactory = require("creepFactory");

function run(room) {
  cleanUpDead();

  var creepsInRole = {};

  for (var role in roles) {
    creepsInRole[role] = [];
  }

  var myCreeps = room.find(FIND_MY_CREEPS);

  myCreeps.forEach(creep => {
    creepsInRole[creep.memory.role].push(creep);
  });

  for (var role in roles) {
    roles[role].run(creepsInRole[role], room);
  }

  if (!room.controller) {
    return;
  }

  for (var role in roles) {
    var currentPopulation = creepsInRole[role].length;
    var populationLimit = roles[role].getPoplationLimit(room);

    if (currentPopulation < populationLimit) {
      creepFactory.createCreep(room, role);
      return;
    }
  }
}

function cleanUpDead() {
  for (var creep in Memory.creeps) {
    if (!Game.creeps[creep]) {
      console.log("Deleting creep " + creep);
      var deadMemory = Memory.creeps[creep];
      console.log(JSON.stringify(deadMemory));
      if (deadMemory && deadMemory.sourceIndex) {
        var room = Game.rooms[deadMemory.room];

        if (room.memory.sources[deadMemory.sourceIndex] > 0)
          room.memory.sources[deadMemory.sourceIndex]--;
      }
      delete Memory.creeps[creep];
    }
  }
}

module.exports = {
  run: run
};
