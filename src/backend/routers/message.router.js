const express = require('express')

const controller = require('../controllers/message.controller')

const { isLoggedIn } = require('../middlewares/authentication.middleware')
const { recipientNameValidation, messageContentValidation, validate } = require('../validator/validator')

const router = express.Router()

router.post('/send-message', isLoggedIn, recipientNameValidation, messageContentValidation, validate, controller.sendMessage)
router.get('/sent-messages', controller.getSentMessages)
router.get('/received-messages', controller.getReceivedMessages)

module.exports = router
