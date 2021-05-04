// eslint-disable-next-line object-curly-newline
const { Telegraf, session, Stage, Telegram } = require('telegraf');
require('dotenv').config();

const { logger } = require('./middleware');
const croner = require('./helper/cron');
const { ScenesLists } = require('./scenes');
const messageTemp = require('./message.json');
const { setCommands } = require('./helper/commandhooks');

// instance telegram service
const bot = new Telegraf(process.env.BOT_TOKEN);
const telegram = new Telegram(process.env.BOT_TOKEN);

// Some Middleware
bot.use(session({ makeKey: (ctx) => `${ctx.from.id}:${ctx.chat.id}` }));
bot.use(logger);
bot.use(async (ctx, next) => {
  await ctx.reply('mid test');
  await telegram.setMyCommands([
    {
      command: 'start',
      description: 'Untuk memulai sesion bot',
    },
    {
      command: 'login',
      description: 'Untuk melakukan login dalam penggunaan bot',
    },
    {
      command: 'register',
      description: 'Untuk melakukan registrasi akun untuk penggunaan bot',
    },
  ]);
  next();
});

// instance stage
const stage = new Stage(ScenesLists);

// enter stage command initial
bot.use(stage.middleware());

// default
bot.start((ctx) => ctx.reply(messageTemp.welcomeLogin));
bot.help((ctx) => ctx.reply(messageTemp.welcomeLogin));

// Login func
require('./scenes/login')(bot);

// scheduled process
croner(telegram);

bot.launch();
