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

const pushUser = (uName, uemail, fName, lName, cntry, gndr, hash) => {

  const newUser = new mUser({username: uName, email: uemail, first_name: fName, last_name: lName, country: cntry, gender: gndr, passwordHash: hash, question_cnt: 0})

  newUser.save((err) => {
    if(err) {
      log.logDatabaseError(err);
    } else {
      log.logDatabaseEntry("New User Record Added.")
    }
  });
}

const pushQuestion = (userID, questionStatement, questionType, containsImage, containsVoice, imageLink, voiceLink, postTime, categoryID, answerTimeLimit, userSeen) => {

  // look up UserID reference
  // potenial required change -> having to move all references to users to ObjItem references



	const newQuestion = new mQuestion({
		user_id : userID,
		question_type : questionType,
		statement : questionStatement,
		contains_image : containsImage,
		contains_voice : containsVoice,
		imae_link : imageLink,
		voice_link : voiceLink,
		post_time : postTime,
		category_id : categoryID,
		answer_time_lim : answerTimeLimit,
		user_seen : userSeen
	});

	newQuestion.save(err => {
		if (err) {
			log.logDatabaseError(err);
		} else {
			log.logDatabaseEntry("New Question Record Added.");
		}
	});
}

pushQuestion("dani", "What is life?", 1, )
mongoose.connection.close()
