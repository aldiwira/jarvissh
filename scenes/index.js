const HomeScene = require('./home');
const ManageScene = require('./management');
const {
  ManageAccsessUserWizard,
  ManageDelUserWizard,
} = require('./wizard/ManageWizard');

const ScenesLists = [
  HomeScene,
  ManageScene,
  ManageAccsessUserWizard,
  ManageDelUserWizard,
];

module.exports = { ScenesLists };
