const moment = require('moment');

const { cruder, tableName } = require('../db');
const msgtemp = require('../message.json');
const sceneID = require('../scenesID.json');
const { sayGreetings } = require('../helper/greetings');

const updateLastLogin = (filter, ctx) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  cruder.update(tableName.users, filter, {
    last_login: moment
      .unix(ctx.update.message.date)
      .format('YYYY-MM-DD HH:mm:ss'),
  });

const checkAccounts = (filter) => cruder.find(tableName.users, filter);

module.exports = (bot) => {
  bot.command('login', async (ctx) => {
    const checkAccount = await checkAccounts({ telegram_id: ctx.from.id });
    if (checkAccount.length !== 0) {
      const data = checkAccount[0];
      if (data.isAllowed) {
        await updateLastLogin({ telegram_id: ctx.from.id }, ctx);
        // eslint-disable-next-line prefer-destructuring
        ctx.session.users = checkAccount[0];
        await ctx.scene.enter(sceneID.home_scene);
      } else {
        await ctx.reply(
          `Hai ${ctx.from.first_name}, ${msgtemp.processRegister}`,
        );
      }
    } else {
      await ctx.reply(`Hai ${ctx.from.first_name}, ${msgtemp.notRegister}`);
    }
  });

  const notifAdmin = async (ctx, idClient) => {
    await cruder
      .find(tableName.users, { isAdmin: true, isAllowed: true })
      .then((v) => {
        if (v.length !== 0) {
          v.map(async (item) => {
            await ctx.telegram.sendMessage(
              item.telegram_id,
              `${sayGreetings()} ${item.username}, Pengguna ${
                ctx.from.first_name
              } sudah melakukan registrasi akses chatbot, segera check di management dan konfirmasi ya. User ID : ${idClient}`,
            );
          });
        }
      });
  };

  bot.command('register', async (ctx) => {
    const checkAccount = await checkAccounts({ telegram_id: ctx.from.id });
    if (checkAccount.length === 0) {
      const userData = {
        username: ctx.from.first_name,
        telegram_id: ctx.from.id,
        isAdmin: 0,
        isAllowed: 0,
      };

      await cruder.insert(tableName.users, userData).then((val) => {
        ctx.reply(
          `Selamat datang ${ctx.from.first_name}, ${msgtemp.successRegister}. ${val}`,
        );
        notifAdmin(ctx, val);
      });
    } else {
      const stat = checkAccount[0].isAllowed
        ? msgtemp.accountAllowed
        : msgtemp.accountNotAllowed;
      ctx.reply(`${ctx.from.first_name}, ${msgtemp.alreadyRegister}, ${stat}`);
      notifAdmin(ctx, checkAccount[0].id);
    }
  });
};
