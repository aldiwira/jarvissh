const HomeScene = require('./home');
const ManageScene = require('./management');
const {
  ManageAccsessUserWizard,
  ManageDelUserWizard,
  ManageDelFollowerWizard,
  ManageAddBlockCommandWizard,
  ManageDelBlockCommandWizard,
} = require('./wizard');

const ScenesLists = [
  HomeScene,
  ManageScene,
  ManageAccsessUserWizard,
  ManageDelUserWizard,
  ManageDelFollowerWizard,
  ManageDelBlockCommandWizard,
  ManageAddBlockCommandWizard,
];

module.exports = { ScenesLists };
