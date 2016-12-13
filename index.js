var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var S3 = require('aws-sdk/clients/s3');

// set up express
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());

// set up mongoose and messages
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

// set up aws
s3 = new S3();

/*********************************************************************************
serve static files
*********************************************************************************/
var path = require('path');
app.use(express.static(path.join(__dirname, 'src/client')));

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});

// allow access for all
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


/*********************************************************************************
handle scoring
*********************************************************************************/
// on get request to scores, send all scores
app.get('/scores', function(req, res) {
  dbController.Score.find({})
  .then((deets) => {
    // console.log('deets', deets);
    res.status(200).send(deets);
  }).catch((err) => {
    console.log('error finding', err);
  });
}); 

// on post request to addscore, add if not a cheater
app.post('/addscore', function(req, res) {
  console.log('request body is', req.body);
  var incoming = req.body;
  if (incoming.score > 117) {
    res.status(404).send('c\'mon bud');
  } else {

    // save score to db then return success
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
  }
});


/*********************************************************************************
sign photo urls
*********************************************************************************/
// sign s3 image and return signed url
app.post('/s3/sign', function(req, res) {

  var params = {Bucket: 'invalidmemories', Key: req.body.filename, ContentType: req.body.filetype, ACL: 'public-read'};
  var url = s3.getSignedUrl('putObject', params, function(err, url) {
    if (err !== null) {
      console.log('error is', err);
      res.status(404).json(err);
    } else {
      console.log("the url is", url);
      res.status(200).json(url);
    }
  });
});


/*********************************************************************************
deal with cohorts
*********************************************************************************/
// get list of all cohorts
app.get('/cohort', function(req, res) {
  console.log('requesting cohort');
  dbController.Cohort.find({})
  .then((allCohorts) => {
    console.log('allcohorts', allCohorts);
    res.status(200).json(allCohorts);   
  })
  .catch((err) => {
    console.log('err getting cohorts', err);
    res.status(404).json(err);
  });
});

// create new cohort
app.post('/cohort/:hash', function(req, res) {
  // create new cohort or replace previous one
  var newCohort = dbController.Cohort.findOneAndUpdate({'name': req.params.hash}, {'students': req.body.students}, {upsert: true, new: true})
  // newCohort.save()
  .then((cohortData) => {
    console.log('successfully posted cohort', cohortData);  
    res.status(201).json(cohortData);
  })
  .catch((err) => {
    console.log('error getting data', err);
    res.status(404).json(err);
  });
});

// get all names from cohort
app.get('/cohort/retrieve/:hash', function(req, res) {
  var currCohort = dbController.Cohort.find({'name': req.params.hash})
  .then((cohortData) => {
    console.log('successfully fetched cohort', cohortData);
    res.status(200).json(cohortData);
  })
  .catch((err) => {
    console.log('error retrieving cohort', err);
    res.status(404).json(err);
  });
});


// listen on port 
app.listen(app.get('port'), function(){
  console.log('listening on port', app.get('port'));
});