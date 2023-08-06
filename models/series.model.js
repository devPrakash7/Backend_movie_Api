// models/series.js
const mongoose = require('mongoose');


const seriesSchema = new mongoose.Schema({
    
  title: {
    type: String,
  },
  genre: {
    type: String,
  },
  releaseYear: {
    type: Number,
  },
  director: {
    type: String,
  },
  series_poster:{
    type: String,
  },
  duration: {
    type: String,
  },
  rating: {
    type: Number,
    default:0
  },
  description: {
    type: String,
    
  },created_at: {
    type: String,
  },
  updated_at: {
    type: String,
  },
  delete_at: {
    type: String,
    default: null,
  },
});

const Series = mongoose.model('Series', seriesSchema);

module.exports = Series;
