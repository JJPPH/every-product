const { body, query, param, validationResult } = require('express-validator')
const mongoose = require('mongoose')

const usernameValidation = body('username').notEmpty().withMessage('username은 필수 항목입니다.')

const emailValidation = body('email').isEmail().withMessage('유효한 이메일 주소를 입력해주세요.')

const birthdayValidation = body('birthday').isDate().withMessage('올바른 날짜 형식을 입력해주세요.')

const passwordValidation = body('password')
  .isLength({ min: 6 })
  .withMessage('비밀번호는 최소 6자 이상이어야 합니다.')
  .matches(/\d/)
  .withMessage('비밀번호에는 최소한 하나의 숫자가 포함되어야 합니다.')

const createPasswordMatchValidation = (passwordWord = 'password', passwordConfirmationWord = 'passwordConfirmation') => {
  return body(passwordConfirmationWord).custom((value, { req }) => {
    if (value !== req.body[passwordWord]) {
      throw new Error('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
    }
    return true
  })
}

const isManagerValidation = body('isManager').custom((value) => {
  if (!(value === 'false' || value === 'true')) {
    throw new Error('유효하지 않은 형식의 사용자 정보입니다.')
  }
  return true
})

const recipientNameValidation = body('recipientName').notEmpty().withMessage('수신자 이름을 입력해주세요.')

const messageContentValidation = body('content').notEmpty().withMessage('내용을 입력해주세요.')

const coordinateValidation = [
  query('swLat').exists().withMessage('swLat은 필수 항목입니다.').isNumeric().withMessage('swLat은 숫자여야 합니다.'),
  query('swLng').exists().withMessage('swLng은 필수 항목입니다.').isNumeric().withMessage('swLng은 숫자여야 합니다.'),
  query('neLat').exists().withMessage('neLat은 필수 항목입니다.').isNumeric().withMessage('neLat은 숫자여야 합니다.'),
  query('neLng').exists().withMessage('neLng은 필수 항목입니다.').isNumeric().withMessage('neLng은 숫자여야 합니다.'),
]

const storeIdValidation = param('storeId')
  .notEmpty()
  .withMessage('storeId는 필수입니다.')
  .isAlphanumeric()
  .withMessage('storeId는 알파벳과 숫자로만 이루어져야 합니다.')
  .custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('잘못된 형식의 id입니다.')
    }
    return true
  })

const storeValidation = [
  body('storeName').notEmpty().withMessage('storeName은 필수 항목입니다.'),
  body('category').notEmpty().withMessage('category는 필수 항목입니다.'),
  body('phone').notEmpty().withMessage('phone은 필수 항목입니다.'),
  body('brand').notEmpty().withMessage('brand는 필수 항목입니다.'),
  body('postCode').notEmpty().withMessage('postCode는 필수 항목입니다.'),
  body('roadAddress').notEmpty().withMessage('roadAddress는 필수 항목입니다.'),
  body('jibunAddress').notEmpty().withMessage('jibunAddress는 필수 항목입니다.'),
  body('detailAddress').notEmpty().withMessage('detailAddress는 필수 항목입니다.'),
  body('extraAddress').notEmpty().withMessage('extraAddress는 필수 항목입니다.'),
  body('lat').notEmpty().withMessage('lat은 필수 항목입니다.').isNumeric().withMessage('lat은 숫자여야 합니다.'),
  body('lng').notEmpty().withMessage('lng은 필수 항목입니다.').isNumeric().withMessage('lng은 숫자여야 합니다.'),
]

const productIdValidation = param('productId')
  .notEmpty()
  .withMessage('productId는 필수입니다.')
  .isAlphanumeric()
  .withMessage('productId는 알파벳과 숫자로만 이루어져야 합니다.')
  .custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('잘못된 형식의 id입니다.')
    }
    return true
  })

const productValidation = [
  body('name').notEmpty().withMessage('name은 필수 항목입니다.'),
  body('price').notEmpty().withMessage('price는 필수 항목입니다.').isInt({ min: 0 }).withMessage('price는 양의 정수여야 합니다.'),
  body('description').notEmpty().withMessage('description은 필수 항목입니다.'),
  body('total').notEmpty().withMessage('total은 필수 항목입니다.').isInt({ min: 0 }).withMessage('total은 양의 정수여야 합니다.'),
]

const presignedUrlValidation = [
  body('foldername').notEmpty().withMessage('foldername 필수 항목입니다.'),
  body('imageType').notEmpty().withMessage('imageType 필수 항목입니다.'),
]

const validate = (req, res, next) => {
  const validationErrors = validationResult(req)
  if (validationErrors.isEmpty()) {
    return next()
  }
  return res.status(400).json({ msg: validationErrors.array()[0].msg })
}

module.exports = {
  usernameValidation,
  emailValidation,
  birthdayValidation,
  passwordValidation,
  createPasswordMatchValidation,
  isManagerValidation,
  recipientNameValidation,
  messageContentValidation,
  coordinateValidation,
  storeIdValidation,
  storeValidation,
  productIdValidation,
  productValidation,
  presignedUrlValidation,
  validate,
}
