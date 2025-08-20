const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted', 'cancelled', 'completed'], default: 'pending' },
  earnings: Number,
  rating: Number,
  comment: String
});

module.exports = mongoose.model('Trip', tripSchema);
// fault//
