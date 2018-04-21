var async = require('async')
var mongoose = require('mongoose');

const mUser = require('./models/user')
// const mQuestion = require('./models/question')
// const mVote = require('./models/vote')
// const mVoteWeight = require('./models/voteWeight')
// const mFriend = reqiuire('./models/friend')
// const mCategory = require('./models/category')
// const mComment = require('./models/comment')
// const mQuesParam = require('./models/questionParam')
// const mUserQues = require('./models/userQuestion')
// const mAnswer = require('./models/answer')

uri = "mongodb+srv://danishnxt:yjUJK13ocEdFgOOU@nxtcluster1-hy2py.mongodb.net/grupoll_DB";
mongoose.connect(uri)

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function createUser(uName, uemail, fName, lName, cntry, gndr, hash) {

  const newUser = new mUser({username: uName, email: uemail, first_name: fName, last_name: lName, country: cntry, gender: gndr, passwordHash: hash, question_cnt: 0})

  newUser.save((err) => {
    if(err) {
      console.log(err)
    } else {
      console.log("new record made!")
    }
  })
}

createUser("dani", "danish", "farid", "danishnxt@gmail.com", "pak", 1, "thetye")
