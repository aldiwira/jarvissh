/* eslint-disable consistent-return */
/* eslint-disable no-return-await */
const WizardScene = require('telegraf/scenes/wizard');
const { Composer, Markup } = require('telegraf');
const { exec } = require('shelljs');

const { knex, tableName } = require('../../db');
const sceneID = require('../../scenesID.json');

const checkHandler = new Composer();

checkHandler.hears(/./g, async (ctx) => {
  await exec('node --version', (code, stdout, sterr) => {
    ctx.reply(`${stdout}`);
  });
});
checkHandler.help('lala');

const checkServerWizard = new WizardScene(
  sceneID.check_server_wizard,
  async (ctx) => {
    await ctx.reply('Apakah yang ingin anda periksa dari server?');
    await ctx.wizard.next();
  },
  checkHandler,
);

module.exports = { checkServerWizard };
