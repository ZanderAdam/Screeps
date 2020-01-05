var helpers = require('helpers');

var roleHauler = {
    run: function(haulers, room) {
        var hasSpecial = _(haulers).some({ memory: { isSpecial: true }});
        
        if(haulers.length > 4 && !hasSpecial){
            haulers[0].memory.isSpecial = true;    
        }
        
        haulers.forEach(hauler => run(hauler));
	}
};

function run(creep){
    if(creep.memory.hasEnergy && creep.carry.energy == 0) {
        creep.memory.hasEnergy = false;
        creep.say('collecting');
    }
    if(!creep.memory.hasEnergy && creep.carry.energy == creep.carryCapacity) {
        creep.memory.hasEnergy = true;
        creep.say('hauling');
    }
    
    if(creep.memory.hasEnergy)
    {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity && !creep.memory.isSpecial);
            }
        });
        
        if(targets.length == 0){
            targets = creep.room.find(FIND_STRUCTURES, {
               filter: (structure) => {
                return (structure.structureType === STRUCTURE_TOWER && structure.energy < structure.energyCapacity);
                }
            });
        }
        
        if(targets.length == 0){
            targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity)
            });
        }
        
        if(targets.length > 0) {
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        }
    }
    else 
    {
        var energy = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);

        if (energy) {
            console.log('Found ' + energy.energy + ' energy at ', energy.pos);
        
            if(creep.pickup(energy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(energy);
            }
            return;
        }
        
        helpers.harvestFromStorage(creep);
    }
}

module.exports = roleHauler;