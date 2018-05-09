const mgs = require('mongoose')
Schema = mgs.Schema

const mComment = new Schema ({
  question_id: {type: Schema.ObjectId, ref: 'mQuestion'},
  user_id: {type: Schema.ObjectId, ref: 'mUser'},
  statement: {type:String},
  post_time: {type:Date}
})

module.exports = mgs.model('mComment', mComment)
