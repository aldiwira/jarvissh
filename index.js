const { Telegraf, session, Stage } = require('telegraf');
const moment = require('moment');
require('dotenv').config();

const bot = new Telegraf(process.env.tokenBot);

const { logger, checkTypeChat } = require('./middleware');
const homeStage = require('./stage/home');
const managementStage = require('./stage/management');
const messageTemp = require('./message.json');
const { knex, tableName, cruder } = require('./db');

// Some Middleware
bot.use(session({ makeKey: (ctx) => `${ctx.from.id}:${ctx.chat.id}` }));
bot.use(logger);
bot.use(checkTypeChat);

// instance stage
const stage = new Stage([homeStage, managementStage]);

// enter stage command initial
bot.use(stage.middleware());

// default
bot.start((ctx) => ctx.reply(messageTemp.welcomeLogin));
bot.help((ctx) => ctx.reply(messageTemp.welcomeLogin));

// Login func
// require('./helper/login')(bot);

const updateLastLogin = async (filter, ctx) =>
  cruder.update(tableName.users, filter, {
    last_login: moment
      .unix(ctx.update.message.date)
      .format('YYYY-MM-DD HH:mm:ss'),
  });

bot.command('login', async (ctx) => {
  const msg = ctx.update.message.text;
  const username = msg.split(' ')[1];
  const password = msg.split(' ')[2];

  // delete login message first
  await ctx.deleteMessage(ctx.message_id);

  if (username && password) {
    cruder.find(tableName.users, { username }).then(async (value) => {
      if (password === value[0].password) {
        await updateLastLogin({ id: value[0].id, username }, ctx).then(
          (val) => {
            if (val === 1) {
              // store session data of user
              // eslint-disable-next-line prefer-destructuring
              ctx.session.users = value[0];
              ctx.scene.enter('home');
            }
          },
        );
      } else {
        await ctx.reply('Password salah');
      }
    });
  } else {
    ctx.reply(
      'username / password belum anda masukkan, /login <username> <password>',
    );
  }
});

bot.startPolling();
