const { body, param, query } = require('express-validator');

const create = () => {
  return [
    body('name', 'Nama Wajib Diisi').notEmpty(),
    body('isActive', 'IsActive Diterbitkan Wajib Diisi')
      .notEmpty()
      .toBoolean(),
  ];
};

const update = () => {
  return [
    body('name', 'Nama Wajib Diisi').notEmpty(),
    body('isActive', 'IsActive Diterbitkan Wajib Diisi')
      .notEmpty()
      .toBoolean(),
  ];
};

module.exports = {
  create,
  update,
};
