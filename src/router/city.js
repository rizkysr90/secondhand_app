const router = require('express').Router();
const cityController = require('./../controller/controller.city');
const authJWT = require('./../middleware/passport-jwt');

router.get('/',authJWT,cityController.getAllDataCities);



module.exports = router;