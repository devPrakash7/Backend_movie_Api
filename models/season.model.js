const mongoose = require('mongoose');

const seasonSchema = new mongoose.Schema({
  series: { type: mongoose.Schema.Types.ObjectId, ref: 'Series'},
  seasonNumber: { type: Number},
  episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }],
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

const Season = mongoose.model('Season', seasonSchema);

module.exports = Season;