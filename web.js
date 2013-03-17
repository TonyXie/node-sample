require('coffee-script');

var $, EventEmitter, app, express, http, io, logger, names, socket;

express = require('express');
EventEmitter = require('events').EventEmitter;
http = require('http');
socket = require('socket.io');
$ = require('jquery');
logger = new EventEmitter();
app = express.createServer();
io = socket.listen(app);

names = [];
messages = [];

app.get('/', function(request, response) {
  return response.render(__dirname + "/index.ejs", {
    names: names
  });
});

// link to the public directory
app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function(client) {
  console.log("Someone's here...");

  client.on('join', function(nickname) {
    client.set('nickname', nickname);
    console.log(nickname + " has joined the room");
    names.push(nickname);
    client.broadcast.emit("new_user", nickname);
    messages.forEach(function(message) {
      client.emit("message", message);
    });
    client.emit("join", names);
  });

  client.on('chat', function(message) {
    messages.push(message);
    client.broadcast.emit('message', message);
    console.log('current list of all messages: ' + messages);    
  })

   // deal with disconnect
  client.on('disconnect', function(name) {
    client.get('nickname', function(err, name) {
      client.broadcast.emit("remove_chatter", name);
    });
  });

});

app.listen(3000);

