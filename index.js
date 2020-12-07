const { stdout, stdin } = require("process");
const { Telegraf, session } = require("telegraf");
const exec = require("child_process").exec;
require("dotenv").config();
const bot = new Telegraf(process.env.tokenBot);

bot.use(session());
bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log("Response time: %sms", ms);
  console.log(ctx.update.message);
});

const authentication = async (ctx, next) => {
  if (ctx.update.message.chat.id === 811295702) {
    await next();
  } else {
    ctx.reply("Anda tidak dapat melakukan layanan ini");
  }
};

bot.use(authentication);

bot.start(authentication, (ctx) => {
  ctx.reply("Hai");
});
bot.help((ctx) => ctx.reply("Send me a sticker"));

bot.command("run", (ctx) => {
  const msg = ctx.update.message.text;
  const msgl = msg.length;
  const out = msg.slice(5, msgl);

  if (out.length !== 0) {
    exec(out, (error, stdout, stdin) => {
      ctx.reply(stdout);
    });
  }
});

bot.launch();
