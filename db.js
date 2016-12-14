var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scoreSchema = new Schema({
  name: String,
  score: Number
});

var cohortSchema = new Schema({
  name: String,
  students: [{name: String, image: String}]
});

exports.Score = mongoose.model('Score', scoreSchema);
exports.Cohort = mongoose.model('Cohort', cohortSchema);

// if want to drop database, run below code
exports.Cohort.remove({}, function(err) {
  console.log('cohort database dropped', err);
});