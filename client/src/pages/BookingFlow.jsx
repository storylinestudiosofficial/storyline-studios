import React, { useState, useEffect } from 'react';

const BookingFlow = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', date: '', location: '' });
  const [packageSelected, setPackageSelected] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const packages = [
    { type: 'A', price: 2399, inclusions: ['2 Hours Session', '1 Photographer', '10 Edited Photos'] },
    { type: 'B', price: 4000, inclusions: ['4 Hours Session', '1 Photographer', '20 Edited Photos'] },
    { type: 'C', price: 6000, inclusions: ['Full Day Session', '2 Photographers', '50 Edited Photos'] },
    { type: 'D', price: 7999, inclusions: ['Unlimited Time', '3 Photographers', 'All Raw + Edited'] }
  ];

  const handleUpload = async () => {
    if (!receipt) return alert("Please select a receipt photo first!");
    setIsUploading(true);
    
    // Dito papasok ang Cloudinary Logic (Mock-up for now)
    setTimeout(() => {
      setIsUploading(false);
      alert("Booking & Receipt Submitted! Check your email for confirmation.");
      window.location.href = "/";
    }, 2000);
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-deep-black text-white">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="w-full bg-gray-800 h-2 rounded-full mb-10">
          <div className="bg-cyan-400 h-2 rounded-full transition-all duration-500" style={{width: `${(step/5)*100}%`}}></div>
        </div>

        {/* STEP 1-3: CLIENT INFO (Kailangang masagutan muna) */}
        {step < 4 && (
          <div className="space-y-6 bg-black/40 p-10 rounded-3xl border border-white/5">
            <h2 className="text-3xl font-bold mb-8">Client Information</h2>
            <input type="text" placeholder="Full Name" className="auth-input" onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input type="email" placeholder="Email Address" className="auth-input" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <div className="flex gap-4">
               <button onClick={() => setStep(step + 1)} className="auth-btn">Next Step</button>
            </div>
          </div>
        )}

        {/* STEP 4: PACKAGES */}
        {step === 4 && (
          <div>
            <h2 className="text-3xl font-bold mb-12 text-center">Select Your Package</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map(pkg => (
                <div key={pkg.type} onClick={() => setPackageSelected(pkg)}
                  className={`p-6 rounded-3xl border-4 transition-all duration-300 ${packageSelected?.type === pkg.type ? 'border-cyan-400 bg-cyan-900/20' : 'border-gray-800'}`}>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-2">Package {pkg.type}</h3>
                  <p className="text-xl font-bold mb-4">₱{pkg.price.toLocaleString()}</p>
                  <ul className="text-xs text-gray-400 space-y-2">{pkg.inclusions.map(i => <li key={i}>• {i}</li>)}</ul>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-between">
              <button onClick={() => setStep(3)} className="text-gray-400 hover:text-white">← Back</button>
              <button onClick={() => setStep(5)} disabled={!packageSelected} className="auth-btn max-w-xs">Next: Payment</button>
            </div>
          </div>
        )}

        {/* STEP 5: PAYMENT & RECEIPT */}
        {step === 5 && (
          <div className="text-center bg-black/60 p-10 rounded-3xl border border-cyan-400/30">
            <h2 className="text-3xl font-bold mb-8">Payment via GCash</h2>
            <img src="/IMG_7162..jpg" alt="GCash QR" className="w-64 h-64 mx-auto mb-6 rounded-xl border-4 border-white bg-white p-1" />
            <p className="text-2xl font-bold text-cyan-400 mb-8">09286675952</p>
            
            <div className="space-y-4 max-w-sm mx-auto">
              <p className="text-sm text-gray-400">Upload Receipt Screenshot:</p>
              <input type="file" onChange={(e) => setReceipt(e.target.files[0])} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-cyan-500 file:text-white" />
              <button onClick={handleUpload} disabled={isUploading} className="auth-btn mt-6">
                {isUploading ? "Uploading..." : "Submit Booking"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
