// this is stage home
const { Stage } = require('telegraf');
const Moment = require('moment');
const Scenes = require('telegraf/scenes/base');

const messageTemp = require('../message.json');
const { serverMarkup } = require('../lib/markups');
const { cruder, tableName } = require('../db');

const { leave } = Stage;

const home = new Scenes('home');

const greetUsers = (ctx) => {
  const { users } = ctx.session;
  ctx.reply(
    `Selamat datang ${users.username} \nLast Login : ${
      users.last_login === null ? Moment().format('LLLL') : users.last_login
    }`,
  );
};

// For bot enter stage and re enter
home.enter(async (ctx) => {
  greetUsers(ctx);
  await ctx.reply(messageTemp.welcomeHome, {
    reply_markup: serverMarkup,
  });
});

home.start(async (ctx) => {
  await ctx.reply(messageTemp.welcomeHome, {
    reply_markup: serverMarkup,
  });
});

home.help(async (ctx) => {
  await ctx.reply(messageTemp.welcomeHome, {
    reply_markup: serverMarkup,
  });
});

home.command('manage', async (ctx) => {
  const { users } = ctx.session;
  if (users.isAdmin) {
    ctx.scene.enter('management');
  } else {
    ctx.reply(`Untuk ${users.username}, Anda tidak diizinkan untuk masuk`);
  }
});

const execSubs = async (ctx, datas) => {
  const SubsCheck = await cruder.find(tableName.subscriber, datas);
  if (SubsCheck.length === 0) {
    await cruder.insert(tableName.subscriber, datas).then(() => {
      ctx.reply(
        `Terima kasih, ${datas.username} akan menerima notifikasi dari server setiap 30 Menit.`,
      );
    });
  } else {
    ctx.reply('Mohon maaf, anda sudah mengikuti bot pemberitahuan.');
  }
};

home.command('subscribe', async (ctx) => {
  const chatType = ctx.state.typeChat;
  // because of different response of message context from group
  // i split the subscribe flow
  if (chatType.toLowerCase() === 'personal') {
    const userId = {
      username: ctx.chat.first_name,
      telegram_id: ctx.chat.id.toString(),
    };
    await execSubs(ctx, userId);
  } else if (chatType.toLowerCase() === 'group') {
    const groupId = {
      username: ctx.chat.title,
      telegram_id: ctx.chat.id.toString(),
    };
    await execSubs(ctx, groupId);
  }
});

// Login call
home.command('login', async (ctx) => {
  ctx.reply(
    'Logout akun anda terlebih dahulu, jika ingin melakukan login dengan akun lain',
  );
});

// logout
home.leave(async (ctx) => {
  await ctx.reply('Good bye');
});

home.command('logout', leave());

// Server Execution Command
require('../helper/server')(home);

module.exports = home;
