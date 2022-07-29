const express = require('express')
const router = express.Router()
const controllerProduct = require('../controller/controller.myproducts')
const {upload,MulterError} = require('../middleware/multer')
const myproductsValidator = require('../middleware/validator/myProducts.validator')
const validate = require('../middleware/expressValidator')
const myproductsSanitize = require('./../middleware/sanitize/myproduct.sanitize');
const sanitationMyProducs = require('../middleware/validator/myProduct.sanitation')
const authJWT = require('./../middleware/passport-jwt');

router.get('/', authJWT, controllerProduct.dataProductAll)
router.get('/:id', authJWT, 
        myproductsSanitize.getById(),
        myproductsValidator.getById(),
        validate,
        controllerProduct.dataProductById)
router.post('/', authJWT,upload.array('gambar'), MulterError,sanitationMyProducs.sanitationDataMyProduct, myproductsValidator.create(), validate, controllerProduct.createDataProduct)
router.put('/:id', authJWT,upload.array('gambar'), MulterError,sanitationMyProducs.sanitationDataMyProduct, myproductsValidator.create(), validate, controllerProduct.updateDataProduct)
router.delete('/:id', authJWT,controllerProduct.deleteDataProductById)

module.exports = router


