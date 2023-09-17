const { body, param, query, sanitize } = require("express-validator");
const create = () => {
  return [
    sanitize(["email", "password", "username", "confirm_password"]).trim(),
  ];
};
const update = () => {
  return [
    body("city_id").toInt(),
    body(["name", "address"]).trim(),
    param("username").toLowerCase(),
  ];
};

module.exports = {
  create,
  update,
};
