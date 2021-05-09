const {
  ManageAccsessUserWizard,
  ManageDelUserWizard,
} = require('./manageuserwizard');
const { ManageDelFollowerWizard } = require('./managesubscribewizard');
const {
  ManageAddBlockCommandWizard,
  ManageDelBlockCommandWizard,
} = require('./manageblockwizard');
const { execCommandWizard } = require('./execcommandwizard');
const { checkServerWizard } = require('./checkserverwizard');

module.exports = {
  ManageAccsessUserWizard,
  ManageDelUserWizard,
  ManageDelFollowerWizard,
  ManageAddBlockCommandWizard,
  ManageDelBlockCommandWizard,
  execCommandWizard,
  checkServerWizard,
};
