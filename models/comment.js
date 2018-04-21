const mgs = require('mongoose')
Schema = mgs.Schema

const mComment = new Schema ({
  question_id: ObjectId,
  user_id: ObjectId,
  statement: String,
  post_time: Timestamp
})

module.exports = mgs.model('mComment', mComment)
