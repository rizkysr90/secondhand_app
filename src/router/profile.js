const express = require('express');
const router = express.Router();

const controller = require('./../controller/controller.user');
const authJWT = require('./../middleware/passport-jwt');
const validate = require('./../middleware/expressValidator');
const userValidator = require('./../middleware/validator/user.validator');
const userSanitize = require('./../middleware/sanitize/user.sanitize');
const {upload,MulterError} = require('./../middleware/multer');

router.get('/:user_id',authJWT,controller.getProfileById);
router.put('/:user_id',authJWT,upload.single('profile_picture'),
            MulterError,userSanitize.update(),userValidator.update(),
            validate,controller.updateProfile);

module.exports = router;