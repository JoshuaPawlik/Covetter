
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('users', function (table) {
    table.increments('id').primary();
    // table.string('repoName').unique();
    table.string('userName');
    // table.integer('numStars');
    // table.string('repoUrl');
    // table.unique('id');
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
};
