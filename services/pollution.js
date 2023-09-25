const mysqlPool = require("../config/db");

module.exports.getAll = async () => {
  const [rows] = await mysqlPool.query("SELECT * FROM pollution");
  return rows;
};

module.exports.getById = async (id) => {
  const [row] = await mysqlPool.query(
    "SELECT * FROM pollution WHERE pollution_id = ?",
    [id]
  );
  return row[0];
};

module.exports.insertOne = async (pollution) => {
  await mysqlPool.query(
    "INSERT INTO pollution (object_id, pollutant_id, pollution_value, pollution_year) VALUES (?, ?, ?, ?)",
    [pollution.object, pollution.pollutant, pollution.value, pollution.year]
  );
};

module.exports.insertMany = async (rows) => {
  console.log(rows);
  await mysqlPool.query(
    "INSERT INTO pollution (object_id, pollutant_id, pollution_value, pollution_year) VALUES ?",
    [rows]
  );
};

module.exports.updateOneById = async (id, pollution) => {
  const result = await mysqlPool.query(
    "UPDATE pollution SET object_id = ?, pollutant_id = ?, pollution_value = ?, pollution_year = ? WHERE pollution_id = ?",
    [pollution.object, pollution.pollutant, pollution.value, pollution.year, id]
  );
  return result[0].affectedRows;
};

module.exports.deleteOneById = async (id) => {
  const result = await mysqlPool.query(
    "DELETE FROM pollution WHERE pollution_id = ?",
    [id]
  );
  return result[0].affectedRows;
};
