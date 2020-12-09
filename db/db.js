const config = require('../knexfile');
const knex = require('knex')(config.development);

const tableName = { users: 'users', blacklist: 'blacklists' };

const cruder = {
  read: (table) => {
    return knex.select().from(table);
  },
  create: (table, filter) => {
    return knex(table).where(filter);
  },
};

module.exports = { knex, tableName, cruder };
