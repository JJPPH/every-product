const path = require('path')
const morgan = require('morgan')
const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const dotenv = require('dotenv')
const nunjucks = require('nunjucks')
const redis = require('redis')
const RedisStore = require('connect-redis').default
const helmet = require('helmet')
const hpp = require('hpp')

const mongodbConnect = require('./schemas/index')

const passportConfig = require('./passport/index')

const managerRouter = require('./routers/manager.router')
const authRouter = require('./routers/auth.router')
const storeRouter = require('./routers/store.router')
const messageRouter = require('./routers/message.router')

dotenv.config()
const { PORT, NODE_ENV, COOKIE_SECRET } = process.env
const app = express()

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  password: process.env.REDIS_PASSWORD,
})

passportConfig()
app.set('view engine', 'html')
nunjucks.configure(path.join(__dirname, '..', 'frontend'), {
  express: app,
  watch: true,
})
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '..', 'frontend', 'public')))
app.use(cookieParser(COOKIE_SECRET))
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      name: 'UID',
      maxAge: 60 * 60 * 1000,
    },
    store: new RedisStore({ client: redisClient, prefix: 'session:' }),
  })
)
app.use(passport.initialize())
app.use(passport.session())

if (NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}
app.use(hpp())
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
)

app.use((req, res, next) => {
  if (req.user) {
    res.locals.isManager = req.user.isManager
    res.locals.isLoggedIn = true
    next()
  } else {
    res.locals.isLoggedIn = false
    next()
  }
})

app.get('/', (req, res) => {
  res.render('index')
})

app.use('/manager', managerRouter)
app.use('/auth', authRouter)
app.use('/store', storeRouter)
app.use('/message', messageRouter)

app.use((req, res, next) => {
  res.status(404)
  const error = new Error()
  next(error)
})

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (res.statusCode === 404) {
    res.status(404).json({ msg: '존재하지 않는 리소스입니다.' })
  } else {
    res.status(500).json('서버 상의 에러가 발생했습니다.')
  }
})

mongodbConnect()
redisClient.connect().then(() => {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log('서버 연결')
  })
})
