const express = require('express')

const { isManager } = require('../middlewares/authentication.middleware')
const {
  storeIdValidation,
  storeValidation,
  productIdValidation,
  productValidation,
  presignedUrlValidation,
  validate,
} = require('../validator/validator')

const controller = require('../controllers/manager.controller')

const router = express.Router()

router.post('/presigned-url-image', presignedUrlValidation, validate, controller.createPresignedUrl)
router.post('/create-store', isManager, storeValidation, validate, controller.createStore)
router.get('/management', isManager, controller.getAllStoresManagement)
router.delete('/:storeId', isManager, storeIdValidation, validate, controller.deleteStore)
router.post('/:storeId/create-product', isManager, storeIdValidation, validate, controller.createProduct)
router.get('/:storeId/product/:productId', isManager, storeIdValidation, productIdValidation, validate, controller.getProduct)
router.patch('/:storeId/product/:productId', isManager, storeIdValidation, productIdValidation, productValidation, validate, controller.editProduct)
router.delete('/:storeId/product/:productId', isManager, storeIdValidation, productIdValidation, validate, controller.deleteProduct)

module.exports = router
