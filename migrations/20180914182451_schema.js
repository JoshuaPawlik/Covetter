
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('files', function (table) {
    table.increments('id').primary();
    // table.string('repoName').unique();
    table.string('title');
    table.string('par1');
    table.string('par2');
    table.string('par3');
    // table.unique('id');
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('files')
};
