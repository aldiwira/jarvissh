const HomeScene = require('./home');
const ManageScene = require('./management');
const {
  ManageAccsessUserWizard,
  ManageDelUserWizard,
  ManageDelFollowerWizard,
  ManageAddBlockCommandWizard,
  ManageDelBlockCommandWizard,
  execCommandWizard,
  checkServerWizard,
} = require('./wizard');

const ScenesLists = [
  HomeScene,
  ManageScene,
  ManageAccsessUserWizard,
  ManageDelUserWizard,
  ManageDelFollowerWizard,
  ManageDelBlockCommandWizard,
  ManageAddBlockCommandWizard,
  execCommandWizard,
  checkServerWizard,
];

module.exports = { ScenesLists };
