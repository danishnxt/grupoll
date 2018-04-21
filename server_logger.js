
const logEntry = str => {
	const timeStamp = new Date().toLocaleDateString();
	console.log('[' + timeStamp + ']: ' + str);
};

const logUserConnect = (username, ID) => {
	logEntry('User with name ' + username + ' and ID ' + ID + ' connected.');
};

const logUserDisconnect = (username, ID) => {
	logEntry('User with name ' + username + ' and ID ' + ID + ' disconnected');
};

const logUserQuestionPost = (username, ID, questionID) => {
	logEntry('User with name ' + username + ' and ID ' + ID + ' posted question with ID ' + questionID);
};

const logUserQuestionResponse = (username, ID, questionID) => {
	logEntry('User with name ' + username + ' and ID ' + ID + ' responded to question with ID ' + questionID);
};

const logUserQuestionFeedback = (username, ID, questionID) => {
	logEntry('User with name ' + username + ' and ID ' + ID + ' returned feedbak on question with ID ' + questionID);
};