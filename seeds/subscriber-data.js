/* eslint-disable */
const { tableName } = require('../db');
exports.seed = async (knex) =>
  knex(tableName.subscriber)
    .del()
    .then(() =>
      knex(tableName.subscriber).insert([
        {
          id: 1,
          username: 'Aldi',
          telegram_id: '1302685899',
        },
      ]),
    );
