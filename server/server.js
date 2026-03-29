const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['https://storyline-studios.onrender.com', 'http://localhost:5173']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from client/dist (RENDER MONOLITH)
app.use(express.static(path.join(__dirname, '../client/dist')));

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ✅ BOOKING SCHEMA
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  eventLocation: { type: String, required: true },
  eventType: String,
  age: Number,
  package: {
    type: { type: String, required: true },
    price: { type: Number, required: true },
    inclusions: [String]
  },
  receiptUrl: { type: String, required: true },
  total: Number,
  status: {
    paid: { type: Boolean, default: false },
    verified: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// ✅ API ROUTES
app.get('/api/calendar', async (req, res) => {
  try {
    const bookings = await Booking.find({ 'status.verified': true });
    const dates = bookings.map(b => new Date(b.date).toISOString().split('T')[0]);
    res.json(dates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/portfolio/:category?', async (req, res) => {
  // Mock portfolio data
  res.json([
    { id: 1, category: 'Wedding', url: 'https://via.placeholder.com/400x300/0a0a0a/00d4ff?text=Wedding' },
    { id: 2, category: 'Debut', url: 'https://via.placeholder.com/400x300/0a0a0a/00d4ff?text=Debut' }
  ]);
});

// ✅ MAIN BOOKING POST ROUTE
app.post('/api/bookings', async (req, res) => {
  try {
    console.log('📥 New booking received:', req.body);
    
    const booking = new Booking({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      date: new Date(req.body.date),
      eventLocation: req.body.eventLocation,
      eventType: req.body.eventType,
      age: req.body.age ? parseInt(req.body.age) : null,
      package: {
        type: req.body.package.type,
        price: req.body.package.price,
        inclusions: req.body.package.inclusions || []
      },
      receiptUrl: req.body.receiptUrl,
      total: req.body.total
    });

    await booking.save();
    
    console.log('✅ Booking saved:', booking._id);
    res.json({
      success: true,
      id: booking._id,
      message: 'Booking created successfully!'
    });
  } catch (error) {
    console.error('❌ Booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ CATCH-ALL ROUTE for React Router (MUST BE LAST)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Storyline Studios running on port ${PORT}`);
  console.log(`📁 Static files: ${path.join(__dirname, '../client/dist')}`);
  console.log(`✅ Ready for production!`);
});
