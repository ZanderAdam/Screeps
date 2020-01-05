var util = {
  assignSource: function(creep) {
    var room = creep.room;

    var min = room.memory.sources[0];
    var minIndex = 0;

    for (var i = 1; i < creep.room.memory.numSources; i++) {
      if (room.memory.sources[i] < min) {
        min = room.memory.sources[i];
        minIndex = i;
      }
    }

    room.memory.sources[minIndex]++;
    creep.memory.sourceIndex = minIndex;
  },

  assignSources: function() {
    for (var name in Game.creeps) {
      var creep = Game.creeps[name];
      util.assignSource(creep);
    }
  }
};

module.exports = util;
