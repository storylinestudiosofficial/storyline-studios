import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BookingFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', 
    event: { type: 'Wedding', location: '', date: '' }
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [packageSelected, setPackageSelected] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);

  const packages = [
    { type: 'A', price: 2399, desc: '4hrs coverage + 30 Edited Photos' },
    { type: 'B', price: 4000, desc: '6hrs coverage + 50 Edited Photos' },
    { type: 'C', price: 6000, desc: '8hrs coverage + 100 Edited Photos' },
    { type: 'D', price: 7999, desc: 'Full Day + All Raw & Edited' }
  ];

  const submitBooking = async () => {
    const data = new FormData();
    data.append('bookingData', JSON.stringify({ ...formData, package: packageSelected, date: selectedDate }));
    if (receiptFile) data.append('receipt', receiptFile);

    const res = await fetch('/api/bookings', { method: 'POST', body: data });
    if (res.ok) navigate('/portal');
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-black text-white max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-10 text-cyan-400">Step {step} of 5</h1>

      {/* STEP 1: CLIENT INFO */}
      {step === 1 && (
        <div className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full p-4 bg-gray-900 border border-gray-700 rounded" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="Email Address" className="w-full p-4 bg-gray-900 border border-gray-700 rounded" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <button onClick={() => setStep(2)} className="w-full bg-cyan-500 p-4 rounded font-bold">Next</button>
        </div>
      )}

      {/* STEP 2: EVENT DETAILS */}
      {step === 2 && (
        <div className="space-y-4">
          <select className="w-full p-4 bg-gray-900 border border-gray-700 rounded" 
            onChange={(e) => setFormData({...formData, event: {...formData.event, type: e.target.value}})}>
            <option>Wedding</option><option>Birthday</option><option>Debut</option><option>Corporate</option>
          </select>
          <input type="text" placeholder="Location/Venue" className="w-full p-4 bg-gray-900 border border-gray-700 rounded" 
            onChange={(e) => setFormData({...formData, event: {...formData.event, location: e.target.value}})} />
          <button onClick={() => setStep(3)} className="w-full bg-cyan-500 p-4 rounded font-bold">Next</button>
        </div>
      )}

      {/* STEP 3: DATE */}
      {step === 3 && (
        <div className="space-y-4 text-center">
          <p className="mb-4 text-gray-400">Select your preferred date:</p>
          <input type="date" className="w-full p-4 bg-gray-900 border border-gray-700 rounded text-white" 
            onChange={(e) => setSelectedDate(e.target.value)} />
          <button onClick={() => setStep(4)} className="w-full bg-cyan-500 p-4 rounded font-bold mt-4">Confirm Date</button>
        </div>
      )}

      {/* STEP 4: PACKAGE */}
      {step === 4 && (
        <div className="space-y-4">
          {packages.map((pkg) => (
            <div key={pkg.type} onClick={() => setPackageSelected(pkg)}
              className={`p-6 border-2 rounded cursor-pointer transition ${packageSelected?.type === pkg.type ? 'border-cyan-400 bg-cyan-900/20' : 'border-gray-700'}`}>
              <h3 className="font-bold">Package {pkg.type} - ₱{pkg.price}</h3>
              <p className="text-sm text-gray-400">{pkg.desc}</p>
            </div>
          ))}
          <button onClick={() => setStep(5)} className="w-full bg-cyan-500 p-4 rounded font-bold mt-4">Next: Payment</button>
        </div>
      )}

      {/* STEP 5: PAYMENT */}
      {step === 5 && (
        <div className="space-y-6 text-center">
          <div className="bg-gray-900 p-6 rounded-xl border border-dashed border-cyan-400">
            <p className="mb-2">Send ₱1,000 Reservation Fee to:</p>
            <p className="text-2xl font-bold text-cyan-400">GCash: 0912-345-6789</p>
          </div>
          <p className="text-sm text-gray-400">Upload your screenshot here:</p>
          <input type="file" onChange={(e) => setReceiptFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"/>
          <button onClick={submitBooking} className="w-full bg-green-500 p-4 rounded font-bold text-black">Finish Booking</button>
        </div>
      )}
    </div>
  );
};

export default BookingFlow;
