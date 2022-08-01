const express = require('express');
const router = express.Router();
const routerRegister = require('./register');
const routerLogin = require('./login');
const routerProfile = require('./profile');
const routermyProduct = require('./myproducts')
const routerCity = require('./city');
const routerProduct = require('./product')
const routerCategories = require('./categories');
const routerOrderBuyer = require('./order_buyer')
const routerOrderSeller =require('./orderSeller');
const routerNotifications = require('./notifikasi')

router.use(`/emailconfirmed`,(req,res) => {
    res.send('email was confirmed')
})
router.use('/invalid',(req,res) => {
    res.send('invalid proccess')
})
router.use(`${process.env.URL_ROUTER_REGISTER}`,routerRegister)
router.use(`${process.env.URL_ROUTER_LOGIN}`,routerLogin)
router.use(`${process.env.URL_ROUTER_PROFILE}`,routerProfile)
router.use(`${process.env.URL_ROUTER_MYPRODUCT}`, routermyProduct)
router.use(`${process.env.URL_ROUTER_CITY}`,routerCity)
router.use(`${process.env.URL_ROUTER_PRODUCT}`, routerProduct)
router.use(`${process.env.URL_ROUTER_CATEGORIES}`, routerCategories);
router.use(`${process.env.URL_ROUTER_ORDER_BUYER}`, routerOrderBuyer)
router.use(`${process.env.URL_ROUTER_ORDER_SELLER}`, routerOrderSeller);
router.use(`${process.env.URL_ROUTER_NOTIFICATION}`, routerNotifications)


router.all('*',(req,res) => {
    res.status(404).json({message :"Sorry, page not found"});
});

module.exports = router;
