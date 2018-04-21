const mgs = require('mongoose')
Schema = mgs.Schema

const mFriend = new Schema ({
  user1_id: ObjectId
  user2_id: ObjectId
})

module.exports = mgs.model('mFriend', mFriend)
