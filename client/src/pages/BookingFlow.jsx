import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    event: { type: 'Wedding', location: '', date: '' }
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [packageSelected, setPackageSelected] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);

  // Sample Packages for Storyline Studios
  const packages = [
    { type: 'A', price: 2399, desc: '4hrs coverage, 30 Edited Photos, 1min Highlight' },
    { type: 'B', price: 4000, desc: '6hrs coverage, 50 Edited Photos, 2min Highlight' },
    { type: 'C', price: 6000, desc: '8hrs coverage, 100 Edited Photos, 5min Highlight' },
    { type: 'D', price: 7999, desc: 'Full Day Coverage, All Raw & Edited Photos' }
  ];

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const submitBooking = async () => {
    const data = new FormData();
    data.append('bookingData', JSON.stringify({
      ...formData,
      package: packageSelected,
      event: { ...formData.event, date: selectedDate }
    }));
    if (receiptFile) data.append('receipt', receiptFile);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        body: data
      });
      if (res.ok) navigate('/portal');
    } catch (err) {
      console.error("Booking failed", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-black text-white max-w-2xl mx-auto font-sans">
      {/* Progress Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
          Step {step} of 5
        </h1>
        <p className="text-gray-500 uppercase tracking-widest text-xs">Storyline Studios Booking</p>
      </div>

      {/* STEP 1: CLIENT INFO */}
      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <h2 className="text-2xl font-semibold mb-4">Tell us about you</h2>
          <input type="text" placeholder="Full Name" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-400 outline-none transition" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="Email Address" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-400 outline-none transition" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <button onClick={nextStep} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-xl font-bold hover:scale-105 transition shadow-lg">Next: Event Details</button>
        </div>
      )}

      {/* STEP 2: EVENT DETAILS */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
          <select className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none" 
            onChange={(e) => setFormData({...formData, event: {...formData.event, type: e.target.value}})}>
            <option className="bg-black">Wedding</option>
            <option className="bg-black">Birthday</option>
            <option className="bg-black">Debut</option>
            <option className="bg-black">Corporate</option>
          </select>
          <input type="text" placeholder="Venue / Location" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-400 outline-none transition" 
            onChange={(e) => setFormData({...formData, event: {...formData.event, location: e.target.value}})} />
          <div className="flex gap-4">
            <button onClick={prevStep} className="w-1/3 bg-white/10 p-4 rounded-xl font-bold">Back</button>
            <button onClick={nextStep} className="w-2/3 bg-cyan-500 p-4 rounded-xl font-bold">Next: Choose Date</button>
          </div>
        </div>
      )}

      {/* STEP 3: DATE PICKER */}
      {step === 3 && (
        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-left">When is the big day?</h2>
          <input type="date" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none" 
            onChange={(e) => setSelectedDate(e.target.value)} />
          <div className="flex gap-4 mt-8">
            <button onClick={prevStep} className="w-1/3 bg-white/10 p-4 rounded-xl font-bold">Back</button>
            <button onClick={nextStep} className="w-2/3 bg-cyan-500 p-4 rounded-xl font-bold">Confirm Date</button>
          </div>
        </div>
      )}

      {/* STEP 4: PACKAGE SELECTION */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Select your Package</h2>
          {packages.map((pkg) => (
            <div key={pkg.type} onClick={() => setPackageSelected(pkg)}
              className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${packageSelected?.type === pkg.type ? 'border-cyan-400 bg-cyan-400/10 scale-105' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">Package {pkg.type}</h3>
                <span className="text-cyan-400 font-bold">₱{pkg.price.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-400">{pkg.desc}</p>
            </div>
          ))}
          <div className="flex gap-4 mt-8">
            <button onClick={prevStep} className="w-1/3 bg-white/10 p-4 rounded-xl font-bold">Back</button>
            <button onClick={nextStep} disabled={!packageSelected} className="w-2/3 bg-cyan-500 p-4 rounded-xl font-bold disabled:opacity-50">Next: Payment</button>
          </div>
        </div>
      )}

      {/* STEP 5: PAYMENT & UPLOAD */}
      {step === 5 && (
        <div className="space-y-8 text-center">
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-cyan-400/30 shadow-2xl">
            <p className="text-gray-400 mb-2">Send ₱1,000 Reservation Fee to:</p>
            <h3 className="text-3xl font-bold text-cyan-400 mb-1">GCASH</h3>
            <p className="text-2xl font-mono tracking-tighter">09286675952</p>
            <p className="text-sm text-gray-500 mt-4 italic">Note: Screenshot of receipt is required to lock your date.</p>
          </div>
          
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-400 mb-2">Upload Proof of Payment</label>
            <input type="file" accept="image/*" onChange={(e) => setReceiptFile(e.target.files[0])} 
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-black hover:file:bg-cyan-400 cursor-pointer"/>
          </div>

          <div className="flex gap-4">
            <button onClick={prevStep} className="w-1/3 bg-white/10 p-4 rounded-xl font-bold">Back</button>
            <button onClick={submitBooking} disabled={!receiptFile} className="w-2/3 bg-green-500 p-4 rounded-xl font-bold text-black hover:bg-green-400 disabled:opacity-50 transition">Confirm & Finish</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingFlow;
