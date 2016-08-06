"use strict";
const express = require('express');
const mongodb = require('mongodb');
const _ = require('lodash');
const yahooFinance = require('yahoo-finance');
const moment = require('moment');


// setup db
const port = process.env.PORT || 5000;
const MongoClient = mongodb.MongoClient;
const mongolabUri = process.env.MONGODB_URI;
let db;

let io;

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

MongoClient.connect(mongolabUri, (err, database) => {
  if (err) return console.log(err)
  db = database
  const server = app.listen(port);
  io = require('socket.io')(server);

  io.on('connection', function (socket) {
    db.collection('stocks').find(null, {_id: 0}).toArray((error, result) => {
      socket.emit('new stocks', result.map((s) => {return s.name}));
      socket.emit('new stocks data', {data: result});
    })
    socket.on('add stock', function (data) {
      db.collection('stocks').find(null, {_id: 0, data: 0}).toArray((error, result) => {
        if (!_.includes(result, data.stock)) {
          addNewStock(data.stock);
        }
      })
    });
  });
})

function addNewStock(newStock) {
  yahooFinance.historical({
    symbol: newStock,
    to: moment(new Date()).format('YYYY-MM-DD'),
    from: '2000-01-01',
  }, (error, dataRaw) => {
    if (error) {
      console.log(error);
    } else if (dataRaw) {
      const data = dataRaw.map((obs) => {
        return [Number(new Date(obs.date)), obs.close];
      })
      
      db.collection('stocks').save({data, name: newStock}, (error, result) => {
        db.collection('stocks').find(null, {_id: 0}).toArray((error, result) => {
          io.emit('new stocks', result.map((s) => {return s.name}));
          io.emit('new stocks data', {data: result});
        })
      })
    }
  });
}

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
