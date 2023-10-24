const mysqlPool = require("../config/db");

module.exports.getNonCarcinogenicRisks = async (objectId, year) => {
  const [rows] = await mysqlPool.query("CALL non_cancerogenic_risk(?, ?);", [
    objectId,
    year,
  ]);
  return rows[0];
};

module.exports.getHqSum = async (objectId, year) => {
  const [rows] = await mysqlPool.query(
    "SELECT sum_of_hq_func(?, ?) AS sum_hq;",
    [objectId, year]
  );
  return rows[0].sum_hq;
};

module.exports.getCarcinogenicRisks = async (objectId, year) => {
  const [rows] = await mysqlPool.query("CALL cancerogenic_risk(?, ?);", [
    objectId,
    year,
  ]);
  return rows[0];
};

module.exports.getCrSum = async (objectId, year) => {
  const [rows] = await mysqlPool.query(
    "SELECT sum_of_cr_func(?, ?) AS cr_sum;",
    [objectId, year]
  );
  return rows[0].cr_sum;
};

module.exports.getPcr = async (objectId, year) => {
  const [rows] = await mysqlPool.query("CALL get_pcr(?, ?);", [objectId, year]);
  return rows[0][0].pcr;
};
