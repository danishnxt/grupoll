const mgs = require('mongoose')
Schema = mgs.Schema

const mUserQues = new Schema ({
  question_id: {type: Schema.ObjectId, ref: 'mQuestion'},
  user_id: {type: Schema.ObjectId, ref: 'mUser'},
  notify: Boolean
})

module.exports = mgs.model('mUserQues', mUserQues)
