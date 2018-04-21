const mgs = require('mongoose')
Schema = mgs.Schema

const mAnswer = new Schema ({
  option_1: String,
  option_2: String,
  option_3: String,
  option1_Link: String,
  option2_Link: String,
  option3_Link: String
})

module.exports = mgs.model('mAnswer', mAnswer)
