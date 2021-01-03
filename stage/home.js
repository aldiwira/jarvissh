// this is stage home
const { Stage } = require('telegraf');
const Scenes = require('telegraf/scenes/base');

const messageTemp = require('../message.json');
const { serverMarkup } = require('../lib/markups');

const { leave } = Stage;

const home = new Scenes('home');

home.enter((ctx) => {
  ctx.reply(messageTemp.welcomeHome, {
    reply_markup: serverMarkup,
  });
});

home.help((ctx) => {
  ctx.reply(messageTemp.welcomeHome, {
    reply_markup: serverMarkup,
  });
});

// logout
home.leave((ctx) => ctx.reply('Good bye'));
home.command('logout', leave());

// Server Execution Command
require('../helper/server')(home);

module.exports = home;
