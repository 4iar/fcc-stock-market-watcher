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
    
    socket.on('delete stock', (data) => {
      // TODO: factor these validations out
     if (!data || typeof data.stock !== 'string') {
        socket.emit('add stock error', {error: 'invalid data, wtf did you do?', stock: null});
        return
      } else {
        data.stock = data.stock.toUpperCase();
      }
     if (data.stock.length === 0) {
        socket.emit('add stock error', {error: 'symbol cannot be empty', stock: data.stock});
        return;
      }

      db.collection('stocks').remove({name: data.stock}, (error, result) => {
        if (!result || error) {
          console.log("error deleting stock");
          console.log(error)
        }
      })

      db.collection('stocks').find(null, {_id: 0}).toArray((error, result) => {
        if (result) {
          io.emit('new stocks', result.map((s) => {return s.name}));
          io.emit('new stocks data', {data: result});
        }
      })
    }) 
    
    socket.on('add stock', function (data) {
      if (!data || typeof data.stock !== 'string') {
        socket.emit('add stock error', {error: 'invalid data, wtf did you do?', stock: null});
        return
      } else {
        data.stock = data.stock.toUpperCase();
      }

      db.collection('stocks').find(null, {_id: 0, data: 0}).toArray((error, result) => {
        if (error) {
          socket.emit('add stock error', {error: 'error contacting the database', stock: data.stock});
          return;
        } else if (result) {
          if (!_.includes(result.map(s => {return s.name}), data.stock)) {
            addNewStock(data.stock, socket);
          } else {
            socket.emit('add stock error', 'stock already exists');
          }
        }
      })
    });
  });
})

function addNewStock(newStock, socket) {
  yahooFinance.historical({
    symbol: newStock,
    to: moment(new Date()).format('YYYY-MM-DD'),
    from: '2000-01-01',
  }, (error, dataRaw) => {
    if (error) {
      console.log(error);
    } else if (dataRaw) {
      if (dataRaw.length === 0) {
        socket.emit('add stock error', {error: 'invalid stock', stock: newStock});
        return;
      }
      const data = dataRaw.map((obs) => {
        return [Number(new Date(obs.date)), obs.close];
      })

      db.collection('stocks').save({data, name: newStock}, (error, result) => {
        if (error) {
          socket.emit('add stock error', {error: 'error contacting the database', stock: newStock});
        } else if (result) {
          db.collection('stocks').find(null, {_id: 0}).toArray((error, result) => {
            if (result) {
              socket.emit('add stock success', newStock);
              io.emit('new stocks', result.map((s) => {return s.name}));
              io.emit('new stocks data', {data: result});
            }
          })
        }
      })
    }
  });
}

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
