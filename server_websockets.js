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
				log.logUserConnect(result.user_name, result.id);
			},

			err => {
				sock.emit('msgUserInitializationRejected', msg);
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
				log.logDatabaseEntry('Question posting successful');
			},

			err => {
				sock.emit('msgQuestionPostRequestRejected', msg);
				log.logDatabaseError('Question posting failed');
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
			},

			err => {
				sock.emit('msgQuestionVoteRequestRejected', msg);
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
	})
};

module.exports = { initWebSocketConnection };