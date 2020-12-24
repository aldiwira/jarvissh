const Markup = require('telegraf/markup');

const serverMarkup = Markup.inlineKeyboard([
  [Markup.callbackButton('Check System Operation', 'os')],
  [Markup.callbackButton('Check Disk Usage', 'disk')],
  [Markup.callbackButton('Check Top Memory Usage', 'memory')],
  [Markup.callbackButton('Check Top CPU Usage', 'cpu')],
]);

module.exports = { serverMarkup };
