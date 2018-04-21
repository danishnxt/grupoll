const mgs = require('mongoose')
Schema = mgs.Schema

const mVoteWeight = new Schema ({
  user_id: {type: Schema.ObjectId, ref: 'mUser'},
  category_id: {type: Schema.ObjectId, ref: 'mCategory'},
  weight: Number
})

module.exports = mgs.model('mVoteWeight', mVoteWeight)
