// ✅ UPDATED BOOKING SCHEMA
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  date: String,
  eventLocation: String,
  eventType: String,
  package: Object,
  receiptUrl: String, // Dito mase-save yung link galing Cloudinary
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// ✅ SIMPLE POST ROUTE (No Multer needed here)
app.post('/api/bookings', async (req, res) => {
  try {
    // Ang req.body ay lisi na ng lahat ng info kasama ang receiptUrl
    const newBooking = new Booking(req.body);
    await newBooking.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Booking saved to MongoDB!', 
      data: newBooking 
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: error.message });
  }
});
