const mysqlPool = require("../config/db");

module.exports.getAll = async (
  objectId,
  year,
  child_age,
  damage_area,
  q,
  dead_fish
) => {
  const [rows] = await mysqlPool.query("CALL victims(?, ?, ?, ?, ?, ?);", [
    objectId,
    year,
    child_age,
    damage_area,
    q,
    dead_fish,
  ]);
  return rows[0];
};
