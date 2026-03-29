const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  category: { type: String, enum: ['Wedding', 'Debut', 'Birthday', 'Proposal', 'Corporate'] },
  type: { type: String, enum: ['photo', 'video'] },
  url: String,
  thumbnail: String,
  adminOnly: { type: Boolean, default: false }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);