`use strict`;

const init = require('./server_init');
const io = require('socket.io')(init.httpServer);
const log = require('./server_logger');
const db = require('./dataImport');

const handleUserInitialization = sock => {
	sock.on('msgUserInitialization', msg => {
		// retrieve user info from database
		db.pullUser(msg.userID).then(
			result => {
				sock.emit('msgUserInitializationConfirmed', result);
				log.logUserConnect(result.first_name + ' ' + result.last_name, result.id);
			},

			err => {
				sock.emit('msgUserInitializationRejected', msg);
				log.logWebSocketsError('Failed to initialize user with ID ' + msg.userID);
			}
		);
	});
};

const handleQuestionPostRequest = sock => {
	log.logEntry('Handing question post request');

	const date = new Date();

	sock.on('msgQuestionPostRequest', msg => {
		db.pushQuestion(
			msg.userID,
			msg.questionStatement,
			msg.questionType,
			msg.containsImage,
			msg.containsVoice,
			msg.imageLink,
			msg.voiceLink,
			date,
			msg.categoryID,
			msg.answerTimeLimit,
			false
		).then(
			result => {
				sock.emit('msgQuestionPostRequestConfirmed', result);
				log.logWebSocketsEntry('Question posting successful');
			},

			err => {
				sock.emit('msgQuestionPostRequestRejected', msg);
				log.logWebSocketsError('Question posting failed');
			}
		);
	});
};

const handleQuestionVoteRequest = sock => {
	sock.on('msgQuestionVoteRequest', msg => {
		db.pushVote(
			msg.userID,
			msg.questionID,
			msg.value
		).then(
			result => {
				sock.emit('msgQuestionVoteRequestConfirmed', result);
				log.logUserQuestionResponse(msg.userID, msg.questionID)
			},

			err => {
				sock.emit('msgQuestionVoteRequestRejected', msg);
			}
		);
	});
};

const handleAnswerPostRequest = sock => {
	sock.on('msgAnswerPostRequest', msg => {
		db.pushAnswer(
			msg.questionID,
			msg.option1,
			msg.option2,
			msg.option3,
			msg.option1Link,
			msg.option2Link,
			msg.option3Link
			).then(
			result => {
				sock.emit('msgAnswerPostRequestConfirmed', result);
				log.logEntry('Answer to question with ID ' + msg.questionID + ' added');
			},

			err => {
				sock.emit('msgAnswerPostRequestRejected', msg);
				log.logError('Unable to post answer to question with ID ' + msg.questionID);
			}
		);
	});
};

const initWebSocketConnection = () => {
	io.on('connection', sock => {
		log.logEntry('Client connected');

		handleUserInitialization(sock);

		handleQuestionPostRequest(sock);

		handleQuestionVoteRequest(sock);

		handleAnswerPostRequest(sock);
	})
};

module.exports = { initWebSocketConnection };