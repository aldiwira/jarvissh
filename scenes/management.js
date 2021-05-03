// this is stage management admin
/* eslint-disable array-callback-return */
const { Stage } = require('telegraf');
const Scenes = require('telegraf/scenes/base');

const { cruder, tableName } = require('../db');
const messageTemp = require('../message.json');
const scenesID = require('../scenesID.json');

const { leave } = Stage;

const management = new Scenes(scenesID.management_scene);

management.enter((ctx) => {
  ctx.reply(
    `Dear ${ctx.session.users.username}, ${messageTemp.managementGretting}`,
  );
});
management.help((ctx) => {
  ctx.reply(
    `Dear ${ctx.session.users.username}, ${messageTemp.managementGretting}`,
  );
});

management.command('user', async (ctx) => {
  const msg = ctx.update.message.text.split(' ');
  const command = msg[1];
  let replyMsg = ``;

  if (command === 'list') {
    replyMsg += `Daftar Pengguna \n`;
    replyMsg += `id \t username \t tipe \n`;
    replyMsg += `--------------------------\n`;
    await cruder.read(tableName.users).then((v) => {
      v.map((val) => {
        replyMsg += `${val.id}. \t ${val.username} \t ${
          val.isAdmin === 1 ? 'Admin' : 'Non Admin'
        } \n`;
      });
    });
    ctx.reply(replyMsg);
  } else if (command === 'hapus') {
    ctx.scene.enter(scenesID.management_del_user_wizard);
  } else if (command === 'akses') {
    ctx.scene.enter(scenesID.management_access_user_wizard);
  }
});

management.command('pengikut', async (ctx) => {
  const msg = ctx.update.message.text.split(' ');
  const command = msg[1];
  let replyMsg = ``;

  if (command === 'list') {
    replyMsg += `Daftar Pengikut Pesan Monitor Otomatis \n`;
    replyMsg += `id \t username \n`;
    replyMsg += `--------------------------\n`;
    await cruder.read(tableName.subscriber).then((v) => {
      v.map((val) => {
        replyMsg += `${val.id}. \t ${val.username} \t \n`;
      });
    });
    ctx.reply(replyMsg);
  } else if (command === 'hapus') {
    ctx.scene.enter(scenesID.management_del_follower_wizard);
  }
});

management.command('command', async (ctx) => {
  const msg = ctx.update.message.text.split(' ');
  const command = msg[1];
  let replyMsg = ``;

  if (command === 'list') {
    replyMsg += `Daftar kata perintah terblokir \n`;
    replyMsg += `id \t command \n`;
    replyMsg += `--------------------------\n`;
    await cruder.read(tableName.blacklist).then((v) => {
      v.map((val) => {
        replyMsg += `${val.id}. \t ${val.command} \t \n`;
      });
    });
    ctx.reply(replyMsg);
  } else if (command === 'delete') {
    ctx.scene.enter(scenesID.management_del_block_command_wizard);
  } else if (command === 'add') {
    ctx.scene.enter(scenesID.management_add_block_command_wizard);
  }
});

// leave command handler
management.leave((ctx) => ctx.reply('Good bye'));
management.command('leave', leave());

module.exports = management;
