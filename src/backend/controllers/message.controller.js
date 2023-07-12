const User = require('../schemas/user.schema')
const Message = require('../schemas/message.schema')

exports.sendMessage = async (req, res, next) => {
  try {
    const { recipientName, content } = req.body

    const recipient = await User.findOne({ username: recipientName })

    if (!recipient) {
      return res.status(404).json({ msg: '존재하지 않는 회원입니다.' })
    }

    await Message.create({
      senderId: req.user._id,
      senderName: req.user.username,
      recipientId: recipient._id,
      recipientName: recipient.username,
      content,
    })

    return res.json({ msg: '메세지를 보냈습니다.' })
  } catch (error) {
    return next(error)
  }
}

exports.getSentMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ senderId: req.user._id }).sort({ createdAt: -1 }).limit(10)

    return res.json({ messages, msg: '보낸 메세지를 조회하였습니다.' })
  } catch (error) {
    return next(error)
  }
}

exports.getReceivedMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ recipientId: req.user._id }).sort({ createdAt: -1 }).limit(10)

    return res.json({ messages, msg: '받은 메세지를 조회하였습니다.' })
  } catch (error) {
    return next(error)
  }
}
