"use strict";
const express = require('express');
const mongodb = require('mongodb');
const _ = require('lodash');
const yahooFinance = require('yahoo-finance');


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

let stocks = ['googl'];
io.on('connection', function (socket) {
  socket.emit('new stocks', stocks);
  
  socket.on('add stock', function (data) {
    if (!_.includes(stocks, data.stock)) {
      stocks.push(data.stock);
      io.emit('new stocks', stocks);
    }
  });
});

app.get('/api/stocks', (request, response) => {
  console.log(stocks)
  yahooFinance.historical({
    symbols: stocks,
    from: '2012-01-01',
    to: '2012-12-31',
  }, (error, data) => {
    if (error) {
      console.log(error);
      response.json({status: 'error', message: 'problem contacting the yahoo finance api'});
    } else if (data) {
      response.json({status: 'success', message: null, data});
    }
  });
});


app.get('*', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

MongoClient.connect(mongolabUri, (err, database) => {
  if (err) return console.log(err)
  db = database
})
