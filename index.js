const http = require('http');
const url = require('url');
const stringDecorder = require('string_decoder').StringDecoder;

const config = require('./config');

const _data = require('./lib/data');

// _data.delete('test','newFile',function(err) {
// 	console.log('This is the response :', err);
// });

// _data.update('test','newFile',{'firstName' : 'James'}, function(err) {
// 	console.log('This is the response :', err);
// });

// _data.read('test', 'newFile', function(err, data) {
// 	console.log('This is the response :', err, ': ' + 'and this is the :', data);
// });

_data.create('test', 'newFile', { 'First name': 'Jerry' }, function(err) {
	console.log('This is the response with', err);
});

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

handlers.ping = function(data, callback) {
	callback(200);
};

handlers.notFound = function(data, callback) {
	callback(404);
};

let router = {
	ping: handlers.ping
};
