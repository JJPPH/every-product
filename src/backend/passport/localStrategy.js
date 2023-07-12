const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const argon2 = require('argon2')

const User = require('../schemas/user.schema')

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false,
      },
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ email })
          if (exUser) {
            const result = await argon2.verify(exUser.password, password)
            if (result) {
              done(null, exUser)
            } else {
              done(null, false, { message: '사용자 정보가 잘못되었습니다.' })
            }
          } else {
            done(null, false, { message: '가입되지 않은 회원입니다.' })
          }
        } catch (error) {
          done(error)
        }
      }
    )
  )
}
