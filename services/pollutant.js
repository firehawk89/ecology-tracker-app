const mysqlPool = require("../config/db");

module.exports.getAll = async () => {
  const [rows] = await mysqlPool.query("SELECT * FROM pollutant");
  return rows;
};

module.exports.insertOne = async (pollutant) => {
  await mysqlPool.query(
    "INSERT INTO pollutant (pollutant_name, min_mass_consumption, max_mass_consumption, gdk, danger_class) VALUES (?, ?, ?, ?, ?)",
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
    "INSERT INTO pollutant (pollutant_name, gdk, min_mass_consumption, max_mass_consumption, danger_class) VALUES ?",
    [rows]
  );
};

module.exports.deleteOneById = async (id) => {
  await mysqlPool.query("DELETE FROM pollutant WHERE pollutant_id = ?", [id]);
};
