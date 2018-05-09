const mgs = require('mongoose')
Schema = mgs.Schema

const mRequest = new Schema({
  request_user_id: {type: Schema.ObjectId, ref: 'mUser'},
  target_user_id: {type: Schema.ObjectId, ref: 'mUser'},
  status: {type: Number}
})

module.exports = mgs.model('mRequest', mRequest)
