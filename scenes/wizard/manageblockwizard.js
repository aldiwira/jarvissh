/* eslint-disable no-return-await */
/* eslint-disable array-callback-return */
const WizardScene = require('telegraf/scenes/wizard');
const { Composer, Markup } = require('telegraf');

const { knex, cruder, tableName } = require('../../db');
const sceneID = require('../../scenesID.json');

// Start : Wizard Management for add command
const backMarkup = Markup.inlineKeyboard([
  Markup.callbackButton('Kembali', 'back'),
]).extra();

const AddBlockHandler = new Composer();

AddBlockHandler.action('back', (ctx) => {
  ctx.answerCbQuery();
  return ctx.scene.enter(sceneID.management_scene);
});

const ManageAddBlockCommandWizard = new WizardScene(
  sceneID.management_add_block_command_wizard,
  async (ctx) => {
    await ctx.reply('Masukkan kata perintah yang akan di blokir');
    return await ctx.wizard.next();
  },
  async (ctx) => {
    const command = ctx.message.text;
    const checkCommand = await knex(tableName.blacklist).where(
      'command',
      'like',
      `%${command}%`,
    );
    if (checkCommand[0]) {
      await ctx.reply(`Kata perintah ${command}, sudah terblokir`, backMarkup);
      return await ctx.wizard.next();
    }
    await cruder.insert(tableName.blacklist, { command }).then((v) => {
      if (v) {
        ctx.reply(`Kata perintah ${command} berhasil di blokir`, backMarkup);
      }
    });
    return await ctx.wizard.next();
  },
  AddBlockHandler,
);
// End

// Start : Wizard management for delete blacklist command
const ManageDelBlockCommandWizard = new WizardScene(
  sceneID.management_del_block_command_wizard,
  async (ctx) => {
    let replyMsg = ``;
    replyMsg += `Daftar kata perintah terblokir \n`;
    replyMsg += `id \t command \n`;
    replyMsg += `--------------------------\n`;
    await cruder.read(tableName.blacklist).then((v) => {
      v.map((val) => {
        replyMsg += `${val.id}. \t ${val.command} \t \n`;
      });
    });
    ctx.reply(replyMsg);

    await ctx.reply('Masukkan kata perintah diblokir yang akan dihapus');
    return await ctx.wizard.next();
  },
  async (ctx) => {
    const command = ctx.message.text;
    const checkCommand = await knex(tableName.blacklist).where(
      'command',
      'like',
      `%${command}%`,
    );
    if (!checkCommand) {
      await ctx.reply(`Kata perintah ${command} tidak ditemukan`, backMarkup);
      return await ctx.wizard.next();
    }
    await cruder
      .delete(tableName.blacklist, { id: checkCommand[0].id })
      .then((v) => {
        if (v) {
          ctx.reply(`Kata perintah ${command} berhasil di blokir`, backMarkup);
        }
      });
    return await ctx.wizard.next();
  },
  AddBlockHandler,
);

// End

module.exports = { ManageAddBlockCommandWizard, ManageDelBlockCommandWizard };
