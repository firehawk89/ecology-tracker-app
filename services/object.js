const mysqlPool = require("../config/db");

module.exports.getAll = async () => {
  const [rows] = await mysqlPool.query("SELECT * FROM object");
  return rows;
};

module.exports.insertOne = async (object) => {
  await mysqlPool.query(
    "INSERT INTO object (object_name, activity, ownership_form, address) VALUES (?, ?, ?, ?)",
    [object.name, object.activity, object.ownershipForm, object.address]
  );
};

module.exports.insertMany = async (rows) => {
  await mysqlPool.query(
    "INSERT INTO object (object_name, activity, ownership_form, address) VALUES ?",
    [rows]
  );
};

module.exports.deleteOneById = async (id) => {
  await mysqlPool.query("DELETE FROM object WHERE object_id = ?", [id]);
};
