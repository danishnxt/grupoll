const mgs = require('mongoose')
Schema = mgs.Schema

const mCategory = new Schema ({
  _id: ObjectId,
  name: String
})

module.exports = mgs.model('mCategory', mCategory)
