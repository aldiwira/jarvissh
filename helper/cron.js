const cron = require('node-cron');
const si = require('systeminformation');
const moment = require('moment');
const { cruder, tableName } = require('../db');
const { sayGreetings } = require('./greetings');

const runCommand = async () => {
  let msg = '';
  const sys = await si.system();
  const bios = await si.bios();
  const cpu = await si.cpu();
  const mem = await si.mem();
  msg += `=================== \n`;
  msg += `Server Time \t: ${moment(await si.time().current).format('LLLL')} \n`;
  msg += `Manufacturer \t: ${sys.manufacturer} / ${sys.model} \n`;
  msg += `Bios \t: ${bios.vendor} / ${bios.version}\n`;
  msg += `CPU \t: ${cpu.manufacturer} ${cpu.brand} ${cpu.speed} Ghz \n`;
  msg += `CPU Speed \t: ${(await si.cpuCurrentSpeed()).cores} \n`;
  msg += `CPU Temperature \t: ${(await si.cpuTemperature()).cores} \n`;
  msg += `Total Memory \t: ${mem.total} bytes \n`;
  msg += `Used / Free Memory \t : ${mem.used} bytes / ${mem.free} bytes \n`;
  msg += `Total Swap \t: ${mem.swaptotal} bytes \n`;
  msg += `Used / Free Swap \t: ${mem.swapused} bytes / ${mem.swapfree} bytes \n`;
  return msg;
};

module.exports = async (telegram) => {
  // Every one hour */59 * * * *
  // every minute * * * * *
  cron.schedule('*/30 * * * *', async () => {
    console.log(`Start Croner`);
    const subsDatas = await cruder.read(tableName.subscriber);
    if (subsDatas.length !== 0) {
      subsDatas.map(async (val) => {
        console.log(`sended to ${val.username}`);
        await telegram.sendMessage(
          val.telegram_id,
          `${sayGreetings()}, ${val.username}.\n ${await runCommand()}`,
        );
      });
    }
  });
};
