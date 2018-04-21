module.exports = {
	logEntry : str => {
		const date = new Date();
		const dateStamp = date.toLocaleDateString();
		const timeStamp = date.toLocaleTimeString();

		console.log('[' + dateStamp + ', ' + timeStamp + ']: ' + str);
	},

	logError : str => {
		logEntry('[Error]: ' + str);
	},

	logDatabaseEntry : str => {
		logEntry('[Database]: ' + str);
	},

	logDatabaseError : str => {
		logError('[Database]: ' + str);
	},

	logUserConnect : (username, ID) => {
		logEntry('User with name ' + username + ' and ID ' + ID + ' connected.');
	},

	logUserDisconnect : (username, ID) => {
		logEntry('User with name ' + username + ' and ID ' + ID + ' disconnected');
	},

	logUserQuestionPost : (username, ID, questionID) => {
		logEntry('User with name ' + username + ' and ID ' + ID + ' posted question with ID ' + questionID);
	},

	logUserQuestionResponse : (username, ID, questionID) => {
		logEntry('User with name ' + username + ' and ID ' + ID + ' responded to question with ID ' + questionID);
	},

	logUserQuestionFeedback : (username, ID, questionID) => {
		logEntry('User with name ' + username + ' and ID ' + ID + ' returned feedbak on question with ID ' + questionID);
	}
};