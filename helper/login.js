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
      cruder.find(tableName.users, { username }).then((value) => {
        if (password === value[0].password) {
          updateLastLogin({ username }, ctx).then((val) => {
            if (val === 1) {
              ctx.reply(
                `Selamat datang ${value[0].username} \nLast Login : ${value[0].last_login}`,
              );
            }
          });
        } else {
          ctx.reply('Password salah');
        }
      });
    } else {
      ctx.reply(
        'username / password belum anda masukkan, /login <username> <password>',
      );
    }
  });
};

// if (value[0].password) {
//   ctx.reply(
//     `Selamat datang ${username} \n Terakhir login : ${value[0].last_login}`,
//   );
// } else {
//   ctx.reply('Password yang anda masukkan salah :(');
// }
