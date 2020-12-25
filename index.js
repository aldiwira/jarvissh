const { Telegraf, session, Stage } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.tokenBot);

const { logger, authUser } = require('./middlewere');
const management = require('./stage/management');
const { knex, cruder, tableName } = require('./db/db');
const messageTemp = require('./message.json');
const { serverMarkup } = require('./lib/markups');

// Some Middleware
bot.use(session());
bot.use(logger);

// instance stage
const stage = new Stage();

// scene intiial
stage.register(management);

// enter stage command initial
bot.use(stage.middleware());
bot.command('management', authUser, (ctx) => ctx.scene.enter('management'));

// default

bot.start((ctx) => {
  ctx.reply(messageTemp.welcomeHome, {
    reply_markup: serverMarkup,
  });
});

bot.help((ctx) => {
  ctx.reply(messageTemp.welcomeHome, {
    reply_markup: serverMarkup,
  });
});

bot.command('register', async (ctx) => {
  const dataUser = ctx.update.message.from;
  const reqData = {
    username: dataUser.first_name,
    userId: dataUser.id,
    isAdmin: 0,
  };

  const checkUsers = await knex(tableName.users).where(
    'userId',
    'like',
    reqData.userId,
  );

  if (checkUsers.length === 0 || checkUsers[0].isAdmin === 0) {
    await cruder.insert(tableName.users, reqData).then(() => {
      ctx.reply(`Dear ${dataUser.first_name}, ${messageTemp.successRegister}`);
    });
  } else {
    ctx.reply(`Dear ${dataUser.first_name}, ${messageTemp.failedRegister}`);
  }
});

// Server Execution Command Import
require('./stage/server')(bot);

bot.startPolling();
