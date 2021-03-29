// this is stage home
const { Stage } = require('telegraf');
const Scenes = require('telegraf/scenes/base');

const messageTemp = require('../message.json');
const { serverMarkup } = require('../lib/markups');
const { cruder, tableName } = require('../db');

const { leave } = Stage;

const home = new Scenes('home');

const greetUsers = (ctx) => {
  const { users } = ctx.session;
  ctx.reply(
    `Selamat datang ${users.username} \nLast Login : ${users.last_login}`,
  );
};

// For bot enter stage and re enter
home.enter(async (ctx) => {
  greetUsers(ctx);
  await ctx.reply(messageTemp.welcomeHome, {
    reply_markup: serverMarkup,
  });
});

home.help(async (ctx) => {
  greetUsers(ctx);
  await ctx.reply(messageTemp.welcomeHome, {
    reply_markup: serverMarkup,
  });
});

// TODO : Enter Management with state of chat type
home.command('manage', async (ctx) => {
  const { users } = ctx.session;
  if (users.isAdmin) {
    ctx.scene.enter('management');
  } else {
    ctx.reply(`Untuk ${users.username}, Anda tidak diizinkan untuk masuk`);
  }
});

// logout
home.leave(async (ctx) => {
  ctx.session.users = null;
  await ctx.reply('Good bye');
});
home.command('logout', leave());

// Server Execution Command
require('../helper/server')(home);

module.exports = home;
