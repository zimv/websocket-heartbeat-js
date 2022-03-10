var WebSocketServer = require('ws').WebSocketServer;
var opn = require('opn');

var wss = new WebSocketServer({
  port: 3003,
});

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received: %s', data);

    this.send('server received message');
  });
  if(ws._protocol) ws.send('Use protocol: ' + ws._protocol);
  else ws.send('something');
});
var testHtml = __dirname +'/index.html';
opn(testHtml);