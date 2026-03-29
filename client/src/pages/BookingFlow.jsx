import React, { useState, useEffect } from 'react';

const BookingFlow = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    eventType: '', age: '', date: '', eventLocation: ''
  });
  const [packageSelected, setPackageSelected] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptUrl, setReceiptUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);

  // Packages with inclusions
  const packages = [
    { 
      type: 'A', price: 2399, 
      inclusions: ['1 Photographer', '2 hours coverage', '10 edited photos', '30-sec highlight reel'] 
    },
    { 
      type: 'B', price: 4000, 
      inclusions: ['1 Photographer', '4 hours coverage', '25 edited photos', '1-min highlight reel'] 
    },
    { 
      type: 'C', price: 6000, 
      inclusions: ['2 Photographers', '6 hours coverage', '50 edited photos', '2-min highlight reel'] 
    },
    { 
      type: 'D', price: 7999, 
      inclusions: ['2 Photographers + Videographer', '8 hours coverage', '100 edited photos', '5-min cinematic reel'] 
    }
  ];

  useEffect(() => {
    // Fetch blocked dates
    fetch('/api/calendar')
      .then(res => res.json())
      .then(setBlockedDates)
      .catch(console.error);
  }, []);

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    // Validation
    if (step === 1 && (!formData.name || !formData.email || !formData.phone)) {
      alert('Please fill all fields');
      return;
    }
    if (step === 2 && (!formData.eventType || !formData.eventLocation)) {
      alert('Please select event type and location');
      return;
    }
    if (step === 3 && !formData.date) {
      alert('Please select a date');
      return;
    }
    if (step === 4 && !packageSelected) {
      alert('Please select a package');
      return;
    }
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => step > 1 && setStep(step - 1);

  // Cloudinary upload
  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', 'storyline_receipts'); // Your preset

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/democloudname/image/upload`, // REPLACE YOUR_CLOUD_NAME
        { method: 'POST', body: uploadData }
      );
      const data = await response.json();
      setReceiptUrl(data.secure_url);
      setReceiptFile(file);
    } catch (error) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Final booking submit
  const submitBooking = async () => {
    if (!receiptUrl) {
      alert('Please upload receipt first');
      return;
    }

    const bookingData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      eventLocation: formData.eventLocation,
      eventType: formData.eventType,
      age: formData.age || null,
      package: packageSelected,
      receiptUrl,
      total: packageSelected.price
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (res.ok) {
        alert('✅ Booking confirmed! Redirecting...');
        window.location.href = '/';
      } else {
        alert('Booking failed');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="flex justify-center mb-20 gap-4">
        {[1,2,3,4,5].map(s => (
          <div key={s} className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl transition-all ${
            s === step ? 'bg-gradient-to-r from-cyan-500 to-blue-600 scale-110 shadow-cyan-500/50' :
            s < step ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-gray-800 border-2 border-gray-600'
          }`}>
            {s}
          </div>
        ))}
      </div>

      {/* ✅ STEP 1: Client Information - FULL FORM */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-12">
            Step 1/5: Your Information
          </h2>
          <input 
            placeholder="Full Name *" 
            value={formData.name}
            onChange={e => updateField('name', e.target.value)}
            className="w-full p-6 text-xl rounded-3xl border-2 border-cyan-400/30 bg-black/50 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all"
            required 
          />
          <input 
            type="email" 
            placeholder="Email Address *" 
            value={formData.email}
            onChange={e => updateField('email', e.target.value)}
            className="w-full p-6 text-xl rounded-3xl border-2 border-cyan-400/30 bg-black/50 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all"
            required 
          />
          <input 
            type="tel" 
            placeholder="Phone Number *" 
            value={formData.phone}
            onChange={e => updateField('phone', e.target.value)}
            className="w-full p-6 text-xl rounded-3xl border-2 border-cyan-400/30 bg-black/50 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all"
            required 
          />
          <div className="flex gap-4 pt-8">
            <button 
              onClick={prevStep} 
              className="flex-1 py-6 px-8 bg-gray-800/50 hover:bg-gray-700 border-2 border-gray-600/50 rounded-3xl font-bold text-xl transition-all backdrop-blur-sm hover:scale-105"
            >
              ← Back
            </button>
            <button 
              onClick={nextStep} 
              className="flex-1 py-6 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-3xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              Next: Event Details →
            </button>
          </div>
        </div>
      )}

      {/* ✅ STEP 2: Event Details - FULL FORM */}
      {step === 2 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-12">
            Step 2/5: Event Details
          </h2>
          <select 
            value={formData.eventType}
            onChange={e => updateField('eventType', e.target.value)}
            className="w-full p-6 text-xl rounded-3xl border-2 border-cyan-400/30 bg-black/50 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all appearance-none"
            required
          >
            <option value="">Select Event Type</option>
            <option value="Wedding">Wedding</option>
            <option value="Debut">Debut</option>
            <option value="Birthday">Birthday</option>
            <option value="Proposal">Proposal</option>
            <option value="Corporate">Corporate Event</option>
            <option value="Portrait">Portrait Session</option>
            <option value="Prenup">Prenup/Shoot</option>
          </select>
          
          {formData.eventType === 'Birthday' && (
            <input 
              type="number" 
              placeholder="Age (optional)" 
              value={formData.age}
              onChange={e => updateField('age', e.target.value)}
              className="w-full p-6 text-xl rounded-3xl border-2 border-cyan-400/30 bg-black/50 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all"
            />
          )}
          
          <input 
            placeholder="Event Location / Venue *" 
            value={formData.eventLocation}
            onChange={e => updateField('eventLocation', e.target.value)}
            className="w-full p-6 text-xl rounded-3xl border-2 border-cyan-400/30 bg-black/50 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all"
            required
          />
          
          <div className="flex gap-4 pt-8">
            <button 
              onClick={prevStep} 
              className="flex-1 py-6 px-8 bg-gray-800/50 hover:bg-gray-700 border-2 border-gray-600/50 rounded-3xl font-bold text-xl transition-all backdrop-blur-sm hover:scale-105"
            >
              ← Back
            </button>
            <button 
              onClick={nextStep} 
              className="flex-1 py-6 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-3xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              Next: Select Date →
            </button>
          </div>
        </div>
      )}

      {/* ✅ STEP 3: Date Selection - FULL DATE PICKER */}
      {step === 3 && (
        <div className="max-w-2xl mx-auto text-center space-y-12">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-8">
            Step 3/5: Choose Your Date
          </h2>
          
          <div className="p-12 bg-black/50 border-4 border-cyan-400/30 rounded-4xl backdrop-blur-xl">
            <label className="block text-2xl font-bold text-cyan-400 mb-8">Select Available Date</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={e => updateField('date', e.target.value)}
              min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Tomorrow minimum
              className="w-full max-w-md mx-auto block p-8 text-3xl text-center bg-black/70 border-4 border-cyan-400/50 rounded-3xl focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/30 transition-all shadow-2xl"
              required
            />
            
            {blockedDates.length > 0 && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-400/50 rounded-2xl text-red-300 text-sm">
                ⚠️ {blockedDates.length} date(s) unavailable (already booked)
              </div>
            )}
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={prevStep} 
              className="flex-1 py-6 px-8 bg-gray-800/50 hover:bg-gray-700 border-2 border-gray-600/50 rounded-3xl font-bold text-xl transition-all backdrop-blur-sm hover:scale-105"
            >
              ← Back
            </button>
            <button 
              onClick={nextStep} 
              className="flex-1 py-6 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-3xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              Next: Choose Package →
            </button>
          </div>
        </div>
      )}

      {/* ✅ STEP 4: Package Selection - FULL PACKAGE CARDS */}
      {step === 4 && (
        <div className="space-y-16">
          <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Step 4/5: Select Your Package
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {packages.map(pkg => (
              <div
                key={pkg.type}
                className={`group p-8 rounded-3xl cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl border-4 ${
                  packageSelected?.type === pkg.type
                    ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/30 to-blue-500/20 shadow-[0_0_50px_rgba(0,212,255,0.3)]'
                    : 'border-gray-700/50 hover:border-cyan-400/70 bg-black/50'
                }`}
                onClick={() => setPackageSelected(pkg)}
              >
                <div className="text-4xl font-black mb-6 text-cyan-400">{pkg.type}</div>
                <div className="text-3xl font-bold mb-8 text-white drop-shadow-lg">₱{pkg.price.toLocaleString()}</div>
                <ul className="space-y-3 mb-10 text-lg group-hover:text-cyan-200 transition-all duration-300">
                  {pkg.inclusions.map((item, i) => (
                    <li key={i} className="flex items-center">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full mr-4 flex-shrink-0 shadow-lg" />
                      {item}
                    </li>
                  ))}
                </ul>
                {packageSelected?.type === pkg.type && (
                  <div className="w-full h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg" />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex gap-6 justify-center">
            <button 
              onClick={prevStep} 
              className="px-16 py-6 bg-gray-800/50 hover:bg-gray-700 border-2 border-gray-600/50 rounded-3xl font-bold text-xl transition-all backdrop-blur-sm hover:scale-105 shadow-xl"
            >
              ← Back to Date
            </button>
            <button 
              onClick={nextStep} 
              disabled={!packageSelected}
              className="px-20 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-3xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
            >
              Payment → Secure Slot
            </button>
          </div>
        </div>
      )}

      {/* ✅ STEP 5: Payment - FULL QR + CLOUDINARY UPLOAD */}
      {step === 5 && (
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-600 bg-clip-text text-transparent drop-shadow-2xl">
            Final Step: Secure Your Reservation
          </h2>

          {/* Package Summary */}
          <div className="p-8 bg-gradient-to-br from-black/60 to-gray-900/60 border-2 border-cyan-400/40 rounded-3xl backdrop-blur-xl">
            <h3 className="text-2xl font-bold text-cyan-400 mb-6">Your Selection:</h3>
            <div className="grid md:grid-cols-2 gap-6 text-xl">
              <div>📅 {new Date(formData.date).toLocaleDateString()}</div>
              <div>📍 {formData.eventLocation}</div>
              <div>🎁 Package {packageSelected?.type}</div>
              <div>💰 ₱{packageSelected?.price?.toLocaleString()}</div>
            </div>
          </div>

          {/* GCash QR Code */}
          <div className="p-10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-4 border-emerald-400/40 rounded-4xl backdrop-blur-xl">
            <h3 className="text-3xl font-bold text-emerald-400 mb-8 text-center">Scan QR → Pay ₱1,000 Reservation Fee</h3>
            
            <div className="flex flex-col items-center">
              {/* ✅ FIXED QR CODE - EXACT PATH */}
              <img 
                src="/IMG_7162.jpg"
                alt="Storyline Studios GCash QR Code"
                className="w-96 h-96 rounded-3xl shadow-2xl border-8 border-white/20 object-contain mx-auto mb-6 hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  console.warn('QR image failed to load');
                  e.target.src = 'https://via.placeholder.com/384x384/1e293b/00d4ff?text=GCash+QR+Code';
                }}
              />
              <div className="text-center p-6 bg-black/
