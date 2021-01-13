/* eslint-disable no-console */
const { tableName, knex } = require('./db/db');
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

const checkTypeChat = (ctx, next) => {
  const typeChat = ctx.chat.type;
  if (typeChat === 'supergroup') {
    ctx.state.typeChat = 'group';
    next();
  } else if (typeChat === 'group') {
    ctx.reply('PERHATIAN : Pastikan bot menjadi Administrator pada Group');
  } else {
    ctx.state.typeChat = 'personal';
    next();
  }
};

module.exports = {
  logger,
  checkCommand,
  checkTypeChat,
};
