/* eslint-disable */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(() => {
      return knex('users').insert([
        { id: 1, username: 'Seyeung', userId: 811295702, isAdmin: true },
        { id: 2, username: 'Syehfi', userId: 695246864, isAdmin: true },
      ]);
    });
};
