const express = require('express');
const router = express.Router();
const controller = require('../controller/controller.user');
const validate = require('./../middleware/expressValidator');
const validator = require('./../middleware/validator/user.validator');
const sanitize = require('./../middleware/sanitize/user.sanitize');

router.post('/',
            sanitize.create(),
            validator.create(),
            validate,
            controller.createUser);
router.get('/confirmation/:emailToken',
            controller.confirm_email
)
module.exports = router;