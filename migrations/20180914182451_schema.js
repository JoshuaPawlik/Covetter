// /* eslint-disable */

exports.up = function (knex, Promise) {
  return createFiles()
    .then(createPars);


  function createFiles() {
    return knex.schema.createTableIfNotExists('files', (table) => {
      table.increments('id').primary();
      // table.string('repoName').unique();
      table.string('title');
      // table.string('par1');
      // table.string('par2');
      // table.string('par3');
      // table.unique('id');
    });
  }


  function createPars() {
    return knex.schema.createTableIfNotExists('pars', (table) => {
      table.integer('file_id');
      table.integer('par_num');
      table.string('text');
      table.foreign('file_id').references('id').inTable('files');
    });
  }
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('files')
    .then(() => {
      return knex.schema.dropTable('pars')
    })
};
