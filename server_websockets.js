`use strict`;

const init = require('./server_init');
const io = require('socket.io')(init.httpServer);
const log = require('./server_logger');
const db = require('./dataImport');

const handleUserInitialization = sock => {
	sock.on('msgUserInitialization', msg => {
		// retrieve user info from database
		pullUser(msg.userID).then(
			result => {
				sock.emit('msgUserInitializationConfirmed', result);
				log.logUserConnect(result.)
			},

			err => {
				sock.emit('msgUserInitializationRejected', msg);
			}
		);
	});
};

const handleQuestionPostRequest = sock => {
	const date = new Date();

	sock.on('msgQuestionPostRequest', msg => {
		pushQuestion(
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
			},

			err => {
				sock.emit('msgQuestionPostRequestRejected', msg);
			}
		);
	});
};

const handleQuestionVoteRequest = sock => {
	sock.on('msgQuestionVoteRequest', msg => {
		pushVote(
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

export { initWebSocketConnection };