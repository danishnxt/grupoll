const mgs = require('mongoose')
Schema = mgs.Schema

const mUser = new Schema({
  username: {type: String},
  email: {type: String},
  first_name: {type: String},
  last_name: {type: String},
  country: {type: String},
  gender: {type: Number},
  password_hash: {type: String},
  question_cnt: {type: Number}
})

module.exports = mgs.model('mUser', mUser)

