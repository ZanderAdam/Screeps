var helpers = require('helpers');

var roleHauler = {
    run: function(creeps, room) {
        creeps.forEach(creep => run(creep));
	}
};

function run(creep){
    var claimFlag = Game.flags['Claim'];
    
    if(claimFlag){
        if(claimFlag.room && claimFlag.room.name === creep.room.name){
            if(creep.room.controller) {
                if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
        else{
            creep.moveTo(claimFlag);
        }
    }
}

module.exports = roleHauler;