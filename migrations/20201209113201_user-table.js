/* eslint-disable */
exports.up = function (knex) {
  return knex.schema.createTable('users', (tbl) => {
    tbl.increments();
    tbl.string('username').notNullable();
    tbl.string('password').notNullable();
    tbl.boolean('isAdmin').defaultTo(false);
    tbl.date('last_login');
    tbl.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
