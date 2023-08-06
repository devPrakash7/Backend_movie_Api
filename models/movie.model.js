// models/movie.js
const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
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
  movie_poster: {
    type: String,
  },
  duration: {
    type: String,
  },
  description: {
    type: String,
  },
  rating: {
    type: Number,
    default:0
  },
  created_at: {
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

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
