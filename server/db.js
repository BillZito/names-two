var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scoreSchema = new Schema({
  name: String,
  score: Number
});

exports.Score = mongoose.model('Score', scoreSchema);