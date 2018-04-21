const mgs = require('mongoose')
Schema = mgs.Schema

const mQuestion = new Schema ({
  question_type: Boolean,
  statement: String,
  user_id: {type: Schema.ObjectId, ref: 'mUser'},
  contains_image: Boolean,
  contains_voice: Boolean,
  image_link: String,
  voice_link: String,
  post_time: Date,
  category_id: {type: Schema.ObjectId, ref: 'mCategory'},
  answer_time_lim : Date,
  user_seen: Boolean
})

module.exports = mgs.model('mQuestion', mQuestion)
