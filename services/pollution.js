const mysqlPool = require("../config/db");
const pollutantService = require("./pollutant");

module.exports.getAll = async () => {
  const [rows] = await mysqlPool.query(
    `SELECT pollution.pollution_id, object.object_name, pollutant.pollutant_name,pollution. pollution_value, pollution.pollution_year 
	FROM pollution 
	INNER JOIN object 
	ON pollution.object_id = object.object_id 
	INNER JOIN pollutant 
	ON pollution.pollutant_id = pollutant.pollutant_id
	ORDER BY pollution_id;`
  );
  return rows;
};

module.exports.getById = async (id) => {
  const [row] = await mysqlPool.query(
    `SELECT pollution.pollution_id, object.object_name, pollutant.pollutant_name, pollution.pollution_value, pollution.pollution_year 
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

module.exports.insertOne = async (pollution) => {
  const objectId = await this.getIdByName(pollution.object);
  const pollutantId = await pollutantService.getIdByName(pollution.pollutant);

  await mysqlPool.query(
    "INSERT INTO pollution (object_id, pollutant_id, pollution_value, pollution_year) VALUES (?, ?, ?, ?);",
    [objectId, pollutantId, pollution.value, pollution.year]
  );
};

module.exports.insertMany = async (rows) => {
  console.log(rows);
  await mysqlPool.query(
    "INSERT INTO pollution (object_id, pollutant_id, pollution_value, pollution_year) VALUES ?;",
    [rows]
  );
};

module.exports.updateOneById = async (id, pollution) => {
  const objectId = await this.getIdByName(pollution.object);
  const pollutantId = await pollutantService.getIdByName(pollution.pollutant);

  const result = await mysqlPool.query(
    "UPDATE pollution SET object_id = ?, pollutant_id = ?, pollution_value = ?, pollution_year = ? WHERE pollution_id = ?;",
    [objectId, pollutantId, pollution.value, pollution.year, id]
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
