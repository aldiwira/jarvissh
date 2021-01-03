/* eslint-disable func-names */
exports.up = function (knex) {
  return knex.schema
    .createTable('users', (tbl) => {
      tbl.increments();
      tbl.string('username').notNullable();
      tbl.string('password').notNullable();
      tbl.date('last_login');
      tbl.timestamps(true, true);
    })
    .createTable('blacklists', (tbl) => {
      tbl.increments();
      tbl.string('command').notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users').dropTableIfExists('blacklists');
};
