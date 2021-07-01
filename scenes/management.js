/* eslint-disable function-paren-newline */
// this is stage management admin
/* eslint-disable array-callback-return */
const Scenes = require('telegraf/scenes/base');

const { cruder, tableName } = require('../db');
const messageTemp = require('../message.json');
const scenesID = require('../scenesID.json');
const { setCommands } = require('../helper/commandhooks');

const management = new Scenes(scenesID.management_scene);

management.use((ctx, next) => {
  setCommands(ctx.telegram, scenesID.management_scene);
  next();
});

const greeting = async (ctx) => {
  await setCommands(ctx.telegram, scenesID.management_scene);
  await ctx.reply(
    `Halo ${ctx.session.users.username}, ${messageTemp.managementGretting}`,
  );
};

management.enter(greeting);
management.start(greeting);
management.help(greeting);

management.command('users_list', async (ctx) => {
  let replyMsg = ``;
  replyMsg += `Daftar Pengguna \n`;
  replyMsg += `id \t username \t Admin \t Akses \n`;
  replyMsg += `--------------------------\n`;
  await cruder.read(tableName.users).then((v) => {
    v.map((val) => {
      replyMsg += `${val.id}. \t ${val.username} \t ${
        val.isAdmin === 1 ? 'Admin' : 'Non Admin'
      } \t ${val.isAllowed === 1 ? 'Punya' : 'Tidak'} \n`;
    });
  });
  ctx.reply(replyMsg);
});
management.command('user_delete', (ctx) =>
  ctx.scene.enter(scenesID.management_del_user_wizard),
);
management.command('user_accses', (ctx) =>
  ctx.scene.enter(scenesID.management_access_user_wizard),
);

management.command('followers_list', async (ctx) => {
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
});

management.command('follower_delete', async (ctx) =>
  ctx.scene.enter(scenesID.management_del_follower_wizard),
);

management.command('blocked_list', async (ctx) => {
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
});

management.command('blocked_delete', async (ctx) =>
  ctx.scene.enter(scenesID.management_del_block_command_wizard),
);

management.command('blocked_add', async (ctx) =>
  ctx.scene.enter(scenesID.management_add_block_command_wizard),
);

// leave command handler
// management.leave((ctx) => ctx.reply('Good bye'));
management.command('leave', async (ctx) => {
  await ctx.reply('Terima Kasih');
  await ctx.scene.enter(scenesID.home_scene);
  await setCommands(ctx.telegram, scenesID.home_scene);
});

module.exports = management;
