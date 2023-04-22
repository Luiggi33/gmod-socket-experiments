var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function () {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true
});

wsServer.on("connect", function (connection) {
    console.log((new Date()) + ' Connection accepted.');
    connection.on("message", function (message) {
        if (message.type === 'utf8') {
            let data = JSON.parse(message.utf8Data)
            console.log('Received Message: \n', data);
            connection.sendUTF(JSON.stringify({
                "isInstructions": true,
                "instructions" : `
                    local args = ...
                    local test = args[1] .. " is cool"
                    print(test)
                `,
                "args": {
                    1: "Luiggi33"
                }
            }))
        }
    });
    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});