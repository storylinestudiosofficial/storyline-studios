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
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Booking Confirmed!</h2>
          <p>Hi ${booking.name}, verified na po ang inyong schedule.</p>
        </div>
      `
    };

    // Ito yung line 104 na nag-error
    await transporter.sendMail(mailOptions);
    
    console.log(`✅ Email sent to ${booking.email}`);
    res.status(200).json({ message: 'Confirmed and Email Sent!' });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: 'Error: ' + error.message });
  }
});
