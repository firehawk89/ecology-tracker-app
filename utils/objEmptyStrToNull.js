const objEmptyStrToNull = (object) => {
  const result = JSON.parse(JSON.stringify(object), (key, value) => {
    return value === "" ? null : value;
  });

  return result;
};

module.exports = objEmptyStrToNull;
