// eslint-disable-next-line object-curly-newline
const { Telegraf, session, Stage, Telegram } = require('telegraf');
require('dotenv').config();

const { logger } = require('./middleware');
const croner = require('./helper/cron');
const { ScenesLists } = require('./scenes');
const messageTemp = require('./message.json');

// instance telegram service
const bot = new Telegraf(process.env.BOT_TOKEN);
const telegram = new Telegram(process.env.BOT_TOKEN);

// Some Middleware
bot.use(session({ makeKey: (ctx) => `${ctx.from.id}:${ctx.chat.id}` }));
bot.use(logger);

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
