const commandsReq = require('./commandScenes.json');
const scenesId = require('../scenesID.json');

const commandget = (scene) => {
  switch (scene) {
    case scenesId.home_scene:
      return commandsReq.home_scenes;
    case scenesId.management_scene:
      return commandsReq.manage_scene;
    case 'root':
      return commandsReq.root_scenes;
    default:
      return commandsReq.root_scenes;
  }
};

const setCommands = (telegram, scene) => {
  telegram.setMyCommands(commandget(scene));
  console.log(`finish ${scene} command set`);
};

module.exports = { setCommands };
