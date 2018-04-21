const mgs = require('mongoose')
Schema = mgs.Schema

const mComment = new Schema ({
  question_id: {type: Schema.ObjectId, ref: 'mQuestion'},
  user_id: {type: Schema.ObjectId, ref: 'mUser'},
  statement: String,
  post_time: Date
})

module.exports = mgs.model('mComment', mComment)
