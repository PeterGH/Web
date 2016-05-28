var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var exec = require('child_process').exec;

var server = http.createServer(function(request, response) {
    console.log((new Date()).toLocaleString() + ', ' + request.method + ' ' + request.url);
    if (request.method.toUpperCase() == "GET") {
	if (request.url == '/') {
	    serveStatic(response, 'public/index.html');
	} else {
	    serveStatic(response, 'public' + request.url);
	}
    } else {
	// Have to init. Otherwise, data += will prepend 'undefined'
	var data = '';
	request.on('data', (chunk) => {
	    console.log('Recieved: ' + chunk);
	    data += chunk;
	}).on('end', () => {
	    exec(data, (error, stdout, stderr) => {
		if (error) {
		    console.log(error);
		    response.end('' + error);
		} else {
		    response.write(stdout);
		    response.end(stderr);
		}
	    });
	});
    }
});

server.listen(3000, function(){
    console.log('Server listening on port 3000.');
});

function send404(response) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
}

function sendFile(response, filePath, fileContent) {
    response.writeHead(
	200,
	{'Content-Type': mime.lookup(path.basename(filePath))}
    );
    response.end(fileContent);
}

function serveStatic(response, filePath) {
    fs.exists(filePath, function(exists) {
	if (!exists) {
	    send404(response);
	} else {
	    fs.readFile(filePath, function(err, data) {
		if (err) {
		    send404(response);
		} else {
		    sendFile(response, filePath, data);
		}
	    });
	}
    });
}
