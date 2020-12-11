const { Telegraf, session, Stage } = require('telegraf');
const { exec } = require('child_process');
require('dotenv').config();

const bot = new Telegraf(process.env.tokenBot);

const { logger, authUser, checkCommand } = require('./middlewere');
const management = require('./stage/management');
const { knex, cruder, tableName } = require('./db/db');

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
bot.start(authUser, (ctx) => {
  ctx.reply('Hai');
});

bot.command('run', authUser, checkCommand, async (ctx) => {
  const msg = ctx.update.message.text;
  const msgl = msg.length;
  const out = msg.slice(5, msgl);
  if (out.length !== 0) {
    await exec(out, (error, stdout) => {
      ctx.reply(stdout);
    });
  } else {
    ctx.reply('Tidak ada command yang perlu dijalankan');
  }
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

  if (checkUsers.length === 0) {
    await cruder.insert(tableName.users, reqData).then(() => {
      ctx.reply(
        `Dear ${dataUser.first_name}, Registrasi sudah berhasil.\ntunggu sampai sudah terverifikasi`,
      );
    });
  } else {
    ctx.reply('No');
  }
});

bot.launch();
