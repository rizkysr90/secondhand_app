const router = require('express').Router();
const orderSellerController = require('./../controller/controller.orderSeller');
const authJWT = require('./../middleware/passport-jwt');
const orderSellerSanitize = require('./../middleware/sanitize/orderSeller.sanitize');
const validate = require('./../middleware/expressValidator');
const orderSellerValidator = require('./../middleware/validator/orderSeller.validator');
router.route('/')
    .get(
        authJWT,
        orderSellerSanitize.getAll(),
        orderSellerController.getAllOrder
    )
router.route('/orders/:order_id')
    .get(
        authJWT,
        orderSellerSanitize.getById(),
        orderSellerController.getByIdOrder
    )
    .put(
        authJWT,
        orderSellerSanitize.update(),
        orderSellerValidator.update(),
        validate,
        orderSellerController.updateOrder
    )
router.route('/verify/:order_id')
    .put(
        authJWT,
        orderSellerSanitize.verifyOrder(),
        orderSellerValidator.verifyOrder(),
        validate,
        orderSellerController.verifyOrder
    )



module.exports = router;