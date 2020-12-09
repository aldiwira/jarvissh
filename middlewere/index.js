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
  console.log(await knex.select().from('users'));
  if (ctxChatID === 811295702) {
    await next();
  } else {
    ctx.reply('Anda tidak dapat melakukan layanan ini');
  }
};

module.exports = { logger, authUser };
