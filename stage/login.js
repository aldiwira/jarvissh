const moment = require('moment');

const { cruder, tableName } = require('../db');
const msgtemp = require('../message.json');

const updateLastLogin = (filter, ctx) =>
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
        updateLastLogin({ telegram_id: ctx.from.id }, ctx);
        // eslint-disable-next-line prefer-destructuring
        ctx.session.users = checkAccount[0];
        ctx.scene.enter('home');
      } else {
        ctx.reply(`${ctx.from.first_name}, ${msgtemp.processRegister}`);
      }
    } else {
      ctx.reply(`${ctx.from.first_name}, ${msgtemp.notRegister}`);
    }
  });
};
