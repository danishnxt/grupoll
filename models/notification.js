const mgs = require('mongoose')
Schema = mgs.Schema

const mNotification = new Schema ({
  notif_user_id: {type: Schema.ObjectId, ref: 'mUser'},
  notif_type: {type:Number},
  notif_content: {type:String},
  notif_question_id: {type: Schema.ObjectId, ref: 'mQuestion'},
  notif_time: {type: Number},
  notif_seen: {type: Boolean}
})

module.exports = mgs.model('mNotification', mNotification)
