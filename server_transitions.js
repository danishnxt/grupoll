`use strict`;

const http = require('http');
const io = require('socket.io')(http);

const appendSocketToUserState = (state, userID, webSocket) => {
	state.perUserState[userID].webSocket = webSocket;
};

const appendUserToState = (state, userID, userName) => {
	state.connectedUsers.push(userID);
	state.perUserState[userID] = {};
	state.perUserState[userID].userName = userName;
};

const appendQuestionToState = (state,)