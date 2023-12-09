const mysqlPool = require("../config/db");

module.exports.getAll = async (objectId, year, pollutantId) => {
  const [rows] = await mysqlPool.query(
    "CALL calc_bill(?, ?, ?, 3, 3, 3, 1, 0.9, 0.8, 1.2, 1, 1.34, 0.876, 1, 1.115, 0.87, 1.12, 1.01, 1, 1, 0.9);",
    [objectId, year, pollutantId]
  );
  return rows[0];
};
