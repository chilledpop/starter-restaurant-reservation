const knex = require("../db/connection");


function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((createdTable) => createdTable[0]);
}


module.exports = {
  create,
}