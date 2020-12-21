/* eslint-disable array-callback-return */
const { Stage } = require('telegraf');
const Scenes = require('telegraf/scenes/base');
const { cruder, tableName } = require('../db/db');

const { leave } = Stage;

const management = new Scenes('management');

management.enter((ctx) => {
  ctx.reply('Selamat datang admin di management akses');
});

// untuk menampilkan data

management.command('show', async (ctx) => {
  const msg = ctx.update.message.text;
  const sliceCommand = msg.slice(6, msg.length);
  const command = sliceCommand.split(' ')[0];

  const listCmd = ['user', 'request', 'blacklist'];
  let msgs = '';

  if (command === listCmd[0]) {
    const user = await cruder.find(tableName.users, { isAdmin: true });
    msgs += 'List admin \n';
    if (user.length !== 0) {
      user.map((val) => {
        msgs += `id : ${val.id}, username : ${val.username} \n`;
      });
    } else {
      msgs += 'Tidak ada admin server';
    }

    ctx.reply(msgs);
  } else if (command === listCmd[1]) {
    const user = await cruder.find(tableName.users, { isAdmin: false });
    msgs += 'List request akses admin \n';
    if (user.length !== 0) {
      user.map((val) => {
        msgs += `id : ${val.id}, username : ${val.username} \n`;
      });
    } else {
      msgs += 'Tidak ada pengakses server';
    }
    ctx.reply(msgs);
  } else if (command === listCmd[2]) {
    const blacklist = await cruder.read(tableName.blacklist);
    msgs += 'List command terblacklist \n';
    if (blacklist.length !== 0) {
      blacklist.map((val) => {
        const valmsg = `id : ${val.id}, command : ${val.command} \n`;
        msgs += valmsg;
      });
    } else {
      msgs += 'Tidak ada blacklist command';
    }
    ctx.reply(msgs);
  }
});

// user management
// verify user
management.command('verify', async (ctx) => {
  const msg = ctx.update.message.text;
  const usrCtx = ctx.update.message.from;

  const sliceCommand = msg.split(' ');
  const value = sliceCommand[1];
  if (value) {
    const checker = await cruder.find(tableName.users, { id: value });
    if (checker.length !== 0 && checker[0].isAdmin === 0) {
      const filter = { id: value };
      const update = { isAdmin: 1 };
      await cruder.update(tableName.users, filter, update).then(() => {
        ctx.reply(`${checker[0].username} sudah di verifikasi`);
        // send notif to target
        ctx.telegram.sendMessage(
          checker[0].userId,
          `Dear ${usrCtx.first_name}, Akun anda sudah berhasil terverifikasi`,
        );
      });
    } else {
      await ctx.reply('id user salah');
    }
  } else {
    await ctx.reply('id user salah');
  }
});
// banned user
management.command('banned', async (ctx) => {
  const msg = ctx.update.message.text;
  const sliceCommand = msg.split(' ');
  const value = sliceCommand[1];
  if (value) {
    await cruder
      .update(tableName.users, { id: value }, { isAdmin: 0 })
      .then((datas) => {
        if (datas) {
          ctx.reply('Berhasil membanned user');
        } else {
          ctx.reply('User id salah');
        }
      });
  } else {
    ctx.reply('User id salah');
  }
});

// blacklist management
// add blacklist
management.command('add', async (ctx) => {
  const msg = ctx.update.message.text;
  const sliceCommand = msg.split(' ');
  const command = sliceCommand[1];
  const value = sliceCommand[2];

  const listCmd = ['admin', 'blacklist'];
  if (command === listCmd[1]) {
    const checker = await cruder.find(tableName.blacklist, { command: value });
    if (checker.length === 0) {
      await cruder.insert(tableName.blacklist, { command: value }).then(() => {
        ctx.reply(`${value} berhasil diblacklist`);
      });
    } else {
      ctx.reply(`${value} sudah ada diblacklist`);
    }
  }
});

// remove blacklist
management.command('remove', async (ctx) => {
  const msg = ctx.update.message.text;
  const sliceCommand = msg.split(' ');
  const command = sliceCommand[1];
  const value = sliceCommand[2];

  const listCmd = ['blacklist'];
  if (command === listCmd[0]) {
    await cruder.delete(tableName.blacklist, { id: value }).then((datas) => {
      if (datas) {
        ctx.reply(`${value} sudah dihapus dari blacklist command`);
      }
    });
  }
});

management.command('leave', (ctx) => {
  ctx.reply('Meninggalkan management stage');
  leave();
});

module.exports = management;
