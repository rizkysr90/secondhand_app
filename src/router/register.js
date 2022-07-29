const express = require('express');
const router = express.Router();
const controllerUser = require('../controller/controller.user');
const validate = require('./../middleware/expressValidator');
const userValidator = require('./../middleware/validator/user.validator');
const userSanitize = require('./../middleware/sanitize/user.sanitize');
router.post('/',userSanitize.create(),userValidator.create(),validate,controllerUser.createUser);

module.exports = router;