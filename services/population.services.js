const mysqlPool = require("../config/db");

module.exports.getAll = async () => {
  const [rows] = await mysqlPool.query("SELECT * FROM population;");
  return rows;
};

module.exports.getById = async (id) => {
  const [row] = await mysqlPool.query(
    "SELECT * FROM population WHERE population_id = ?;",
    [id]
  );
  return row[0];
};

module.exports.insertOne = async (population) => {
  await mysqlPool.query(
    "INSERT INTO population (population_number, population_year) VALUES (?, ?);",
    [population.number, population.year]
  );
};

module.exports.insertMany = async (rows) => {
  await mysqlPool.query(
    "INSERT INTO population (population_number, population_year) VALUES ?;",
    [rows]
  );
};

module.exports.updateOneById = async (id, population) => {
  const result = await mysqlPool.query(
    "UPDATE population SET population_number = ?, population_year = ? WHERE population_id = ?;",
    [population.number, population.year, id]
  );
  return result[0].affectedRows;
};

module.exports.deleteOneById = async (id) => {
  const result = await mysqlPool.query(
    "DELETE FROM population WHERE population_id = ?;",
    [id]
  );
  return result[0].affectedRows;
};
