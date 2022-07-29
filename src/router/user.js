const express = require('express')
const router = express.Router()
const controllerUser = require('../controller/controller.user')


router.get('/', controllerUser.dataUserAll);

module.exports = router