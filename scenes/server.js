// server command exec
const { exec } = require('child_process');

const argsList = ['cpu', 'memory', 'os', 'disk'];

const optionsIsAvailable = (option) => argsList.includes(option);

const runCommand = (ctx, command) => {
  exec(command, (err, stdout) => {
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
  } else if (option === argsList[3]) {
    runCommand(ctx, 'bash ./lib/disk-usage.sh');
  } else {
    ctx.reply('Not found');
  }
};

module.exports = (bot) => {
  // TODO : CHECK STAT SERVER MIGRATE TO WIZARD
  bot.command('check', (ctx) => {
    const { text } = ctx.update.message;
    const args = text.split(' ');
    const options = args[1];

    if (optionsIsAvailable(options)) {
      execCommand(ctx, options);
    } else {
      ctx.reply('Not found');
    }
  });

  // Listener Actions
  bot.action(['os', 'disk', 'memory', 'cpu'], async (ctx) => {
    try {
      await execCommand(ctx, ctx.match);
      await ctx.answerCbQuery();
    } catch (error) {
      throw new Error(error);
    }
  });
};
