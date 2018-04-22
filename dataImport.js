const mongoose = require('mongoose');
const types = mongoose.Types // using this to generate objectID's

const mUser = require('./models/user')
const mQuestion = require('./models/question')
const mVote = require('./models/vote')
const mVoteWeight = require('./models/voteWeight')
const mFriend = require('./models/friend')
const mCategory = require('./models/category')
const mComment = require('./models/comment')
const mQuesParam = require('./models/questionParam')
const mUserQues = require('./models/userQuestion')
const mAnswer = require('./models/answer')

const log = require('./server_logger');

const uri = "mongodb+srv://danishnxt:qwertyuiop123098@nxtcluster1-hy2py.mongodb.net/grupoll_DB";
mongoose.connect(uri)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// pushes =====================================================================================================================

const pushUser = (uName, uemail, fName, lName, cntry, gndr, hash) => new Promise((resolve, reject) => {

  const newUser = new mUser({username: uName, email: uemail, first_name: fName, last_name: lName, country: cntry, gender: gndr, passwordHash: hash, question_cnt: 0})

  newUser.save((err, obj) => {
    if(err) {
      log.logDatabaseError(err);
      reject(err)
    } else {
      log.logDatabaseEntry("New User Record Added.")
      resolve(obj)
    }
  });
})

const pushQuestion = (userID, questionStatement, questionType, containsImage, containsVoice, imageLink, voiceLink, postTime, categoryID, answerTimeLimit, userSeen) => new Promise((resolve, reject) => {

  const newQuestion = new mQuestion({

    question_type : questionType,
    statement : questionStatement,
    user_id : types.ObjectId(userID),
    contains_image : containsImage,
    contains_voice : containsVoice,
    imae_link : imageLink,
    voice_link : voiceLink,
    post_time : postTime,
    category_id : types.ObjectId(categoryID),
    answer_time_lim : answerTimeLimit,
    user_seen : userSeen
  });

  newQuestion.save((err, obj) => {
    if (err) {log.logDatabaseError(err);
      reject(err)
    } else {
      log.logDatabaseEntry("New Question Record Added.");
      resolve(obj)
    }
  });
})



const pushCategory = (cname) => new Promise((resolve, reject) => {

  const newCategory = new mCategory({
    name: cname
  })

  newCategory.save((err, obj) => {
    if (err) {log.logDatabaseError(err);
      reject(err)
    } else {
      log.logDatabaseEntry("New Category Added")
      resolve(obj)
    }
  })
})

const pushFriend = (fr1ID, fr2ID) => new Promise ((resolve, reject) => {

  const newFriend = new mFriend({
    user1_id: types.ObjectId(fr1ID),
    user2_id: types.ObjectId(fr2ID)
  })

  newFriend.save((err, obj) => {
    if (err) {
      log.logDatabaseError(err);
      reject(err)
    } else {
      log.logDatabaseEntry("New Friends Made!")
      resolve(obj)
    }
  })
})

const pushVote = (uID, qID, vValue) => new Promise((resolve, reject) => {

  const newVote = new mVote({
    question_id: types.ObjectId(uID),
    user_id: types.ObjectId(qID),
    value: vValue
  })

  newVote.save((err, obj) => {
    if (err) {
      log.logDatabaseError(err);
      reject(err)
    } else {
      log.logDatabaseEntry("New Vote registered!")
      resolve(obj)
    }
  })
})

// full pulls ===================================================================================================================

// to do -> requires the database logging? We're only querying here, do we actually need anything?

const pullUser = (objID) => new Promise ((resolve,reject) => {
  mUser.findOne({ _id: types.ObjectId(objID) }, (err, res) => {if (!err) {resolve(res)} else {reject(err)}});
})

const pullQuestion = (objID) => new Promise ((resolve, reject) => {
  mQuestion.findOne({ _id: types.ObjectId(objID) }, (err, res) => {if (!err) {resolve(res)} else {reject(err)}});
})

const pullAnswers = (questionID) => new Promise ((resolve, reject) => {
  mAnswer.findOne({question_id: types.ObjectId(questionID) }, (err, res) => {if (!err) {resolve(res)} else {reject(err)}});
})

// queries =========================================================================================================================

  // TO TIRMAZI ->> CAN WE DO THIS ANY BETTER? //

const pullFriends = (userID) => new Promise ((resolve, reject) => {

  fwd = []
  bck = []
  cnt = 2

  mFriend.find({user1_id:types.ObjectId(userID)}, 'user2_id', (err,res) => {
    if (err) {
      reject(err)
    } else {
      console.log("query1 came back")
      fwd = res
      cnt = cnt - 1
      if(!cnt){resolve(fwd.concat(back))}
    }
  })

  mFriend.find({user2_id:types.ObjectId(userID)}, 'user1_id', (err,res) => {
    if (err) {
      reject(err)
    } else {
      console.log("query2 came back")
      bck = res
      cnt = cnt - 1
      if(!cnt){resolve(fwd.concat(bck))}
    }
  })

})

// pull comments -> per question basis
const pullComments = (questionID) => new Promise ((resolve, reject) => {
  mComment.find({question_id:types.ObjectId(questionID)},'user_id statement post_time', (err, res) => {
    if (err){
      reject(err)
    } else {
      console.log(res)
      resolve(res)
    }
  })
})

// pull votes for a question ->
const pullVotes = (questionID) => new Promise ((resolve, reject) => {
  mVote.find({question_id : types.ObjectId(questionID)},'user_id value', (err,res) => {
    if (err){
      reject(err)
    } else {
      console.log(res)
      resolve(res)
    }
  })
})

// pull users that match questionParameters
const pullParamUsers = (questionID) => {
  // belay this order for the time being
}

const pullByGender = (gVal) => new Promise((resolve, reject) => {
  mUser.find({gender:gVal},'_id', (err,res) => {
    if(err){
      reject(err)
    } else {
      resolve(res)
    }
  })
})

// Module Exports ==================================================================================================================
module.exports = {pullParamUsers, pullVotes, pullComments, pullFriends, pullAnswers, pullQuestion, pullUser, pushVote, pushFriend, pushCategory, pushQuestion, pushUser}

// pullFriends("5adb32fce1144d2c68430c95").then(data => {
//   console.log("list acquired")
//   console.log(data)
//   mongoose.connection.close()
// })
// console.log("request sent")
