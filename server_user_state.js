`use strict`;

const onlineUserIDSocketState = {};
const onlineUserIDList = {};

const assignSocketToUserID = (ID, sock) => {
	onlineUserIDSocketState[ID] = sock;
	sock.userID = ID;
};

const addUserToState = (ID, sock) => {
	onlineUserIDList.push(ID);
	assignSocketToUserID(ID, sock);
};