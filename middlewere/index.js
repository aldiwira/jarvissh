/* eslint-disable no-console */
const { tableName, cruder, knex } = require('../db/db');

const logger = async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log('Response time: %sms', ms);
  console.log(ctx.update.message);
};

const authUser = async (ctx, next) => {
  const ctxChatID = ctx.update.message.chat.id;
  const usersFind = (
    await cruder.find(tableName.users, { userId: ctxChatID })
  )[0];
  if (usersFind && ctxChatID === usersFind.userId) {
    await next();
  } else {
    ctx.reply('Anda tidak dapat melakukan layanan ini');
  }
};

const checkCommand = async (ctx, next) => {
  const msg = ctx.update.message.text;
  const msgl = msg.length;
  const sliceCommand = msg.slice(5, msgl);
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
