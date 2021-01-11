const moment = require('moment');

const { cruder, tableName } = require('../db/db');

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

    if (username && password) {
      cruder.find(tableName.users, { username }).then(async (value) => {
        if (password === value[0].password) {
          await updateLastLogin({ username }, ctx).then((val) => {
            if (val === 1) {
              ctx.reply(
                `Selamat datang ${value[0].username} \nLast Login : ${value[0].last_login}`,
              );
              ctx.scene.enter('home');
            }
          });
        } else {
          await ctx.reply('Password salah');
        }
        await ctx.deleteMessage(ctx.message_id);
      });
    } else {
      ctx.reply(
        'username / password belum anda masukkan, /login <username> <password>',
      );
    }
  });
};
