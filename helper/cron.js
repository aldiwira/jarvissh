const cron = require('node-cron');
const { exec } = require('child_process');
const moment = require('moment');
const { cruder, tableName } = require('../db');
const { sayGreetings } = require('./greetings');

const runCommand = new Promise((resolve, reject) => {
  exec('bash ./lib/cpu.sh', (err, stdout) => {
    if (err) {
      reject(err);
    }
    resolve(stdout);
  });
});

module.exports = async (telegram) => {
  cron.schedule('30 * * * *', async () => {
    const subsDatas = await cruder.read(tableName.subscriber);
    subsDatas.map(async (val) => {
      console.log(`sended to ${val.username}`);
      await telegram.sendMessage(
        val.user_id,
        `${sayGreetings()}, ${val.username}. \n ${await runCommand.then(
          (v) => v,
        )} \n Date Now : ${moment().format('LLLL')}`,
      );
    });
  });
};
