// this is stage management admin
/* eslint-disable array-callback-return */
const { Stage } = require('telegraf');
const Scenes = require('telegraf/scenes/base');

const { cruder, tableName, knex } = require('../db');
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
    const id = msg[2];
    if (id) {
      const sub = await cruder.find(tableName.subscriber, { id });
      const delSub = await knex(tableName.subscriber).where('id', id).del();
      if (delSub === 1) {
        await ctx.reply(`Pengikut ${sub[0].username} berhasil dihapus`);
      } else {
        await ctx.reply(`Pengikut tidak dapat ditemukan`);
      }
    } else {
      await ctx.reply('Masukkan username yang akan dihapus');
    }
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
    const id = msg[2];
    if (id) {
      const sub = await cruder.find(tableName.blacklist, { id });
      const delSub = await knex(tableName.blacklist).where('id', id).del();
      if (delSub === 1) {
        await ctx.reply(`Kata Perintah ${sub[0].command} berhasil dihapus`);
      } else {
        await ctx.reply(`Kata Perintah tidak dapat ditemukan`);
      }
    } else {
      await ctx.reply('Masukkan username yang akan dihapus');
    }
  } else if (command === 'add') {
    const wordCommand = msg[2];
    if (wordCommand) {
      const commands = await cruder.find(tableName.blacklist, { wordCommand });
      if (!commands.length) {
        await cruder.insert(tableName.blacklist, { wordCommand }).then(() => {
          ctx.reply(`Berhasil Memblokir kata perintah ${wordCommand}`);
        });
      }
    }
  }
});

// leave command handler
management.leave((ctx) => ctx.reply('Good bye'));
management.command('leave', leave());

module.exports = management;
