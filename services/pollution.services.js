const mysqlPool = require("../config/db");
const pollutantServices = require("./pollutant.services");

module.exports.getAll = async () => {
  const [rows] = await mysqlPool.query(
    `SELECT pollution.pollution_id, object.object_name, pollutant.pollutant_name, pollution.pollution_value, pollution.pollution_year, pollution.concentration 
	FROM pollution 
	INNER JOIN object 
	ON pollution.object_id = object.object_id 
	INNER JOIN pollutant 
	ON pollution.pollutant_id = pollutant.pollutant_id
	ORDER BY pollution_id;`
  );
  return rows;
};

module.exports.getPollutantIds = async () => {
  const [rows] = await mysqlPool.query(
    "SELECT DISTINCT(pollutant_id) FROM pollution;"
  );
  return rows;
};

module.exports.getById = async (id) => {
  const [row] = await mysqlPool.query(
    `SELECT pollution.pollution_id, object.object_name, pollutant.pollutant_name, pollution.pollution_value, pollution.pollution_year, pollution.concentration
	FROM pollution 
	INNER JOIN object 
	ON pollution.object_id = object.object_id 
	INNER JOIN pollutant 
	ON pollution.pollutant_id = pollutant.pollutant_id 
	WHERE pollution_id = ?;`,
    [id]
  );
  return row[0];
};

module.exports.getIdByName = async (name) => {
  const [foundRow] = await mysqlPool.query(
    "SELECT object_id FROM object WHERE object_name = ?;",
    [name]
  );
  const id = foundRow[0].object_id;

  return id;
};

module.exports.getYears = async () => {
  const [rows] = await mysqlPool.query(
    "SELECT DISTINCT pollution_year as year FROM pollution ORDER BY pollution_year;"
  );
  return rows;
};

module.exports.insertOne = async (pollution) => {
  const objectId = await this.getIdByName(pollution.object);
  const pollutantId = await pollutantServices.getIdByName(pollution.pollutant);

  await mysqlPool.query(
    "INSERT INTO pollution (object_id, pollutant_id, pollution_value, pollution_year, concentration) VALUES (?, ?, ?, ?, ?);",
    [
      objectId,
      pollutantId,
      pollution.value,
      pollution.year,
      pollution.concentration,
    ]
  );
};

module.exports.insertMany = async (rows) => {
  await mysqlPool.query(
    "INSERT INTO pollution (object_id, pollutant_id, pollution_value, pollution_year, concentration) VALUES ?;",
    [rows]
  );
};

module.exports.updateOneById = async (id, pollution) => {
  const objectId = await this.getIdByName(pollution.object);
  const pollutantId = await pollutantServices.getIdByName(pollution.pollutant);

  const result = await mysqlPool.query(
    `UPDATE pollution 
	SET 
	object_id = ?, 
	pollutant_id = ?, 
	pollution_value = ?, 
	pollution_year = ?, 
	concentration = ? 
	WHERE pollution_id = ?;
	`,
    [
      objectId,
      pollutantId,
      pollution.value,
      pollution.year,
      pollution.concentration,
      id,
    ]
  );
  return result[0].affectedRows;
};

module.exports.deleteOneById = async (id) => {
  const result = await mysqlPool.query(
    "DELETE FROM pollution WHERE pollution_id = ?;",
    [id]
  );
  return result[0].affectedRows;
};
