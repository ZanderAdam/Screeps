var helpers = {
  harvest: function(creep) {
    var sources = creep.room.find(FIND_SOURCES_ACTIVE);

    if (!creep.memory.sourceIndex) {
      creep.memory.sourceIndex = 0;
    }

    var source = sources[creep.memory.sourceIndex];

    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  },
  harvestFromContainer: function(creep) {
    var targets = creep.room.find(FIND_STRUCTURES, {
      filter: structure =>
        structure.structureType == STRUCTURE_CONTAINER &&
        structure.store[RESOURCE_ENERGY] > 0
    });

    if (!targets.length) {
      return false;
    }

    if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(targets[0]);
    }

    return true;
  },
  harvestFromStorage(creep) {
    var targets = creep.room.find(FIND_STRUCTURES, {
      filter: structure => {
        return (
          structure.structureType == STRUCTURE_STORAGE &&
          structure.store[RESOURCE_ENERGY] > 0
        );
      }
    });

    if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(targets[0]);
    }
  }
};

module.exports = helpers;
