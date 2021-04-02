/* eslint-disable */
const { tableName } = require('../db');
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tableName.users)
    .del()
    .then(() => {
      return knex(tableName.users).insert([
        { id: 1, username: 'aldi', password: 'aldi', isAdmin: true },
        { id: 2, username: 'syehfi', password: 'syehfi', isAdmin: true },
      ]);
    });
};
