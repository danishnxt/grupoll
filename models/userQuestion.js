const mgs = require('mongoose')
Schema = mgs.Schema

const mUserQues = new Schema ({
  question_id: ObjectId,
  user_id: ObjectId,
  notify: Bool
})

module.exports = mgs.model('mUserQues', mUserQues)
