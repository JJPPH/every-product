/* eslint-disable no-await-in-loop */
const passport = require('passport')
const argon2 = require('argon2')
// eslint-disable-next-line import/no-extraneous-dependencies
const { DeleteObjectCommand } = require('@aws-sdk/client-s3')
const s3Client = require('../aws')
require('dotenv').config()

const User = require('../schemas/user.schema')
const Store = require('../schemas/store.schema')
const Product = require('../schemas/product.schema')

exports.login = async (req, res, next) => {
  try {
    passport.authenticate('local', (authError, user, info) => {
      if (authError) {
        return res.status(500).json({ msg: '인증 에러가 발생했습니다.' })
      }
      if (!user) {
        return res.status(401).json({ msg: info.message })
      }
      return req.login(user, (loginError) => {
        if (loginError) {
          return res.status(500).json({ msg: '로그인 에러가 발생했습니다.' })
        }
        return res.json({ msg: '로그인이 완료되었습니다.' })
      })
    })(req, res, next)
  } catch (error) {
    next(error)
  }
}

exports.register = async (req, res, next) => {
  const { username, birthday, email, password, isManager } = req.body
  try {
    const isUserWithEmailExists = await User.findOne({ email })
    if (isUserWithEmailExists) {
      return res.status(409).json({ msg: '이미 등록된 이메일입니다.' })
    }

    const isUserWithUsernameExists = await User.findOne({ username })
    if (isUserWithUsernameExists) {
      return res.status(409).json({ msg: '이미 등록된 유저네임입니다.' })
    }

    const isManagerBoolean = isManager === 'true'
    const hashedPassword = await argon2.hash(password)
    await User.create({ username, birthday, email, password: hashedPassword, isManager: isManagerBoolean })

    return res.json({ msg: '회원가입이 완료되었습니다.' })
  } catch (error) {
    return next(error)
  }
}

exports.logout = async (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) {
        throw err
      } else {
        res.json({ msg: '로그아웃되었습니다.' })
      }
    })
  } catch (error) {
    next(error)
  }
}

exports.getMyInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)

    return res.json({ username: user.username, birthday: user.birthday, email: user.email })
  } catch (error) {
    return next(error)
  }
}

exports.editMyInfo = async (req, res, next) => {
  try {
    const { username, email, birthday } = req.body

    const isUserWithEmailExists = await User.findOne({ email })
    if (isUserWithEmailExists) {
      return res.status(409).json({ msg: '이미 등록된 이메일입니다.' })
    }

    const isUserWithUsernameExists = await User.findOne({ username })
    if (isUserWithUsernameExists) {
      return res.status(409).json({ msg: '이미 등록된 유저네임입니다.' })
    }

    await User.findByIdAndUpdate(req.user._id, { username, email, birthday })

    return res.json({ msg: '나의 정보가 수정되었습니다.' })
  } catch (error) {
    return next(error)
  }
}

exports.editPassword = async (req, res, next) => {
  try {
    const { password, newPassword } = req.body

    const user = await User.findById(req.user._id)

    const isValidPassword = await argon2.verify(user.password, password)
    if (!isValidPassword) {
      return res.status(401).json({ msg: '비밀번호가 맞지 않습니다.' })
    }

    const hashedPassword = await argon2.hash(newPassword)
    await User.findByIdAndUpdate(req.user._id, { password: hashedPassword })
    return res.json({ msg: '비밀번호가 수정되었습니다.' })
  } catch (error) {
    return next(error)
  }
}

exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id)

    const stores = await Store.find({ administratorId: req.user._id })

    // eslint-disable-next-line no-restricted-syntax
    for (const store of stores) {
      await Store.findByIdAndDelete(store._id)
      let inputCommand = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: store.image.key,
      }
      let command = new DeleteObjectCommand(inputCommand)
      await s3Client.send(command)

      const deletedProducts = await Product.find({ storeId: store._id })

      // eslint-disable-next-line no-restricted-syntax
      for (const product of deletedProducts) {
        inputCommand = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: product.image.key,
        }
        command = new DeleteObjectCommand(inputCommand)
        await s3Client.send(command)
      }
    }

    req.logout(async (err) => {
      if (err) {
        throw err
      } else {
        res.json({ msg: '계정이 삭제되었습니다.' })
      }
    })
  } catch (error) {
    next(error)
  }
}
