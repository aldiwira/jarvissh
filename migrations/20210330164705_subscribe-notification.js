/* eslint-disable */
exports.up = function (knex) {
  return knex.schema.createTable('subscribe', (t) => {
    t.increments('id').primary();
    t.string('username').notNullable();
    t.string('user_id').notNullable();
    t.boolean('isGroup').defaultTo('false');
    t.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('subscribe');
};
