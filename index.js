const { Telegraf, session, Stage, Telegram } = require('telegraf');
require('dotenv').config();

const { logger } = require('./middleware');
const croner = require('./helper/cron');
const homeStage = require('./stage/home');
const managementStage = require('./stage/management');
const messageTemp = require('./message.json');

// instance telegram service
const bot = new Telegraf(process.env.tokenBot);
const telegram = new Telegram(process.env.tokenBot);

// Some Middleware
bot.use(session({ makeKey: (ctx) => `${ctx.from.id}:${ctx.chat.id}` }));
bot.use(logger);

// instance stage
const stage = new Stage([homeStage, managementStage]);

// enter stage command initial
bot.use(stage.middleware());

// default
bot.start((ctx) => ctx.reply(messageTemp.welcomeLogin));
bot.help((ctx) => ctx.reply(messageTemp.welcomeLogin));

// Login func
require('./stage/login')(bot);

// scheduled process
croner(telegram);

bot.launch();
