`use strict`;

const http = require('http');
const io = require('socket.io')(http);

const appendUserToState = (state, userID) => {
	state.connectedUsers.push(userID);
	
}