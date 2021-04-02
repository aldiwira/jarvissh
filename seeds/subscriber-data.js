/* eslint-disable */
const { tableName } = require('../db');
exports.seed = async (knex) =>
  knex(tableName.subscriber)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(tableName.subscriber).insert([
        {
          id: 1,
          username: 'Aldi',
          user_id: '1302685899',
          isGroup: false,
        },
        {
          id: 2,
          username: 'Testing Group',
          user_id: '-1001488456651',
          isGroup: true,
        },
        {
          id: 3,
          username: 'Syehfi',
          user_id: '695246864',
          isGroup: false,
        },
      ]);
    });
