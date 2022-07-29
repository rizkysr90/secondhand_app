const { body, param, query } = require('express-validator');

const onProcess = () => {
  return [
    param('product_id','url product_id harus integer').isInt()
  ];
};



module.exports = {
    onProcess
}