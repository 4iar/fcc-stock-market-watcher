"use strict";
const express = require('express');
const mongodb = require('mongodb');

// setup db
const port = process.env.PORT || 5000;
const MongoClient = mongodb.MongoClient;
const mongolabUri = process.env.MONGODB_URI;
let db;

const app = express();
const server = app.listen(port);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

io.on('connection', function (socket) {
  console.log("got a connection");
  socket.emit('news', { hello: 'world' });
  
  socket.on('add stock', function (data) {
    console.log(data);
  });
});

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

MongoClient.connect(mongolabUri, (err, database) => {
  if (err) return console.log(err)
  db = database
})
