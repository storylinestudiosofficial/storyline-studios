const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  client: {
    name: String,
    email: String,
    phone: String,
    username: String,
    password: String
  },
  event: {
    type: { type: String, enum: ['Wedding', 'Birthday', 'Christening', 'Anniversary', 'Monthsary', 'Proposal', 'Prenup', 'Debut', 'Corporate', 'Graduation'] },
    age: Number, // for birthdays
    date: Date,
    location: String
  },
  package: {
    type: { type: String, enum: ['A', 'B', 'C', 'D'] },
    price: Number,
    upsells: [{
      type: { type: String, enum: ['Rush Edit', 'Raw Files', 'Extra Hour'] },
      price: Number,
      hours: Number // for extra hours
    }]
  },
  payment: {
    method: { type: String, enum: ['GCash', 'Cash'] },
    reservationFeePaid: { type: Boolean, default: false },
    retainerVerified: { type: Boolean, default: false },
    status: {
      retainerVerified: { type: Boolean, default: false },
      shootCompleted: { type: Boolean, default: false },
      cullingEditing: { type: Boolean, default: false },
      colorGrading: { type: Boolean, default: false },
      finalReview: { type: Boolean, default: false },
      finalBalancePaid: { type: Boolean, default: false }
    }
  },
  receipt: String, // Cloudinary URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);