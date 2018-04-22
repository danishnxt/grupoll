module.exports = {};

module.exports.logEntry = str => {
	const date = new Date();
	const dateStamp = date.toLocaleDateString();
	const timeStamp = date.toLocaleTimeString();
	console.log('[' + dateStamp + ', ' + timeStamp + ']: ' + str);
};

module.exports.logError = str => {
	module.exports.logEntry('[Error]: ' + str);
};

module.exports.logWebSocketsEntry = str => {
	module.exports.logEntry('[WebSockets]: ' + str);
};

module.exports.logWebSocketsError = str => {
	module.exports.logError('[WebSockets]: ' + str);
};

module.exports.logDatabaseEntry = str => {
	module.exports.logEntry('[Database]: ' + str);
};

module.exports.logDatabaseError = str => {
	module.exports.logError('[Database]: ' + str);
};

module.exports.logUserConnect = (username, ID) => {
	module.exports.logEntry('User with name ' + username + ' and ID ' + ID + ' connected.');
};

module.exports.logUserDisconnect = (username, ID) => {
	module.exports.logEntry('User with name ' + username + ' and ID ' + ID + ' disconnected');
};

module.exports.logUserQuestionPost = (username, ID, questionID) => {
	module.exports.logEntry('User with name ' + username + ' and ID ' + ID + ' posted question with ID ' + questionID);
};

module.exports.logUserQuestionResponse = (ID, questionID) => {
	module.exports.logEntry('User with ID ' + ID + ' responded to question with ID ' + questionID);
};

module.exports.logUserQuestionFeedback = (username, ID, questionID) => {
	module.exports.logEntry('User with name ' + username + ' and ID ' + ID + ' returned feedbak on question with ID ' + questionID);
};
