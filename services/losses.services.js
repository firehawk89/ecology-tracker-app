const mysqlPool = require("../config/db");

module.exports.getAll = async (objectId, year) => {
  const [rows] = await mysqlPool.query("CALL fine(?, ?);", [objectId, year]);
  return rows[0];
};

module.exports.getSum = async (objectId, year) => {
  const [rows] = await mysqlPool.query("CALL fine_sum(?, ?);", [
    objectId,
    year,
  ]);
  return rows[0][0].fine_sum;
};
