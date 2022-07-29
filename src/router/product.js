const express = require('express')
const router = express.Router()
const controllerProduc = require('../controller/controller.product')
const productBuyerSanitize = require('../middleware/sanitize/productBuyer.sanitize');
const productBuyerValidator = require('../middleware/validator/productBuyer.validator')
const validate = require('./../middleware/expressValidator');
const authJWT = require('./../middleware/passport-jwt');
router.get('/', controllerProduc.getProductAll)
router.get('/onProcess/:product_id',
            authJWT,
            productBuyerSanitize.onProcess(),
            productBuyerValidator.onProcess(),
            validate,
            controllerProduc.onProcess
            )
router.get('/:id', controllerProduc.getProducById)


module.exports = router