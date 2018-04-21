`use strict`;

const init = require('./server_init');
const io = require('socket.io')(init.httpServer);
const log = require('./server_logger');

const handleUserInitialization = sock => {
	sock.on('msgUserInitialization', msg => {
		// retrieve user info from database
	});
};

const handleQuestionPostRequest = sock => {
	sock.on('msgQuestionPostRequest', msg => {
		// post question to database

		// return message confirming question posted or error
	});
};

const initWebSocketConnection = () => {
	io.on('connection', sock => {
		log.logEntry('Client connected');

		handleUserInitialization(sock);

		handleQuestionPostRequest(sock);
	})
};