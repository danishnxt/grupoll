const mgs = require('mongoose')
Schema = mgs.Schema

const mCategory = new Schema ({
  name: String
})

module.exports = mgs.model('mCategory', mCategory)
