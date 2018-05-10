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
const mRequest = require('./models/request')
const mNotification = require('./models/notification')

const log = require('./server_logger');
const uri = "mongodb+srv://danishnxt:qwertyuiop123098@nxtcluster1-hy2py.mongodb.net/grupoll_DB";
mongoose.connect(uri)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// pushes =====================================================================================================================

const pushFriendRequest = (rUser, tUser) => new Promise((resolve, reject) => {

  const newRequest = new mRequest({request_user_id: types.ObjectId(rUser), target_user_id:types.ObjectId(tUser), status: 1})

  newRequest.save((err, obj) => {
    if (err) {
      log.logDatabaseError(err);
      reject(err);
    } else {
      log.logDatabaseEntry("New friend request added")
      resolve(obj)
    }

  })
})


const pushUser = (uName, uemail, profileImage, profileImageLink, fName, lName, cntry, gndr, hash) => new Promise((resolve, reject) => {

  const newUser = new mUser({username: uName, profile_image_exists:profileImage, profile_image_link:profileImageLink, email: uemail, first_name: fName, last_name: lName, country: cntry, gender: gndr, password_hash: hash, question_cnt: 0})

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

const pushAnswer = (qID, opt1, opt2, opt3, opt1Link, opt2Link, opt3Link) => new Promise((resolve, reject) => {
  const newAnswer = new mAnswer({
    question_id : types.ObjectId(qID),
    option_1 : opt1,
    option_2 : opt2,
    option_3 : opt3,
    option1_Link : opt1Link,
    option2_Link : opt2Link,
    option3_Link : opt3Link
  });

  newAnswer.save((err, obj) => {
    if (err) {
      log.logDatabaseError(err);
      reject(err);
    } else {
      log.logDatabaseEntry("New Answer Posted");
      resolve(obj);
    }
  });
});

const pushVote = (uID, qID, vValue) => new Promise((resolve, reject) => {

  const newVote = new mVote({
    question_id: types.ObjectId(qID),
    user_id: types.ObjectId(uID),
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

const pushNotification = (notifUserID, notifType, notifContent, notifQuest) => new Promise ((resolve, reject) => {

  const newNotif = new mNotification({
    notif_user_id: types.ObjectId(notifUserID),
    notif_type: notifType,
    notif_content: notifContent,
    notif_question_id: notifQuest,
    notif_time: Date.now(),
    notif_seen: false
  })

  newNotif.save((err, obj) => {
    if (err) {
      log.logDatabaseError(err);
      reject(err)
    } else {
      log.logDatabaseEntry("New Notification Saved")
      resolve(obj)
    }
  })

})

// update values ===================================================================================================================

const changeProfilePic = (uID, picP) => new Promise ((resolve, reject) => {
  mUser.update({_id:uID}, {$set:{profile_image_exists:true, profile_image_link:picP}}, () => {
    console.log("profile picture changed")
  })
})

const changePassword = (uID, passHash) => new Promise ((resolve, reject) => {
  mUser.update({_id:uID}, {$set:{password_hash:passHash}}, () => {
    console.log("password changed")
  })
})

const changeUsername = (uID, newUN) => new Promise ((resolve, reject) => {
  mUser.update({_id:uID}, {$set:{username:newUN}}, () => {
    console.log("userName updated")
  })
})

const notificationSeen = (nID, uID) => new Promise ((resolve, reject) => {
  mNotification.update({_id: nID, notif_user_id: uID}, {$set:{notif_seen:true}}, () => {
    log.logDatabaseEntry(uID, " saw notification", nID)
  })
})

const updateVote = (uID, qID, vValue) => new Promise ((resolve, reject) => {
  mVote.update({question_id:types.ObjectId(uID), user_id:types.ObjectId(qID) }, { $set : {value:vValue} } , () => {
    console.log("update Complete!")
  })
})

const updateFriendRequest = (rUser, tUser, updateVal) => new Promise ((resolve, reject) => {

  var x = 0 // rejected

  if (updateVal) {
    x = 2 // accepted
  }

  mRequest.update({request_user_id:types.ObjectId(rUser), target_user_id:types.ObjectId(tUser)}, {$set:{status:x}}, () => {
    console.log("update complete!")
  })
})

// full pulls ===================================================================================================================

const pullUser = (objID) => new Promise ((resolve,reject) => {
  mUser.findOne({ _id: types.ObjectId(objID) }, (err, res) => {
    if (err) {
      reject(err)
    } else {
        if (res === null) {
          reject("null error, value not found")
        } else {
          resolve(res)
        }
      }
  });
})

const pullUserAuthenticate = (userN, password) => new Promise ((resolve,reject) => {
  mUser.findOne({ username: userN, password_hash: password}, (err, res) => {
    if (err) {
      reject(err)
    } else {
        if (res === null) {
          reject("null error, value not found")
        } else {
          resolve(res)
        }
      }
  });
})


const pullQuestion = (objID) => new Promise ((resolve, reject) => {
  mQuestion.findOne({ _id: types.ObjectId(objID) }, (err, res) => {
    if (err) {
      reject(err)
    } else {
      if (res === null) {
          reject("null error, value not found")
        } else {
          resolve(res)
        }
      }
  });
})

const pullAnswerOptions = (questionID) => new Promise ((resolve, reject) => {
  mAnswer.findOne({question_id: types.ObjectId(questionID)}, (err, res) => {
    if (err) {
      reject(err)
    } else {
      if (res === null) {
          reject("null error, no result found")
        } else {
          resolve(res)
        }
    }
   });
})

const pullNotifications = (userID) => new Promise ((resolve, reject) => {

  mNotification.find({notif_user_id:userID}, (err, res) => {
    if (err) {
      log.logDatabaseError(err)
      reject(err)
    } else {
      log.logDatabaseEntry("Notification for -> " + userID + " pulled")
      // log.logDatabaseEntry(res);
      resolve(res)
    }
  })
})

// queries ======================================================================================================================

const pullFriendRequests = (usr) => new Promise ((resolve, reject) => {

  mRequest.find({target_user_id:types.ObjectId(usr)}, 'request_user_id', (err, res) => {

    if (err) {
      console.log("error hit -> request not found" )
      reject(err)
    } else {
      console.log("request found")
      resolve(res)
    }

  })
})

const pullUserbyUN = (uName) => new Promise ((resolve, reject) => {

  mUser.findOne({username: uName}, '_id' , (err, res) => {
      if (err) {
        reject(err)
      } else {
        if (res === null) {
          reject("null") // nothing there
        } else {
          resolve(res) // send back the details of the user
        }
      }
  })
})

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

const pullByGender = (gVal) => new Promise((resolve, reject) => {
  mUser.find({gender:gVal},'_id', (err,res) => {
    if(err){
      reject(err)
    } else {
      resolve(res)
    }
  })
})

const pullRecentQuestions = (limitAsk) =>  new Promise((resolve, reject) => {
  // limit for 10 hard coded currently
  mQuestion.find({answer_time_lim:{$gte:Date.now()}},(err, res) => {
    if(err) {
      reject(err)
    } else {
      returnVal = res.slice(0,limitAsk)
      resolve(returnVal)
    }
  })
})

// NEW UNTESTED QUERIES =======================================================================================================

const pullVoteExist = (qID, uID) => new Promise((resolve, reject) => {
  mVote.findOne({question_id:types.ObjectId(qID), user_id:types.ObjectId(uID)}, (err, res) => {
    if(err){
      reject(err)
    } else {
      if (res === null) {
        reject("NONE")
      } else {
        resolve("EXISTS") // MESSAGE TO TIRMAZI -> CHECK HERE FOR A CHANGE IN THE WAY REJECTIONS ARE HANDLED //
      }
    }
  })
})

const pullActiveQuestion = (uID) => new Promise((resolve, reject) => {

  // there is the one unqiue case here that the request will be slightly off by a few ms in which case we'll miss
  // a question but this is such an edge case that we can probably ignore it for the time being

  curTime = Date.now()
  mQuestion.findOne({user_id:types.ObjectId(uID), answer_time_lim: {$gte:curTime}}, '_id', (err, res) => {
    if(err){
      reject(err)
    } else {
      if(res === null) {
        resolve("null")
      } else {
        resolve(res._id)
      }
    }
  })
})



// Module Exports ==============================================================================================================

module.exports = {pullRecentQuestions, pushAnswer, pullVotes, pullComments, pullFriends, pullAnswerOptions, pullQuestion, pullUser, pushVote, pushFriend, pushCategory, pushQuestion, pushUser, updateVote, pullActiveQuestion, pullVoteExist, pullUserAuthenticate, pullUserbyUN, pushFriendRequest, pullFriendRequests, updateFriendRequest, notificationSeen, changePassword, changeProfilePic, changeUsername, pullNotifications, pushNotification}


///

ast = pullAnswerOptions("5af387fa211c1332bc7c4f09").then((data) => {
  console.log(data)
}).catch(err => {
  console.log(err)
})
