const { exec } = require('child_process');
const { stdout } = require('process');

const { authUser, checkCommand } = require('../middlewere');
const msgList = require('../message.json');
const argsList = ['cpu', 'memory', 'os'];

const optionsIsAvailable = (option) => {
  return argsList.indexOf(option) > -1;
};

const runCommand = (ctx, command) => {
  exec(command, (err, stdout, stderr) => {
    ctx.reply(stdout);
    if (err) {
      ctx.reply(`Unknown command ${err.cmd}`);
    }
  });
};

const execCommand = (ctx, option) => {
  if (option === argsList[0]) {
    runCommand(ctx, 'bash ./lib/cpu.sh');
  } else if (option === argsList[1]) {
    runCommand(ctx, 'bash ./lib/memory.sh');
  } else if (option === argsList[2]) {
    runCommand(ctx, 'bash ./lib/os-details.sh');
  } else {
    ctx.reply('Not found');
  }
};

module.exports = (bot) => {
  bot.command('check', (ctx) => {
    const text = ctx.update.message.text;
    const args = text.split(' ');
    const options = args[1];

    if (optionsIsAvailable(options)) {
      execCommand(ctx, options);
    } else {
      ctx.reply('Not found');
    }
  });

  bot.command('run', authUser, checkCommand, async (ctx) => {
    const msg = ctx.update.message.text;
    const args = msg.slice(5, msg.length);
    if (args) {
      runCommand(ctx, args);
    } else {
      ctx.reply(msgList.failedCommand);
    }
  });
};
