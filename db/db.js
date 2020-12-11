/* eslint-disable import/order */
const runenv = process.env.NODE_ENV;
const config = require('../knexfile')[runenv];
const knex = require('knex')(config);

const tableName = { users: 'users', blacklist: 'blacklists' };

const cruder = {
  read: (table) => knex.select().from(table),
  find: (table, filter) => knex(table).where(filter).select(),
  insert: (table, datas) => knex(table).insert(datas),
  update: (table, filter, update) => knex(table).where(filter).update(update),
  delete: (table, filter) => knex(table).where(filter).del(),
};

module.exports = { knex, tableName, cruder };
