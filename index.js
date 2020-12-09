const { Telegraf, session } = require('telegraf');
const { exec } = require('child_process');
require('dotenv').config();

const bot = new Telegraf(process.env.tokenBot);

const { logger, authUser } = require('./middlewere');

bot.use(session());
bot.use(logger);
bot.use(authUser);

bot.start((ctx) => {
  ctx.reply('Hai');
});

bot.command('run', (ctx) => {
  const msg = ctx.update.message.text;
  const msgl = msg.length;
  const out = msg.slice(5, msgl);

  if (out.length !== 0) {
    exec(out, (error, stdout) => {
      ctx.reply(stdout);
    });
  }
});

bot.launch();
