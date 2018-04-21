const mgs = require('mongoose')
Schema = mgs.Schema

const mVoteWeight = new Schema ({
  user_id: ObjectId,
  category_id: ObjectId,
  weight: Int64
})

module.exports = mgs.model('mVoteWeight', mVoteWeight)
