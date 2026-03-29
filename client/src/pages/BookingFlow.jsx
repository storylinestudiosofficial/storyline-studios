import React, { useState, useEffect } from 'react';

const BookingFlow = () => {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState('');
  const [packageSelected, setPackageSelected] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', date: '', eventLocation: '', eventType: '', age: ''
  });

  const packages = [
    { type: 'A', price: 2399, inclusions: ['1 Photographer', '2hrs coverage', '10 edited photos'] },
    { type: 'B', price: 4000, inclusions: ['1 Photographer', '4hrs coverage', '25 edited photos'] },
    { type: 'C', price: 6000, inclusions: ['2 Photographers', '6hrs coverage', '50 edited photos'] },
    { type: 'D', price: 7999, inclusions: ['2 Photographers + Video', '8hrs coverage', 'All raw files'] }
  ];

  const updateField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'storyline_receipts'); 

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`, {
        method: 'POST',
        body: data
      });
      const fileData = await res.json();
      if (fileData.secure_url) {
        setReceiptUrl(fileData.secure_url);
        console.log("Upload Success:", fileData.secure_url);
      }
    } catch (err) {
      alert("Upload failed. Check your internet.");
    } finally {
      setIsUploading(false);
    }
  };

  const submitBooking = async () => {
    // 1. Siguraduhin na nakuha lahat ng data
    const bookingData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      eventLocation: formData.eventLocation,
      eventType: formData.eventType,
      package: {
        type: packageSelected.type,
        price: packageSelected.price,
        inclusions: packageSelected.inclusions || []
      },
      receiptUrl: receiptUrl,
      age: formData.age ? parseInt(formData.age) : 0,
      total: packageSelected.price
    };

    setIsUploading(true);
    console.log('🚀 Sending this to server:', bookingData);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('🎉 Booking confirmed! Returning to home...');
        window.location.href = '/';
      } else {
        // Kung may error sa server, lilitaw dito
        alert('❌ Server Error: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      alert('❌ Failed to connect to server. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 max-w-2xl mx-auto text-white">
      {/* Progress Bar */}
      <div className="flex justify-between mb-10 text-xs font-bold">
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center ${step === s ? 'bg-cyan-500' : 'bg-gray-800'}`}>{s}</div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Step 1: Contact Info</h2>
          <input className="auth-input" placeholder="Full Name" onChange={e => updateField('name', e.target.value)} />
          <input className="auth-input" placeholder="Email" onChange={e => updateField('email', e.target.value)} />
          <input className="auth-input" placeholder="Phone" onChange={e => updateField('phone', e.target.value)} />
          <button onClick={nextStep} className="auth-btn">Next</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Step 2: Event Details</h2>
          <input className="auth-input" placeholder="Event Type (e.g. Wedding)" onChange={e => updateField('eventType', e.target.value)} />
          <input className="auth-input" placeholder="Event Location" onChange={e => updateField('eventLocation', e.target.value)} />
          <div className="flex gap-2">
            <button onClick={prevStep} className="auth-btn bg-gray-700">Back</button>
            <button onClick={nextStep} className="auth-btn">Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Step 3: Pick a Date</h2>
          <input type="date" className="auth-input" onChange={e => updateField('date', e.target.value)} />
          <div className="flex gap-2">
            <button onClick={prevStep} className="auth-btn bg-gray-700">Back</button>
            <button onClick={nextStep} className="auth-btn">Next</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Step 4: Select Package</h2>
          {packages.map(pkg => (
            <div key={pkg.type} onClick={() => setPackageSelected(pkg)} className={`p-4 border-2 rounded-xl cursor-pointer ${packageSelected?.type === pkg.type ? 'border-cyan-500 bg-cyan-900/20' : 'border-gray-700'}`}>
              <h3 className="font-bold">Package {pkg.type} - ₱{pkg.price}</h3>
            </div>
          ))}
          <div className="flex gap-2">
            <button onClick={prevStep} className="auth-btn bg-gray-700">Back</button>
            <button onClick={nextStep} disabled={!packageSelected} className="auth-btn">Next</button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-bold text-emerald-400">Step 5: Payment</h2>
          <div className="p-4 bg-white/10 rounded-xl">
            <img src="/IMG_7162.jpg" alt="GCash QR" className="w-64 h-64 mx-auto rounded-lg" />
            <p className="mt-2 text-sm text-gray-400">Pay ₱1,000 to reserve your slot</p>
          </div>
          <input type="file" onChange={handleReceiptUpload} className="auth-input" />
          {receiptUrl && <p className="text-green-400">✅ Receipt uploaded!</p>}
          <div className="flex gap-2">
            <button onClick={prevStep} className="auth-btn bg-gray-700">Back</button>
            <button onClick={submitBooking} disabled={!receiptUrl || isUploading} className="auth-btn bg-emerald-600">
              {isUploading ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingFlow;
