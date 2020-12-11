/* eslint-disable no-console */
const { tableName, cruder, knex } = require('../db/db');

const logger = async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log('Response time: %sms', ms);
  console.log(
    process.env.NODE_ENV === 'development' ? ctx.update.message : null,
  );
};

const authUser = async (ctx, next) => {
  const usrCtx = ctx.update.message.from;

  const usersFind = (
    await cruder.find(tableName.users, { userId: usrCtx.id })
  )[0];

  if (usersFind && usrCtx.id === usersFind.userId) {
    if (usersFind.isAdmin === 1) {
      await next();
    } else {
      await ctx.reply('Anda masih tidak terdaftar / sedang di banned');
    }
  } else {
    await ctx.reply(
      `Dear ${usrCtx.first_name}, Mohon registrasi terlebih dahulu dengan dengan memasukkan command '/register'.\nAnda tidak dapat melakukan layanan ini`,
    );
  }
};

const checkCommand = async (ctx, next) => {
  const msg = ctx.update.message.text;
  const sliceCommand = msg.slice(5, msg.length);
  const arrCommand = sliceCommand.split(' ');

  const dst = await knex(tableName.blacklist).where(
    'command',
    'like',
    arrCommand[0],
  );
  if (dst.length !== 0) {
    ctx.reply('dibloker');
  } else {
    await next();
  }
};

module.exports = { logger, authUser, checkCommand };
