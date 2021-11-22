const http = require('http');
const url = require('url');
const stringDecorder = require('string_decoder').StringDecoder;

const config = require('./config');

const server = http.createServer((req, res) => {
	const parseUrl = url.parse(req.url, true);

	const path = parseUrl.pathname;

	const trimmedPath = path.replace(/^\/+|\/+$/g, '');

	const method = req.method.toLowerCase();

	const queryStringObject = parseUrl.query;

	const headers = req.headers;

	const decoder = new stringDecorder('utf-8');

	let buffer = '';

	req.on('data', function(data) {
		buffer += decoder.write(data);
	});

	req.on('end', function() {
		buffer += decoder.end();
	});

	let chosenHandler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : handlers.notFound;

	const data = {
		trimmedPath: trimmedPath,
		queryStringObject: queryStringObject,
		method: method,
		headers: headers,
		payload: buffer
	};

	chosenHandler(data, function(statusCode, payload) {
		statusCode = typeof statusCode == 'number' ? statusCode : 200;

		payload = typeof payload == 'object' ? payload : {};

		const payloadString = JSON.stringify(payload);

		res.setHeader('Content-type', 'application/json');
		res.writeHead(statusCode);
		res.end(payloadString);

		console.log('Here is the response', statusCode, payloadString);
	});
});

const Port = 5000;

server.listen(config.port, () => console.log(`Server is running on port ${config.port} in ${config.envName} mode`));

let handlers = {};

handlers.sample = function(data, callback) {
	callback(406, { name: 'sample-handler' });
};

handlers.notFound = function(data, callback) {
	callback(404);
};

let router = {
	sample: handlers.sample
};
