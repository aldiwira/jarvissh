/* eslint-disable arrow-body-style */
/* eslint-disable import/order */
const runenv = process.env.NODE_ENV;
const config = require('../knexfile')[runenv];
const knex = require('knex')(config);

const tableName = { users: 'users', blacklist: 'blacklists' };

const cruder = {
  read: (table) => {
    return knex.select().from(table);
  },
  find: (table, filter) => {
    return knex(table).where(filter).select();
  },
};

module.exports = { knex, tableName, cruder };
