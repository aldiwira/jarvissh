/* eslint-disable no-return-await */
/* eslint-disable array-callback-return */
const WizardScene = require('telegraf/scenes/wizard');
const { Composer, Markup } = require('telegraf');

const { cruder, tableName } = require('../../db');
const sceneID = require('../../scenesID.json');

// Start : Wizard management for delet subsciber
const delSubsHandler = new Composer();

delSubsHandler.action(/hapus/, async (ctx) => {
  const queryData = ctx.callbackQuery.data;
  const id = queryData.split(' ')[1];
  await cruder.delete(tableName.subscriber.split, { id }).then((v) => {
    if (v) {
      ctx.reply(
        `Berhasi menghapus pengikut`,
        Markup.inlineKeyboard([
          Markup.callbackButton('Kembali', 'back'),
        ]).extra(),
      );
    }
  });
  await ctx.answerCbQuery();
});

delSubsHandler.action('back', async (ctx) => {
  ctx.answerCbQuery();
  return ctx.scene.enter(sceneID.management_scene);
});

const ManageDelFollowerWizard = new WizardScene(
  sceneID.management_del_follower_wizard,
  async (ctx) => {
    let replyMsg = ``;
    replyMsg += `Daftar Pengikut Pesan Monitor Otomatis \n`;
    replyMsg += `id \t username \n`;
    replyMsg += `--------------------------\n`;
    await cruder.read(tableName.subscriber).then((v) => {
      v.map((val) => {
        replyMsg += `${val.id}. \t ${val.username} \t \n`;
      });
    });
    ctx.reply(replyMsg);

    await ctx.reply(
      'Masukkan id pengikut notifikasi untuk menghapus pengikut?',
    );
    return await ctx.wizard.next();
  },
  async (ctx) => {
    const subsID = ctx.message.text;
    const subsCheck = await cruder.find(tableName.subscriber, {
      id: subsID,
    });
    if (subsCheck) {
      ctx.reply(
        'User yang anda cari tidak ditemukan',
        Markup.inlineKeyboard([
          Markup.callbackButton('Kembali', 'back'),
        ]).extra(),
      );
      return await ctx.wizard.next();
    }
    const subsData = subsCheck[0];
    await ctx.reply(
      `Apakah anda yakin ingin menghapus ${subsData.username} (${subsData.id})?`,
      Markup.inlineKeyboard([
        Markup.callbackButton('Hapus', `hapus ${subsData.id}`),
        Markup.callbackButton('Kembali', `back`),
      ]).extra(),
    );
    return await ctx.wizard.next();
  },
  delSubsHandler,
);

// End : Wizard management for delete subsciber

module.exports = { ManageDelFollowerWizard };
