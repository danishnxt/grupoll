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

const updateVote = (uID, qID, vValue) => new Promise ((resolve, reject) => {
  mVote.update({question_id:types.ObjectId(uID), user_id:types.ObjectId(qID) }, { $set : {value:vValue} } , () => {
    console.log("update Complete!")
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

// queries ======================================================================================================================

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
  // belay this for the time being
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

const pullRecentQuestions = () =>  new Promise((resolve, reject) => {
  // limit for 10 hard coded currently
  mQuestion.find({answerTimeLimit:{ $gte:Date.now()}}, {limit: 2}, (err, res) => {
    if(err) {
      reject(err)
    } else {
      resolve(res)
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

  curTime = Date.Now()
  mQuestion.findOne({user_id:types.ObjectId(uID), answerTimeLimit: {$gte:curTime}}, '_id', (err, res) => {
    if(err){
      reject(err)
    } else {
      if(res === null) {
        resolve("ALLOW")
      } else {
        reject("DISALLOW")
      }
    }
  })
})

// Module Exports ==============================================================================================================

module.exports = {pushAnswer, pullParamUsers, pullVotes, pullComments, pullFriends, pullAnswerOptions, pullQuestion, pullUser, pushVote, pushFriend, pushCategory, pushQuestion, pushUser, updateVote, pullActiveQuestion, pullVoteExist}

// Frag data and run this to repopulate fake data into the database ===========================================================

// a = pushQuestion("5adb32fce1144d2c68430c95", "What is Alinas fav color?")
// b = pushQuestion("5adc604f2bd79334dc4d0bca", "Why is Ammar so funnny???")
// c = pushQuestion("5adc604f2bd79334dc4d0bcb", "Why can't Danish Get a Girlfriend?")
// d = pushQuestion("5adc604f2bd79334dc4d0bcc", "Why can't Tirmazi chill?")
// e = pushQuestion("5adc604f2bd79334dc4d0bcd", "Where is Izma?")

// a.then(qst => {
//   pushAnswer(qst._id, "Red", "blue", "green", "","","").then(() => {
//     pushVote("5adb32fce1144d2c68430c95", qst._id,1).then(() => {console.log("done")})
//     pushVote("5adc604f2bd79334dc4d0bcb", qst._id,3).then(() => {console.log("done")})
//     pushVote("5adc604f2bd79334dc4d0bcd", qst._id,2).then(() => {console.log("done")})
//   })
// })

// b.then(qst => {
//   pushAnswer(qst._id, "He was born this way!", "He likes pie", "He has funny glasses", "", "", "").then(() => {
//     pushVote("5adc604f2bd79334dc4d0bcd", qst._id,1).then(() => {console.log("done")})
//     pushVote("5adb32fce1144d2c68430c95", qst._id,3).then(() => {console.log("done")})
//     pushVote("5adc604f2bd79334dc4d0bcb", qst._id,2).then(() => {console.log("done")})
//   })
// })

// c.then(qst => {
//   pushAnswer(qst._id, "Because no?", "Because NO?", "because why?!?!", "", "", "").then(() => {
//     pushVote("5adc604f2bd79334dc4d0bcb", qst._id,1).then(() => {console.log("done")})
//     pushVote("5adb32fce1144d2c68430c95", qst._id,3).then(() => {console.log("done")})
//     pushVote("5adc604f2bd79334dc4d0bcd", qst._id,2).then(() => {console.log("done")})
//   })
// })

// d.then(qst => {
//   pushAnswer(qst._id, "He's too smart", "He'd waste potential", "Because Harvard might dump him", "", "", "").then(() => {
//     pushVote("5adc604f2bd79334dc4d0bcb", qst._id,1).then(() => {console.log("done")})
//     pushVote("5adc604f2bd79334dc4d0bcd", qst._id,3).then(() => {console.log("done")})
//     pushVote("5adb32fce1144d2c68430c95", qst._id,2).then(() => {console.log("done")})
//   })
// })

// e.then(qst => {
//   pushAnswer(qst._id, "Outer Space?", "The Desert?", "Trapped with a dragon", "","","").then(() => {
//     pushVote("5adb32fce1144d2c68430c95", qst._id,1).then(() => {console.log("done")})
//     pushVote("5adc604f2bd79334dc4d0bcd", qst._id,3).then(() => {console.log("done")})
//     pushVote("5adc604f2bd79334dc4d0bcb", qst._id,2).then(() => {console.log("done")})
//   })
// })

// testing ======================================================================================================================

pullRecentQuestions().then(data => {
  console.log(data)
})
