const mysqlPool = require("../config/db");

module.exports.getAll = async (objectId, year) => {
  const [rows] = await mysqlPool.query("CALL victims(?, ?);", [objectId, year]);
  return rows[0];
};
