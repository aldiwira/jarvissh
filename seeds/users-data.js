/* eslint-disable */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(() => {
      return knex('users').insert([
        { id: 1, username: 'aldi', password: 'aldi' },
        { id: 2, username: 'syehfi', password: 'syehfi' },
      ]);
    });
};
