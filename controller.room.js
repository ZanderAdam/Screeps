var popController = require("controller.population");

function run(room) {
  if (!room.memory.init) init(room);

  popController.run(room);
}

function init(room) {
  var numSources = room.find(FIND_SOURCES_ACTIVE).length;
  room.memory.numSources = numSources;
  room.memory.sources = [];

  for (var i = 0; i < numSources; i++) {
    room.memory.sources.push(0);
  }

  room.memory.numPerSource = 3;
  room.memory.init = true;
}

module.exports = {
  run: run
};
