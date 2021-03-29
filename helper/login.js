const moment = require('moment');

const { cruder, tableName } = require('../db');

const updateLastLogin = async (filter, ctx) =>
  cruder.update(tableName.users, filter, {
    last_login: moment
      .unix(ctx.update.message.date)
      .format('YYYY-MM-DD HH:mm:ss'),
  });

module.exports = (bot) => {
  bot.command('login', async (ctx) => {
    const msg = ctx.update.message.text;
    const username = msg.split(' ')[1];
    const password = msg.split(' ')[2];

    // delete login message first
    await ctx.deleteMessage(ctx.message_id);

    if (username && password) {
      cruder.find(tableName.users, { username }).then(async (value) => {
        if (password === value[0].password) {
          await updateLastLogin({ username }, ctx).then((val) => {
            if (val === 1) {
              // store session data of user
              // eslint-disable-next-line prefer-destructuring
              ctx.session.users = value[0];
              ctx.scene.enter('home');
            }
          });
        } else {
          await ctx.reply('Password salah');
        }
      });
    } else {
      ctx.reply(
        'username / password belum anda masukkan, /login <username> <password>',
      );
    }
  });
};
