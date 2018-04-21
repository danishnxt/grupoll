const mgs = require('mongoose')
Schema = mgs.Schema

const mQuesParam = new Schema ({
  question_id: ObjectId,
  age_rangeSt: Int64,
  age_rangeEnd: Int64,
  gender: Int32,
  locality: Int32
})

module.exports = mgs.model('mQuesParam', mQuesParam)
