const mgs = require('mongoose')
Schema = mgs.Schema

const mFriend = new Schema ({
  user1_id: {type: Schema.ObjectId, ref: 'mUser'},
  user2_id: {type: Schema.ObjectId, ref: 'mUser'}
})

module.exports = mgs.model('mFriend', mFriend)
