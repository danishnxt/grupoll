`use strict`;

const http = require('http');
const io = require('socket.io')(http);
const log = require('./server_logger');

const getUserNameFromID = (state, userID) => {

}

const appendSocketToUserState = (state, userID, webSocket) => {
	state.perUserState[userID].webSocket = webSocket;
};

const appendUserToState = (state, userID, userName) => {
	state.connectedUsers.push(userID);
	state.perUserState[userID] = {};
	state.perUserState[userID].userName = userName;

	log.logUserConnect(userName, userID);
};

const appendQuestionToState = (state, userID, questionID, questionName, options) => {
	state.postedQuestions.push(questionID);
	state.perUserState[userID].questions.push(questionID);

	state.perQuestionState[questionID].questionName = questionName;
	state.perQuestionState[questionID].options = options;
	state.perQuestionState[questionID].postingUserID = userID;

	state.perQuestionState[questionID].optionVotes = [];

	options.forEach(o => {
		state.perQuestionState[questionID].optionVotes.push(0);
	});

	log.logQuestionPost(userName, userID, questionID);

	// push it onto Database
};


const appendFeedbackToState = (state, userID, questionID, optionNumber) => {
	if (state.connectedUsers.includes(userID)) {
		if (state.postedQuestions.includes(questionID)) {
			state.perQuestionState[questionID].optionVotes[optionNumber]

			const userName = state.perUserState[userID].userName;
			log.logQuestionFeedback(userName, userID, questionID);
		} else {
			log.logError('Failed to find question with ID ' + questionID + '.');
		}
	} else {
		log.logError('Failed to find user with ID ' + userID + '.');
	}
}