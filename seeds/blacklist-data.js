/* eslint-disable */
const { tableName } = require('../db/db');
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tableName.blacklist)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(tableName.blacklist).insert([
        { id: 1, command: 'rm' },
        { id: 2, command: 'shutdown' },
        { id: 3, command: 'init' },
        { id: 4, command: 'ping' },
      ]);
    });
};
