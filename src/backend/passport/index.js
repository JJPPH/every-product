const passport = require('passport')

const localStrategy = require('./localStrategy')

const User = require('../schemas/user.schema')

const passportConfig = () => {
  passport.serializeUser((user, done) => {
    // eslint-disable-next-line no-underscore-dangle
    done(null, user._id)
  })

  passport.deserializeUser(async (_id, done) => {
    const user = await User.findById(_id)
    if (user) {
      done(null, user)
    } else {
      const error = new Error('로그인이 필요합니다.')
      done(error)
    }
  })

  localStrategy()
}

module.exports = passportConfig
