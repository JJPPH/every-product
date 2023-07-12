const express = require('express')

const controller = require('../controllers/store.controller')

const { coordinateValidation, storeIdValidation, validate } = require('../validator/validator')

const router = express.Router()

router.get('/store-location', coordinateValidation, validate, controller.getStoreLocation)
router.get('/search', controller.getStoreSearch)
router.get('/:storeId', storeIdValidation, validate, controller.getStoreInfo)

module.exports = router
