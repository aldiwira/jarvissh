/* eslint-disable no-console */
const { tableName, cruder } = require('../db/db');

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

module.exports = { logger, authUser };
