var roleRoadBuilders = {
    run: function(roadBuilders) {
        roadBuilders.forEach(harvester => run(harvester, Game.flags['RoadToHere']));
	}
};

function run(creep, target){
    creep.moveTo(target);
   // creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
}

module.exports = roleRoadBuilders;