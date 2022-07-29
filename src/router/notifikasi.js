const express = require('express')
const router = express.Router()
const controllerNotifikasi = require('../controller/controller.notifications')
const authJWT = require('./../middleware/passport-jwt');

router.get('/',authJWT, controllerNotifikasi.getNotifikasiAll)
router.patch('/:id',authJWT, controllerNotifikasi.getbyIdNotifikasi)

module.exports = router

