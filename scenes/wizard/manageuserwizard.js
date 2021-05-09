/* eslint-disable no-return-await */
/* eslint-disable array-callback-return */
const WizardScene = require('telegraf/scenes/wizard');
const { Composer, Markup } = require('telegraf');

const { knex, cruder, tableName } = require('../../db');
const sceneID = require('../../scenesID.json');

// Start: Wizard management for deleter user
const ManageDelUserWizard = new WizardScene(
  sceneID.management_del_user_wizard,
  async (ctx) => {
    await ctx.reply('Masukkan id pengguna yang akan dihapus?');
    return ctx.wizard.next();
  },
  async (ctx) => {
    const { text } = ctx.message;
    const checkUser = cruder.find(tableName.users, { id: text });
    if (checkUser) {
      await knex(tableName.users)
        .where('id', text)
        .del()
        .then(() => {
          ctx.reply(`Pengguna ${checkUser.username} berhasil dihapus`);
        });
    } else {
      await ctx.reply('User yang anda cari tidak ditemukan');
    }
    return await ctx.scene.leave();
  },
);
// End: Wizard management for deleter user

// Start: Wizard management for change account
const AccountChanger = async (filter, update) => {
  const updateExec = await cruder.update(tableName.users, filter, update);
  if (updateExec) {
    return true;
  }
  return false;
};
const doneMarkup = Markup.inlineKeyboard([
  Markup.callbackButton('Kembali', 'done'),
]).extra();

const AccessHandler = new Composer();
// menggunakan regex expression agar query terdeteksi
AccessHandler.action(/admin/, async (ctx) => {
  const queryData = ctx.callbackQuery.data;
  const action = queryData.split(' ')[1];
  const id = queryData.split(' ')[2];
  if (action === 'remove') {
    await AccountChanger({ id }, { isAdmin: 0 }).then((v) => {
      if (v) {
        ctx.reply('Berhasil menghapus akses admin', doneMarkup);
      }
    });
  } else if (action === 'set') {
    await AccountChanger({ id }, { isAdmin: 1 }).then((v) => {
      if (v) {
        ctx.reply('Berhasil memberikan akses admin', doneMarkup);
      }
    });
  }
  await ctx.answerCbQuery();
});

AccessHandler.action(/access/, async (ctx) => {
  const queryData = ctx.callbackQuery.data;
  const action = queryData.split(' ')[1];
  const id = queryData.split(' ')[2];
  if (action === 'remove') {
    await AccountChanger({ id }, { isAllowed: 0 }).then((v) => {
      if (v) {
        ctx.reply('Berhasil menghapus akses bot', doneMarkup);
      }
    });
  } else if (action === 'set') {
    await AccountChanger({ id }, { isAllowed: 1 }).then((v) => {
      if (v) {
        ctx.reply('Berhasil memberikan akses bot', doneMarkup);
      }
    });
  }
  await ctx.answerCbQuery();
});

AccessHandler.action('done', async (ctx) => {
  await ctx.answerCbQuery();
  return await ctx.scene.enter(sceneID.management_scene);
});

const ManageAccsessUserWizard = new WizardScene(
  sceneID.management_access_user_wizard,
  async (ctx) => {
    await ctx.reply('Masukkan id pengguna untuk mengatur akses');
    return await ctx.wizard.next();
  },
  async (ctx) => {
    const userID = ctx.message.text;
    const checkUser = await cruder.find(tableName.users, {
      id: userID,
    });
    if (!checkUser) {
      ctx.reply(
        'User yang anda cari tidak ditemukan',
        Markup.inlineKeyboard([
          Markup.callbackButton('Kembali', 'done'),
        ]).extra(),
      );
    }
    const userDatas = checkUser[0];
    const isAllowed = userDatas.isAllowed === 1 ? 'Punya' : 'Tidak';
    const isAdmin = userDatas.isAdmin === 1 ? 'Punya' : 'Tidak';
    await ctx.reply(
      `Username : ${userDatas.username}\nPunya akses : ${isAllowed}\nAkses Admin BOT : ${isAdmin}\n`,
      Markup.inlineKeyboard([
        userDatas.isAdmin === 1
          ? [Markup.callbackButton('Hapus admin', `admin remove ${userID}`)]
          : [Markup.callbackButton('Jadikan Admin', `admin set ${userID}`)],
        userDatas.isAllowed === 1
          ? [Markup.callbackButton('Hapus akses', `access remove ${userID}`)]
          : [Markup.callbackButton('Berikan Akses', `access set ${userID}`)],
        [Markup.callbackButton('Kembali', 'done')],
      ]).extra(),
    );
    return await ctx.wizard.next();
  },
  AccessHandler,
);
// End: Wizard management for change account type

module.exports = { ManageAccsessUserWizard, ManageDelUserWizard };
