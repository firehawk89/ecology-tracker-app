const mysqlPool = require("../config/db");

module.exports.getAll = async () => {
  const [rows] = await mysqlPool.query(
    `SELECT pollution.pollution_id, object.object_name, pollutant.pollutant_name, pollution_value, pollution_year 
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
    "SELECT * FROM pollution WHERE pollution_id = ?;",
    [id]
  );
  return row[0];
};

module.exports.insertOne = async (pollution) => {
  const [foundObject] = await mysqlPool.query(
    "SELECT object_id FROM object WHERE object_name = ?;",
    [pollution.object]
  );
  const objectId = foundObject[0].object_id;

  const [foundPollutant] = await mysqlPool.query(
    "SELECT pollutant_id FROM pollutant WHERE pollutant_name = ?;",
    [pollution.pollutant]
  );
  const pollutantId = foundPollutant[0].pollutant_id;

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
  const result = await mysqlPool.query(
    "UPDATE pollution SET object_id = ?, pollutant_id = ?, pollution_value = ?, pollution_year = ? WHERE pollution_id = ?;",
    [pollution.object, pollution.pollutant, pollution.value, pollution.year, id]
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
