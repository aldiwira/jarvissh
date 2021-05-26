/* eslint-disable consistent-return */
/* eslint-disable no-return-await */
const WizardScene = require('telegraf/scenes/wizard');
const { Composer, Markup } = require('telegraf');
const { exec } = require('child_process');
const shelljs = require('shelljs');

const { knex, tableName } = require('../../db');
const sceneID = require('../../scenesID.json');

const mainMarkup = Markup.inlineKeyboard([
  Markup.callbackButton('Coba lagi', 'try'),
  Markup.callbackButton('Kembali', 'back'),
]).extra();

const checkCommand = async (ctx, next) => {
  const command = ctx.message.text;
  await knex(tableName.blacklist)
    .where('command', 'like', `${command}`)
    .limit(1)
    .then((v) => {
      if (v[0]) {
        ctx.reply(
          `Perintah ${v[0].command} tidak dapat dijalankan karena terblokir`,
          mainMarkup,
        );
      } else {
        next();
      }
    });
};

const execCommand = async (ctx, command) => {
  try {
    await exec(`${command}`, { shell: true }, (stderr, stdout) => {
      if (stderr) {
        ctx.reply(`Unknown command: \n ${stderr.message}`, mainMarkup);
      } else {
        ctx.reply(
          `Input Command : \n${command}\nOutput Command : \n${stdout}`,
          mainMarkup,
        );
      }
    });
  } catch (error) {
    await ctx.reply(error.message, mainMarkup);
  }
};

const execCd = async (ctx, command) => {
  const split = String(command).split(' ');
  const out = await shelljs.cd(split[1]).exec('ls ./').stdout;
  ctx.reply(
    `Input Command : \n${command}\nOutput Command : \n${out}`,
    mainMarkup,
  );
};

const execHandler = new Composer();

// Again using regex anotion for hears input commands

execHandler.hears(/./g, checkCommand, async (ctx) => {
  const command = ctx.message.text;

  if (command.match(/cd/gi)) {
    await execCd(ctx, command);
  } else {
    await execCommand(ctx, command);
  }
});

execHandler.action('back', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('Back to home');
  return await ctx.scene.enter(sceneID.home_scene);
});
execHandler.action('try', async (ctx) => {
  await ctx.answerCbQuery();
  return await ctx.scene.enter(sceneID.command_execution_wizard);
});

const execCommandWizard = new WizardScene(
  sceneID.command_execution_wizard,
  async (ctx) => {
    await ctx.reply('Masukkan kata perintah yang akan anda jalankan?');
    return await ctx.wizard.next();
  },
  execHandler,
);

module.exports = { execCommandWizard };
