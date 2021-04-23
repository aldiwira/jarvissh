/* eslint-disable */
const { tableName } = require('../db');
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tableName.users)
    .del()
    .then(() => {
      return knex(tableName.users).insert([
        {
          id: 1,
          username: 'aldi',
          telegram_id: '1302685899',
          isAdmin: true,
          isAllowed: true,
        },
      ]);
    });
};
