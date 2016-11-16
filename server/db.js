var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scoreSchema = new Schema({
  name: Number,
  score: String
});

exports.Score = mongoose.model('Score', scoreSchema);