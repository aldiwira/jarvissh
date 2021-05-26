// this is stage home
const { Stage } = require('telegraf');
const Moment = require('moment');
const Scenes = require('telegraf/scenes/base');

const messageTemp = require('../message.json');
const scenesID = require('../scenesID.json');
const { serverMarkup } = require('../lib/markups');
const { cruder, tableName } = require('../db');
const { setCommands } = require('../helper/commandhooks');

const { leave } = Stage;

const home = new Scenes(scenesID.home_scene);

const greetUsers = (ctx) => {
  const { users } = ctx.session;
  ctx.reply(
    `Selamat datang ${users.username} \nLast Login : ${
      users.last_login === null ? Moment().format('LLLL') : users.last_login
    }`,
  );
};

// For bot enter stage and re enter
const greetInit = async (ctx) => {
  await greetUsers(ctx);
  await ctx.reply(messageTemp.welcomeHome, {
    reply_markup: serverMarkup,
  });
  await setCommands(ctx.telegram, scenesID.home_scene);
};
home.enter(greetInit);
home.start(greetInit);
home.help(greetInit);

home.command('manage', async (ctx) => {
  const { users } = ctx.session;
  if (users.isAdmin) {
    ctx.scene.enter(scenesID.management_scene);
  } else {
    ctx.reply(`Untuk ${users.username}, Anda tidak diizinkan untuk masuk`);
  }
});

const execSubs = async (datas) => {
  const SubsCheck = await cruder.find(tableName.subscriber, datas);
  if (SubsCheck.length !== 0) {
    return false;
  }
  // eslint-disable-next-line no-return-await
  return await cruder.insert(tableName.subscriber, datas);
};

home.command('subscribe_group', async (ctx) => {
  if (ctx.chat.type === 'private') {
    await ctx.reply(
      'Mohon maaf, fitur ini hanya dapat digunakan pada group telegram saja',
    );
  } else if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
    const groupId = {
      username: ctx.chat.title,
      telegram_id: ctx.chat.id.toString(),
    };
    await execSubs(groupId).then((v) => {
      if (v) {
        ctx.reply(
          `Terima kasih, ${v.username} akan menerima notifikasi dari server setiap 30 Menit.`,
        );
      } else {
        ctx.reply(`Mohon maaf, Group sudah mengikuti bot pemberitahuan.`);
      }
    });
  }
});

home.command('subscribe_me', async (ctx) => {
  if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
    const userId = {
      username: ctx.from.first_name,
      telegram_id: ctx.from.id.toString(),
    };
    await execSubs(userId).then((v) => {
      if (v) {
        ctx.reply(
          `Terima kasih, ${v.username} akan menerima notifikasi dari server setiap 30 Menit.`,
        );
      } else {
        ctx.reply(`Mohon maaf, Anda sudah mengikuti bot pemberitahuan.`);
      }
    });
  } else if (ctx.chat.type === 'private') {
    const userId = {
      username: ctx.chat.first_name,
      telegram_id: ctx.chat.id.toString(),
    };
    await execSubs(userId).then((v) => {
      if (v) {
        ctx.reply(
          `Terima kasih, ${v.username} akan menerima notifikasi dari server setiap 30 Menit.`,
        );
      } else {
        ctx.reply(`Mohon maaf, Anda sudah mengikuti bot pemberitahuan.`);
      }
    });
  }
});

// eslint-disable-next-line camelcase
const execUnSubs = async (telegram_id) => {
  const SubsCheck = await cruder.find(tableName.subscriber, { telegram_id });
  if (SubsCheck.length === 0) {
    return false;
  }
  // eslint-disable-next-line no-return-await
  return await cruder.delete(tableName.subscriber, { telegram_id });
};

home.command('unsubscribe_me', async (ctx) => {
  if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
    await execUnSubs(ctx.from.id.toString()).then((v) => {
      if (v) {
        ctx.reply(
          `${ctx.chat.first_name} sudah tidak menerima notifikasi dari server. Terima kasih`,
        );
      } else {
        ctx.reply(`Mohon maaf, anda tidak mengikuti bot pemberitahuan.`);
      }
    });
  } else if (ctx.chat.type === 'private') {
    await execUnSubs(ctx.chat.id.toString()).then((v) => {
      if (v) {
        ctx.reply(
          `${ctx.chat.first_name} sudah tidak menerima notifikasi dari server. Terima kasih`,
        );
      } else {
        ctx.reply(`Mohon maaf, anda tidak mengikuti bot pemberitahuan.`);
      }
    });
  }
});

home.command('unsubscribe_group', async (ctx) => {
  if (ctx.chat.type === 'private') {
    await ctx.reply(
      'Mohon maaf, fitur ini hanya dapat digunakan di group saja',
    );
  } else if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
    await execUnSubs(ctx.chat.id.toString()).then((v) => {
      if (v) {
        ctx.reply(
          `${ctx.chat.title}, group ini sudah tidak menerima notifikasi dari server, terima kasih`,
        );
      } else {
        ctx.reply(`Mohon maaf, Group tidak mengikuti bot pemberitahuan.`);
      }
    });
  }
});

// Login call
home.command('login', async (ctx) => {
  ctx.reply(
    'Logout akun anda terlebih dahulu, jika ingin melakukan login dengan akun lain',
  );
});

// Command execution
home.command('exec', (ctx) => {
  ctx.scene.enter(scenesID.command_execution_wizard);
});

// logout
home.leave(async (ctx) => {
  await ctx.reply('Good bye');
});

home.command('logout', leave());

// Server Execution Command
require('./server')(home);

module.exports = home;
