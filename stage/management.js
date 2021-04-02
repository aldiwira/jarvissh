// this is stage management admin
/* eslint-disable array-callback-return */
const { Stage } = require('telegraf');
const Scenes = require('telegraf/scenes/base');
const { cruder, tableName, knex } = require('../db');
const messageTemp = require('../message.json');

const { leave } = Stage;

const management = new Scenes('management');

management.enter((ctx) => {
  ctx.reply(
    `Dear ${ctx.update.message.from.first_name}, ${messageTemp.managementGretting}`,
  );
});

management.help((ctx) => {
  ctx.reply(
    `Dear ${ctx.update.message.from.first_name}, ${messageTemp.managementGretting}`,
  );
});

management.command('adduser', async (ctx) => {
  const msg = ctx.update.message.text.split(' ');
  const username = msg[1];
  const password = msg[2];

  try {
    if (username && password) {
      const usersDatas = await knex(tableName.users).where(
        'username',
        'like',
        username,
      );
      if (!usersDatas.length) {
        // TODO : Hashing user password
        await cruder
          .insert(tableName.users, {
            username,
            password,
          })
          .then((v) => {
            ctx.reply(
              `${username} berhasil terdaftar pada sistem \nID : ${v[0]} \nUsername : ${username} \nPassword : ${password}`,
            );
          });
      } else {
        ctx.reply(`Mohon maaf, username ${username} sudah digunakan`);
      }
    } else {
      ctx.reply(
        'Pastikan username dan password sudah tertulis. format /adduser <username> <password>',
      );
    }
  } catch (error) {
    throw new Error(error);
  }
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
    const username = msg[2];
    if (username) {
      const delUser = await knex(tableName.users)
        .where('username', username)
        .del();
      if (delUser === 1) {
        await ctx.reply(`Pengguna ${username} berhasil dihapus`);
      } else {
        await ctx.reply(`Pengguna ${username} tidak dapat ditemukan`);
      }
    } else {
      await ctx.reply('Masukkan username yang akan dihapus');
    }
  }
});

// TODO : Create Command for manage subscriber
// TODO : Create Command for manage blacklist command

// leave command handler
management.leave((ctx) => ctx.reply('Good bye'));
management.command('leave', leave());

module.exports = management;
