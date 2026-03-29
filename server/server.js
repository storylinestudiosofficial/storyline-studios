const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Booking = require('./models/Booking');
const Portfolio = require('./models/Portfolio');
require('dotenv').config();
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/storyline-studios');

// Multer config for receipt uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Routes
app.get('/api/portfolio/:category?', async (req, res) => {
  const { category } = req.params;
  const query = category && category !== 'All' ? { category } : {};
  const portfolio = await Portfolio.find(query);
  res.json(portfolio);
});

app.post('/api/bookings', upload.single('receipt'), async (req, res) => {
  const bookingData = req.body;
  const receiptUrl = req.file ? await uploadToCloudinary(req.file.path) : null;
  
  const booking = new Booking({
    ...JSON.parse(bookingData.bookingData),
    receipt: receiptUrl
  });
  
  await booking.save();
  res.json({ success: true, bookingId: booking._id });
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
const PORT = process.env.PORT || 5000;
const path = require('path');

// Eto ang magsasabi sa server na "serve" ang frontend files
app.use(express.static(path.join(__dirname, 'client/dist'))); // O kung nasaan ang index.html mo

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});
// 1. Sabihin sa Express kung nasaan ang mga "static" files (images, css, js)
app.use(express.static(path.join(__dirname, 'dist')));

// 2. Kapag binisita ang main link, ibigay ang index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
