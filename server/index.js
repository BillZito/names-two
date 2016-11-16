var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));

var mongoose = require('mongoose');
var dbController = require('db.js');
var connectingPort = process.env.MONGODB_URI || 'mongodb://localhost/test';

mongoose.connection.on('open', function() {
  console.log('mongoose opened');
});

mongoose.connection.on('disconnected', function() {
  console.log('mongoose disconnected');
});

mongoose.connect(connectingPort, function(err) {
  if (err) {
    console.log('error connecting', err);
  }
});

app.get('/', function(req, res) {
  res.status(200).send('sup');
});