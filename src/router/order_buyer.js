const router = require('express').Router();
const orderBuyerController = require('./../controller/controller.orderBuyer');
const authJWT = require('./../middleware/passport-jwt');
const orderBuyerSanitasi = require('./../middleware/sanitize/orderBuyer.sanitize');
const validate =require('./../middleware/expressValidator');
const orderBuyerValidator = require('./../middleware/validator/orderBuyer.validator')
router.route(`${process.env.URL_ROUTER_ORDER}`)
    .post(authJWT,
        orderBuyerSanitasi.create(),
        orderBuyerValidator.create(),
        validate,
        orderBuyerController.createOrder
    )

router.route(`${process.env.URL_ROUTER_ORDER}/:order_id`)
    .get(authJWT,
        orderBuyerSanitasi.getById(),
        orderBuyerValidator.getById(),
        validate,
        orderBuyerController.getOrderById    
    )
// router.route(`${process.env.URL_ROUTER_ORDER}/:product_id`)
//     .get(
//         orderBuyerController.getOrderByProductId    
//     )
router.route('/')
    .get(authJWT,
        orderBuyerSanitasi.getAll(),
        orderBuyerValidator.getAll(),
        validate,
        orderBuyerController.getAllOrder
    )

module.exports = router;
