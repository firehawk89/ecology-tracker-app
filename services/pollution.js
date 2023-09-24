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
    "INSERT INTO pollution (object_id, pollutant_id, pollution_value, pollution_date) VALUES (?, ?, ?, ?, ?)",
    [
      pollution.objectName,
      pollution.pollutantName,
      pollution.value,
      pollution.date,
    ]
  );
};

module.exports.insertMany = async (rows) => {
  await mysqlPool.query(
    "INSERT INTO pollutant (pollutant_name, min_mass_consumption, max_mass_consumption, gdk, danger_class) VALUES ?",
    [rows]
  );
};

module.exports.updateOneById = async (id, pollution) => {
  const result = await mysqlPool.query(
    "UPDATE pollution SET object_id = ?, pollutant_id = ?, pollution_value = ?, pollution_date = ? WHERE pollution_id = ?",
    [
      pollution.objectName,
      pollution.pollutantName,
      pollution.value,
      pollution.date,
      id,
    ]
  );
  return result[0].affectedRows;
};

module.exports.deleteOneById = async (id) => {
  await mysqlPool.query("DELETE FROM pollution WHERE pollution_id = ?", [id]);
};
