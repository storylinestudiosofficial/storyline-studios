const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const Booking = require('./models/Booking');
const Portfolio = require('./models/Portfolio');
require('dotenv').config();

// Cloudinary Config
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const app = express();
app.use(cors());
app.use(express.json());

// 1. Static folder para sa uploaded receipts
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Multer config for receipt uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- API ROUTES (Dapat laging mauna ito bago ang Static Files) ---

app.get('/api/portfolio/:category?', async (req, res) => {
  try {
    const { category } = req.params;
    const query = category && category !== 'All' ? { category } : {};
    const portfolio = await Portfolio.find(query);
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookings', upload.single('receipt'), async (req, res) => {
  try {
    const bookingData = req.body;
    const receiptUrl = req.file ? await uploadToCloudinary(req.file.path) : null;
    
    const booking = new Booking({
      ...JSON.parse(bookingData.bookingData),
      receipt: receiptUrl
    });
    
    await booking.save();
    res.json({ success: true, bookingId: booking._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookings/verify/:id', async (req, res) => {
  const { id } = req.params;
  await Booking.findByIdAndUpdate(id, {
    'payment.retainerVerified': true,
    'payment.status.retainerVerified': true
  });
  res.json({ success: true });
});

app.get('/api/calendar', async (req, res) => {
  const bookings = await Booking.find({ 'event.date': { $exists: true } });
  const confirmedDates = bookings
    .filter(b => b.payment.retainerVerified)
    .map(b => b.event.date.toISOString().split('T')[0]);
  res.json(confirmedDates);
});

// Cloudinary Upload Function
async function uploadToCloudinary(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'storyline_receipts',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    return null;
  }
}

// --- FRONTEND SERVING (The Monolith Part) ---

const PORT = process.env.PORT || 10000;

// 2. Ituro ang Express sa folder kung nasaan ang "Build" ng React (dist)
// Dahil ang server.js ay nasa loob ng 'server' folder, kailangang lumabas (..) para mahanap ang 'client'
const distPath = path.join(__dirname, '../client/dist');

app.use(express.static(distPath));

// Lahat ng hindi API request ay ibabato sa React Frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
