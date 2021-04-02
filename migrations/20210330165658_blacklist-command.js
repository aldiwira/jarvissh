/* eslint-disable */
exports.up = function (knex) {
  return knex.schema.createTable('blacklists', (tbl) => {
    tbl.increments();
    tbl.string('command').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('blacklists');
};
