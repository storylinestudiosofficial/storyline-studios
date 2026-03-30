const nodemailer = require('nodemailer');
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
    // Kukunin lang ang dates na VERIFIED na
    const bookings = await Booking.find({ 'status.verified': true });
    
    // I-format ang dates para maging YYYY-MM-DD
    const blockedDates = bookings.map(b => 
      new Date(b.date).toISOString().split('T')[0]
    );
    
    res.json(blockedDates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.patch('/api/bookings/confirm/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { 'status.verified': true }, 
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const mailOptions = {
      from: '"Storyline Studios" <zayofficialportfolio@gmail.com>',
      to: booking.email,
      subject: '✅ Booking Confirmed - Storyline Studios',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #ddd; border-radius: 8px;">
          <h1 style="color: #00d4ff;">Booking Confirmed!</h1>
          <p>Hi <strong>${booking.name}</strong>,</p>
          <p>Your booking for <strong>${booking.eventType}</strong> has been officially <strong>VERIFIED</strong>.</p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p>📅 <strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
            <p>📍 <strong>Location:</strong> ${booking.eventLocation}</p>
          </div>
          <p>Thank you! <br /> <strong>Storyline Studios Team</strong></p>
        </div>
      `
    };

    // 🚀 I-send na ang email
    await transporter.sendMail(mailOptions);
    
    console.log(`✅ SUCCESS: Email sent to ${booking.email}`);
    res.status(200).json({ message: 'Confirmed and Email Sent!' });

  } catch (error) {
    console.error("❌ NODEMAILER ERROR:", error);
    res.status(500).json({ message: 'Error: ' + error.message });
  }
});

    // 🚀 Ito ang magpapadala ng email
    await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent to ${booking.email}`);
    res.status(200).json({ message: 'Confirmed and Email Sent!' });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: 'Error confirming booking: ' + error.message });
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

// ✅ 3. ADMIN BOOKINGS ROUTE (DITO KUKUHA NG DATA ANG DASHBOARD)
app.get('/api/admin/bookings', async (req, res) => {
  try {
    // Kukunin lahat ng bookings mula sa pinakabago
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
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
