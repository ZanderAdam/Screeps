var roomController = require("controller.room");

module.exports.loop = function() {
  for (var roomName in Game.rooms) {
    var room = Game.rooms[roomName];

    roomController.run(room);
  }
};
