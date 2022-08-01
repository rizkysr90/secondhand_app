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
            validator.confirm_email(),
            validate,
            controller.confirm_email
)

router.get('/resend-email',
            validator.resendEmail(),
            validate,
            controller.resendEmail
)
    
module.exports = router;