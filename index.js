const { Telegraf, session, Stage } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.tokenBot);

const { logger, checkTypeChat } = require('./middlewere');
const homeStage = require('./stage/home');
const managementStage = require('./stage/management');
const messageTemp = require('./message.json');

// Some Middleware
bot.use(session());
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
require('./helper/login')(bot);

bot.startPolling();
