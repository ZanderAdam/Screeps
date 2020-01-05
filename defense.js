var creepFactory = require('creepFactory');

var defend = function (room){
    var hostiles = room.find(FIND_HOSTILE_CREEPS);
    
    var towers = room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_TOWER
    });
    
    var closestHostile = _(room.find(FIND_HOSTILE_CREEPS)).first();
               
    towers.forEach(tower => 
    {
        if(closestHostile) {
            tower.attack(closestHostile);
            return;
        }
        
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => (structure.hits < 500 && structure.structureType === STRUCTURE_RAMPART)
        });
        
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
    });
    
    if(hostiles.length > 0) {
        var ranged = room.find(FIND_MY_CREEPS, { filter: { memory: { role: 'defender'}}});
        
        var spawns = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_SPAWN }
        });
            
        if(ranged.length < 0 && spawns.length){
            creepName = spawns[0].createCreep([ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE,MOVE], undefined, {role: 'defender'});
            console.log('Creating defender ' + creepName);
        }
            
        var username = hostiles[0].owner.username;
        console.log('User ' + username +  ' spotted');
        
        ranged.forEach(creep => {
            if(creep.attack(hostiles[0]) == ERR_NOT_IN_RANGE){
                creep.moveTo(hostiles[0]);
            }
        });
    }
}

module.exports = defend;