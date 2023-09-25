const mysqlPool = require("../config/db");

module.exports.getAll = async () => {
  const [rows] = await mysqlPool.query("SELECT * FROM pollutant;");
  return rows;
};

module.exports.getById = async (id) => {
  const [row] = await mysqlPool.query(
    "SELECT * FROM pollutant WHERE pollutant_id = ?;",
    [id]
  );
  return row[0];
};

module.exports.getIdByName = async (name) => {
  const [foundRow] = await mysqlPool.query(
    "SELECT pollutant_id FROM pollutant WHERE pollutant_name = ?;",
    [name]
  );
  const id = foundRow[0].pollutant_id;

  return id;
};

module.exports.insertOne = async (pollutant) => {
  await mysqlPool.query(
    "INSERT INTO pollutant (pollutant_name, min_mass_consumption, max_mass_consumption, gdk, danger_class) VALUES (?, ?, ?, ?, ?);",
    [
      pollutant.name,
      pollutant.minMassCons,
      pollutant.maxMassCons,
      pollutant.gdk,
      pollutant.dangerClass,
    ]
  );
};

module.exports.insertMany = async (rows) => {
  await mysqlPool.query(
    "INSERT INTO pollutant (pollutant_name, min_mass_consumption, max_mass_consumption, gdk, danger_class) VALUES ?;",
    [rows]
  );
};

module.exports.updateOneById = async (id, pollutant) => {
  const result = await mysqlPool.query(
    `UPDATE pollutant SET 
	pollutant_name = ?, 
	min_mass_consumption = ?, 
	max_mass_consumption = ?, 
	gdk = ?, 
	danger_class = ? 
	WHERE pollutant_id = ?;`,
    [
      pollutant.name,
      pollutant.minMassCons,
      pollutant.maxMassCons,
      pollutant.gdk,
      pollutant.dangerClass,
      id,
    ]
  );
  return result[0].affectedRows;
};

module.exports.deleteOneById = async (id) => {
  const result = await mysqlPool.query(
    "DELETE FROM pollutant WHERE pollutant_id = ?;",
    [id]
  );
  return result[0].affectedRows;
};
