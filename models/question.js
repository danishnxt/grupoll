const mgs = require('mongoose')
Schema = mgs.Schema

const mQuestion = new Schema ({
  question_type: Bool,
  statement: String,
  user_id: ObjectId,
  contains_image: Bool,
  contains_voice: Bool,
  image_link: String,
  voice_link: String,
  post_time: Timestamp,
  category_id: ObjectId,
  answerTimeLim: Timestamp,
  user_seen: Bool
})

module.exports = mgs.model('mQuestion', mQuestion)
