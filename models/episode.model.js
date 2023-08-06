// models/episode.js
const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  season: { type: mongoose.Schema.Types.ObjectId, ref: 'Season', required: true },
  title: { type: String },
  duration: { type: Number},
  description: { type: String},
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


const Episode = mongoose.model('Episode', episodeSchema);

module.exports = Episode;
