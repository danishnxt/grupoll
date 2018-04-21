var async = require('async')
var mongoose = require('mongoose');

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

uri = "mongodb+srv://danishnxt:yjUJK13ocEdFgOOU@nxtcluster1-hy2py.mongodb.net/grupoll_DB";
mongoose.connect(uri)

var db = mongoose.connection;
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

const pushQuestion = (userID, questionStatement, questionType, containsImage, containsVoice, imageLink, voiceLink, postTime, category, answerTimeLimit, userSeen) => new Promise((resolve, reject) => {

  const newQuestion = new mQuestion({
    user_id : uID,
    question_type : questionType,
    statement : questionStatement,
    contains_image : containsImage,
    contains_voice : containsVoice,
    imae_link : imageLink,
    voice_link : voiceLink,
    post_time : postTime,
    category_id : cID,
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
    }
  })
})

const pushFriend = (frnd1, frnd2) => {

  const newFriend = new mFriend({
    user1_id: frnd1,
    user2_id: frnd2
  })

  newFriend.save(err => {
    if (err) {log.logDatabaseError(err);} else {
      log.logDatabaseEntry("New Friends Made!")
    }
  })

const pushVote = (uID, qID, value) => {

  const newVote = new mVote({
    question_id: uID,
    user_id: qID
    value:
  })
}



// full pulls ===================================================================================================================

const pullUser = (objID) => new Promise ((resolve,reject) => {
  mUser.findOne({ _id: objID }, function (err, res) {if (!err) {resolve(res)} else {reject()}});
})

const pullQuestion = (objID) => new Promise ((resolve, reject) => {
  mQuestion.findOne({ _id: objID }, function (err, res) {if (!err) {resolve(res)} else {reject()}});
})

const pullAnswers = (questionID) => new Promise ((resolve, reject) => {
  mAnswer.findOne({question_id: questionID}, function (err, res) { if (!err) {resolve (res)} else {reject()}});
})

// queries =========================================================================================================================

// pull friends of a user -> per user basis
const pullFriends = (userID) => {

  // two requests -> allowing for bi-directionality
  // q1 - user is left side

  // q2 - user is right side

}

// pull comments -> per question basis
const pullComments = (questionID) => {

}

// pull votes for a question ->
const pullVotes = (questionID) => {

}

// pull users that match questionParameters
const pullParamUsers = (questionID) => {
  // we need to think about this one, more specifically about how we are going to break up regions
  // we will probably have to have 5 global zones and have a list of countries in each
}

// Module Exports ==================================================================================================================

export {pullParamUsers, pullVotes, pullComments, pullFriends, pullAnswers, pullQuestion, pullUser, pushVote, pushFriend, pushCategory, pushQuestion, pushUser}
