const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema

const PhotoSchema = new Schema({
  title: String,
  description: String,
  image: String,
  c: {
    type: Date,
    default: Date.now,
  },
});

const Photo = mongoose.model('Photo', PhotoSchema);

module.exports = Photo;
