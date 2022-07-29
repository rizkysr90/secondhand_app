const { body, param, query } = require('express-validator');

const update = () => {
  return [
    body('status','status tidak boleh kosong').notEmpty(),
    body('status','status harus integer dan minimal 0,maksimal 1').isInt({
      min:0,max:1
    })
  ];
};
const verifyOrder = () => {
  return [
    body('is_done','is_done tidak boleh kosong').notEmpty(),
    body('is_done','is_done harus integer dan minimal 0,maksimal 1').isInt({
      min:0,max:1
    })
  ];
};


module.exports = {
    update,
    verifyOrder
}