const express = require('express');
const router = express.Router();
const controllerCategory = require('../controller/controller.categories');
const { upload, MulterError } = require('../middleware/multer');
const categoriesValidator = require('../middleware/validator/categories.validator');
const validate = require('../middleware/expressValidator');
const authJWT = require('./../middleware/passport-jwt');

router.get('/', controllerCategory.getAllCategory);
router.get('/:id', controllerCategory.getCategoryById);
router.post(
  '/',
  authJWT,
  upload.single('image'),
  MulterError,
  categoriesValidator.create(),
  validate,
  controllerCategory.createCategory
);

router.put(
  '/:id',
  authJWT,
  upload.single('image'),
  MulterError,

  categoriesValidator.create(),
  validate,
  controllerCategory.updateCategory
);

router.delete('/:id', authJWT, controllerCategory.deleteCategoryById);

module.exports = router;
