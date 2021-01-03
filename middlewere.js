/* eslint-disable no-console */
const { tableName, cruder, knex } = require('./db/db');
const messageTemp = require('./message.json');

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
      await ctx.reply(messageTemp.failedRegister);
    }
  } else {
    await ctx.reply(`Dear ${usrCtx.first_name}, ${messageTemp.notRegister}`);
  }
};

const checkCommand = async (ctx, next) => {
  const usrCtx = ctx.update.message.from;
  const msg = ctx.update.message.text;
  const sliceCommand = msg.slice(5, msg.length);
  const arrCommand = sliceCommand.split(' ');

  const dst = await knex(tableName.blacklist).where(
    'command',
    'like',
    arrCommand[0],
  );
  if (dst.length !== 0) {
    ctx.reply(`Dear ${usrCtx.first_name}, ${messageTemp.blockedCommand}`);
  } else {
    await next();
  }
};

const checkTypeChat = async (ctx, next) => {
  try {
    const typeChat = ctx.update.message.chat.type;
    if (typeChat === 'group') {
      ctx.state.typeChat = 'group';
    } else {
      ctx.state.typeChat = 'personal';
    }
    next();
  } catch (error) {
    ctx.reply(error);
    next();
  }
};

module.exports = { logger, authUser, checkCommand, checkTypeChat };
