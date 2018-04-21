const mgs = require('mongoose')
Schema = mgs.Schema

const mQuesParam = new Schema ({
  question_id: {type: Schema.ObjectId, ref: 'mQuestion'},
  age_rangeSt: Number,
  age_rangeEnd: Number,
  gender: Number,
  locality: Number
})

module.exports = mgs.model('mQuesParam', mQuesParam)
