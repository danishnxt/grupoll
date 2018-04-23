const init = require('./server_init');
const websock = require('./server_websockets');

const setupServer = () => {
	init.initialize();
	init.initializeUpload();
	websock.initWebSocketConnection();
	init.launchServer();
};

setupServer();
