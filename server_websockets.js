`use strict`;

const init = require('./server_init');
const io = require('socket.io')(init.httpServer);
const log = require('./server_logger');
const db = require('./dataImport');

const handleFriendRequest = sock => {
	sock.on('msgSearchUserRequest', (usr, reqUsr) => {

		console.log("SEARCH INITIATED FOR -> ", usr)
		db.pullUserbyUN(usr).then((obj) => {

			db.pushFriendRequest(usr, reqUsr).then(() => {
				sock.emit('msgSearchUserRequestConfirm', "Request Sent!")
			}).catch(() => {
				sock.emit('msgSearchUserRequestReject')
			})

		}).catch((err) => {
			console.log(err)
			sock.emit('msgSearchUserQueryRequestReject')
		})

	})
}

const handleFriendRequestList = sock => {
	sock.on('msgFriendRequestQuery', usr => {
		console.log("User requests a friend request")
		db.pullFriendRequests(usr).then((list) => {

			console.log(list)
			proms = []
			usrs = []

			list.forEach(req => {
				var a = pullUser(req).then((userData) => {
					usrs = usrs.concat(userData) // add this to the list
				}).catch((err) => {
					console.log(err)
				})
				proms = proms.concat(a) // add to the list
			})

			Promise.all(proms).then(() => {
				sock.emit(msgFriendRequestResponse, usrs) // send back the list
			})
		})
	})
}

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

	log.logWebSocketsEntry('Handling question post request');
	sock.on('msgQuestionPostRequest', msg => {

		ast = db.pullActiveQuestion(msg.userID).then((data) => {

			if (data === "null") {

				db.pushQuestion(
				msg.userID,
				msg.questionStatement,
				msg.questionType,
				msg.containsImage,
				msg.containsVoice,
				msg.imageLink,
				msg.voiceLink,
				msg.date,
				msg.categoryID,
				msg.answerTimeLimit,
				false
				).then(
					result => {
						sock.emit('msgQuestionPostRequestConfirmed', result);
						log.logWebSocketsEntry('Question posting successful');

						// db.pushNotification(msg.userID, 2, msg.questionStatement, result._id).then(
						// 	r2 => {
						// 		log.logWeSocketsEntry('Notification posted for question id ' + result._id);
						// 	},

						// 	e2 => {
						// 		log.logWebSocketsError('Failed to post notification for question id ' + result._id);
						// 	}
						// );
					},

					err => {
						sock.emit('msgQuestionPostRequestRejected', msg);
						log.logWebSocketsError('Question posting failed');
					}
				);

			} else {
				sock.emit('msgQuestionPostRequestBounds'); //
				log.logWebSocketsError('Question Posting negative, already existing question')
			}

		}).catch((err) => {
			sock.emit('msgQuestionPostRequestRejected', msg);
			log.logWebSocketsError('Question posting failed');
		})

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
				log.logUserQuestionResponse(msg.userID, msg.questionID);

				const notifContent = 'Vote posted for your question.';
				db.pushNotification(result.user_id, 2, notifContent, msg.questionID).then(
					r2 => {
						log.logWebSocketsEntry('Notification for vote of question id ' + msg.questionID + ' pushed.');
					},

					e2 => {
						log.logWebSocketsError('Notification push failed for vote of question id ' + msg.questionID);
					}
				);
			},

			err => {
				sock.emit('msgQuestionVoteRequestRejected', msg);
				log.logWebSocketsError('Question vote request failed for question with ID ' + msg.questionID);
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
				log.logWebSocketsEntry('Answer to question with ID ' + msg.questionID + ' added');
			},

			err => {
				sock.emit('msgAnswerPostRequestRejected', msg);
				log.logWebSocketsError('Unable to post answer to question with ID ' + msg.questionID);
			}
		);
	});
};

const handleQuestionRetrieveRequest = sock => {
	sock.on('msgQuestionRetrieveRequest', msg => {
		db.pullQuestion(msg.questionID).then(
			result => {
				sock.emit('msgQuestionRetrieveRequestConfirmed', result);
				log.logWebSocketsEntry('Question retrieval for ID ' + msg.questionID + ' added');
			},

			err => {
				sock.emit('msgQuestionRetrieveRequestRejected', msg);
				log.logWebSocketsError('Unable to retrieve question with ID ' + msg.questionID);
			}
		);
	});
};

const handleAnswerRetrieveRequest = sock => {
	sock.on('msgAnswerRetrieveRequest', msg => {
		db.pullAnswerOptions(msg.questionID).then(
			result => {
				sock.emit('msgAnswerRetrieveRequestConfirmed', result);
				log.logWebSocketsEntry('Answer retrieval for question with ID ' + msg.questionID + ' added');
			},
			err => {
				sock.emit('msgAnswerRetrieveRequestRejected', msg);
				log.logWebSocketsError('Unable to retrieve answer for question with ID ' + msg.questionID);
			}
		);
	});
};

const handleUserFeedRetrieveRequest = sock => {
	sock.on('msgUserFeedRetrieveRequest', msg => {
		db.pullRecentQuestions(10).then(
			result => {
				sock.emit('msgUserFeedRetrieveRequestConfirmed', result);
				log.logWebSocketsEntry('User feed retrieval successful');
			},
			err => {
				sock.emit('msgUserFeedRetrieveRequestRejected', msg);
				log.logWebSocketsError('Unable to retrieve user feed.');
			}
		);
	});
};

const handleUserLoginRequest = sock => {
	sock.on('msgUserLoginRequest', msg => {
			// console.log('Username ' + msg.userName + ' password ' + msg.password);
		db.pullUserAuthenticate(msg.userName, msg.password).then(
			result => {
				db.pullActiveQuestion(result._id).then(qResult => {
					sock.emit('msgUserLoginRequestConfirmed', result, qResult);
					log.logWebSocketsEntry('User active question retrieval successful ' + msg.userName  + qResult);
				},
				err => {
					sock.emit('msgUserLoginRejected');
					log.logWebSocketsError('Active Question Lookup Failed ' + msg.userName + " " + result._id);
				})
			},
			err => {
				sock.emit('msgUserLoginRejected');
				log.logWebSocketsError('User login failed for username ' + msg.password);
			}
		);
	});
};

const handleUserSignupRequest = sock => {
	sock.on('msgUserSignupRequest', msg => {
		db.pushUser(
			msg.userName,
			msg.email,
			msg.profileImageExists,
			msg.profileImageLink,
			msg.firstName,
			msg.lastName,
			msg.country,
			msg.gender,
			msg.passwordHash
		).then(
			result => {
				sock.emit('msgUserSignupRequestConfirmed', result);
				log.logWebSocketsEntry('User signup successful for username ' + msg.userName);
			},

			err => {
				sock.emit('msgUserSignupRequestRejected', msg);
				log.logWebSocketsError('User signup failed for username ' + msg.userName);
			}
		);
	});
};

const handleQuestionVotesRetrieveRequest = sock => {
	sock.on('msgQuestionVotesRetrieveRequest', msg => {
		db.pullVotes(msg.questionID).then(
			result => {
				sock.emit('msgQuestionVotesRetrieveRequestConfirmed', result);
				log.logWebSocketsEntry('Votes retrieval successful for question with ID' + msg.questionID);
			},

			err => {
				sock.emit('msgQuestionVotesRetrieveRequestRejected', msg);
				log.logWebSocketsError('Votes retrieval failed for question with ID ' + msg.questionID);
			}
		);
	});
};

const handleNotificationPushRequest = sock => {
	sock.on('msgNotificationPushRequest', msg => {
		db.pushNotification(
			msg.notificationUserID,
			msg.notificationType,
			msg.notificationContent,
			msg.notificationQuest
		).then(
			result => {
				sock.emit('msgNotificationPushRequestConfirmed', result);
				log.logWeSocketsEntry(`Notification push by user ${msg.notificationUserID} confirmed.`);
			},

			err => {
				sock.emit('msgNotificationPushRequestRejected', msg);
				log.logWebSocketsError(`Notification push by user ${msg.notificationUserID} rejected`);
			}
		);
	});
};

const handleNotificationPullRequest = sock => {
	sock.on('msgNotificationPullRequest', msg => {
		db.pullNotifications(msg.notificationUserID).then(
			result => {
				sock.emit('msgNotificationPullRequestConfirmed', result);
				log.logWebSocketsEntry(`Notification pulls by user ${msg.notificationUserID} confirmed.`);
			},

			err => {
				sock.emit('msgNotificationPullRequestRejected', msg);
				log.logWebSocketsError(`Notification pulls by user ${msg.notificationUserID} rejected.`);
			}
		);
	});
};

const initWebSocketConnection = () => {
	io.on('connection', sock => {
		log.logWebSocketsEntry('Client connected');

		handleFriendRequest(sock);
		handleFriendRequestList(sock);
		handleUserInitialization(sock);
		handleQuestionPostRequest(sock);
		handleQuestionVoteRequest(sock);
		handleAnswerPostRequest(sock);
		handleQuestionRetrieveRequest(sock);
		handleAnswerRetrieveRequest(sock);
		handleUserFeedRetrieveRequest(sock);
		handleUserLoginRequest(sock);
		handleUserSignupRequest(sock);
		handleQuestionVotesRetrieveRequest(sock);
		handleNotificationPushRequest(sock);
		handleNotificationPullRequest(sock);
	});
};

module.exports = { initWebSocketConnection };
