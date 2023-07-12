exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.status(401).json({
      message: '로그인이 필요합니다.',
    })
  }
}

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next()
  } else {
    res.status(403).json({
      message: '잘못된 접근입니다.',
    })
  }
}

exports.isManager = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isManager) {
    next()
  } else {
    res.status(403).json({
      message: '권한이 없습니다.',
    })
  }
}
