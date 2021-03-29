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

// TODO : Function for add user
// management.command('adduser', async (ctx) => {
//   const msg = ctx.update.message;
//   const splitMsg = msg.split(' ');
//   const username = splitMsg[1];

//   console.log(sp)
//   // try {
//   //   const usersDatas = await knex(tableName.users).where(
//   //     'username',
//   //     'like',
//   //     username,
//   //   );
//   // } catch (error) {
//   //   throw new Error(error);
//   // }
// });

// leave command handler
management.leave((ctx) => ctx.reply('Good bye'));
management.command('leave', leave());

module.exports = management;
