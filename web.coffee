# require stuff
express = require 'express'
EventEmitter = require('events').EventEmitter
http = require 'http'
socket = require 'socket.io'
$ = require 'jquery'

# class variables
logger = new EventEmitter
app = express.createServer express.logger
io = socket.listen app 

#http.createServer (require, response) -> 
#  (response.writeHead 200
#  response.write 'hi this is dog'
#  response.end).listen 3000

names = []
messages = []

app.get '/', (request, response) -> 
  response.render __dirname + "/index.ejs", {names: names}

io.sockets.on 'connection', (client) -> 
  console.log "Someone's here..."

  client.on 'join', (nickname) -> 
    client.set 'nickname', nickname 
    console.log nickname + " has joined the room"
    names.push nickname
    client.broadcast.emit("join", names)

app.listen 3000