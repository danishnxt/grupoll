const mgs = require('mongoose')
Schema = mgs.Schema


const mVote = new Schema ({
  question_id: ObjectId,
  user_id: ObjectId,
  value: Int64
})

module.exports = mgs.model('mVote', mVote)
