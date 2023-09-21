const mysqlPool = require("../config/db");

module.exports.getAll = async () => {
  const [rows] = await mysqlPool.query("SELECT * FROM object");
  return rows;
};

module.exports.insertMany = async (rows) => {
  await mysqlPool.query(
    "INSERT INTO object (object_name, activity, ownership_form, address) VALUES ?",
    [rows]
  );
};
