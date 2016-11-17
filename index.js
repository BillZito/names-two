var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());

var mongoose = require('mongoose');
var dbController = require('./db.js');
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

// new code
// new code
var path = require('path');
app.use(express.static(path.join(__dirname, 'src/client')));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/scores', function(req, res) {
  dbController.Score.find({})
  .then((deets) => {
    // console.log('deets', deets);
    res.status(200).send(deets);
  }).catch((err) => {
    console.log('error finding', err);
  });

}); 

app.post('/addscore', function(req, res) {
  console.log('request body is', req.body);
  var incoming = req.body;
  var newScore = dbController.Score({'name': incoming.name, 'score': incoming.score});
  newScore.save()
  .then((data) => {
    console.log('save successfully', data);
    res.status(201).send(data);
  })
  .catch( (err) => {
    console.log('error saving', err);
    res.status(404).send('error saving' + err);
  });
});

app.listen(app.get('port'), function(){
  console.log('listening on port', app.get('port'));
});