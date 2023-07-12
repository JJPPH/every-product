const express = require('express')

const { isLoggedIn, isNotLoggedIn } = require('../middlewares/authentication.middleware')
const {
  usernameValidation,
  emailValidation,
  birthdayValidation,
  passwordValidation,
  createPasswordMatchValidation,
  isManagerValidation,
  validate,
} = require('../validator/validator')

const passwordMatchValidation = createPasswordMatchValidation()
const newPasswordMatchValidation = createPasswordMatchValidation('newPassword', 'newPasswordConfirmation')

const controller = require('../controllers/auth.controller')

const router = express.Router()

router.post('/login', isNotLoggedIn, emailValidation, passwordValidation, validate, controller.login)
router.post(
  '/register',
  isNotLoggedIn,
  usernameValidation,
  emailValidation,
  birthdayValidation,
  passwordValidation,
  passwordMatchValidation,
  isManagerValidation,
  validate,
  controller.register
)

router.get('/my-info', isLoggedIn, controller.getMyInfo)
router.patch('/edit-my-info', isLoggedIn, emailValidation, birthdayValidation, validate, controller.editMyInfo)
router.patch('/edit-password', isLoggedIn, passwordValidation, newPasswordMatchValidation, validate, controller.editPassword)

router.post('/logout', isLoggedIn, controller.logout)
router.delete('/delete-account', isLoggedIn, controller.deleteAccount)

module.exports = router
