`use strict`;

const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');

const initialize = () => {
	app.get('/', (req, res) => {
		res.sendFile(__dirname + '/index.html');
	});

	app.use(express.static('content'));
};

const initializeUpload = () => {
	app.use(fileUpload());

	app.post('/upload', (req, res) => {
		if (!req.files) {
			return res.status(400).send('File upload failure: ')
		}

		const fileName = req.files.fileName;

		fileName.mv(__dirname + '/content/' + fileName.name, err => {
			if (err) {
				return res.status(500).send(err);
			}

			res.send('File upload success');
		});
	});
};