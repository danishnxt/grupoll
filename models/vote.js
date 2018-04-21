const mgs = require('mongoose')
Schema = mgs.Schema


const mVote = new Schema ({
  question_id: {type: Schema.ObjectId, ref: 'mQuestion'},
  user_id: {type: Schema.ObjectId, ref: 'mUser'},
  value: Number
})

module.exports = mgs.model('mVote', mVote)
