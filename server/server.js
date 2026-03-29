const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// 1. MIDDLEWARES
app.use(cors({
  origin: ['https://storyline-studios.onrender.com', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// 2. MONGODB CONNECTION
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// 3. BOOKING SCHEMA (Ito ang "Logbook" structure mo)
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  date: String,
  location: String,
  package: Object,
  receiptUrl: String, // ✅ DITO PAPASOK YUNG LINK GALING CLOUDINARY
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// 4. API ROUTES
// Route para i-save ang bagong booking
app.post('/api/bookings', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json({ message: 'Booking saved successfully!', data: newBooking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route para sa Calendar (Blocked dates)
app.get('/api/calendar', async (req, res) => {
  const bookings = await Booking.find({}, 'date');
  res.json(bookings.map(b => b.date));
});

// 5. STATIC FILES (For Render Deployment)
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

// Wildcard route para sa React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// 6. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
