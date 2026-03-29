import React, { useState, useEffect } from 'react';

const BookingFlow = () => {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptUrl, setReceiptUrl] = useState('');
  const [packageSelected, setPackageSelected] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', date: '', eventLocation: '', eventType: ''
  });

  const packages = [
    { type: 'A', price: 2399, inclusions: ['1 Photographer', '2hrs coverage', '10 edited photos'] },
    { type: 'B', price: 4000, inclusions: ['1 Photographer', '4hrs coverage', '25 edited photos'] },
    { type: 'C', price: 6000, inclusions: ['2 Photographers', '6hrs coverage', '50 edited photos'] },
    { type: 'D', price: 7999, inclusions: ['2 Photographers + Video', '8hrs coverage', 'All raw files'] }
  ];

  const updateField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // CLOUDINARY UPLOAD LOGIC
  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReceiptFile(file);
    setIsUploading(true);

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'storyline_receipts'); // SIGURADUHIN NA TAMA ITO SA CLOUDINARY MO

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`, { // PALITAN MO YUNG YOUR_CLOUD_NAME
        method: 'POST',
        body: data
      });
      const fileData = await res.json();
      setReceiptUrl(fileData.secure_url);
    } catch (err) {
      alert("Upload failed. Check your internet or Cloudinary settings.");
    } finally {
      setIsUploading(false);
    }
  };

  const submitPayment = async () => {
    if (!receiptUrl) return alert("Please wait for the receipt to finish uploading.");
    
    const finalData = { ...formData, package: packageSelected, receiptUrl };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });
      if (res.ok) {
        alert("✅ Slot Reserved! See you at the shoot!");
        window.location.href = "/";
      }
    } catch (err) {
      alert("Error saving booking.");
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 max-w-4xl mx-auto text-white">
      {/* STEP 1: NAME */}
      {step === 1 && (
        <div className="space-y-6 text-center">
          <h2 className="text-4xl font-bold">Step 1: Your Name</h2>
          <input className="auth-input" placeholder="Full Name" onChange={e => updateField('name', e.target.value)} />
          <button onClick={nextStep} className="auth-btn">Next</button>
        </div>
      )}

      {/* STEP 2: CONTACT */}
      {step === 2 && (
        <div className="space-y-6 text-center">
          <h2 className="text-4xl font-bold">Step 2: Contact Info</h2>
          <input className="auth-input" placeholder="Email" onChange={e => updateField('email', e.target.value)} />
          <input className="auth-input" placeholder="Phone" onChange={e => updateField('phone', e.target.value)} />
          <div className="flex gap-4">
            <button onClick={prevStep} className="bg-gray-700 p-4 rounded-xl flex-1">Back</button>
            <button onClick={nextStep} className="auth-btn flex-1">Next</button>
          </div>
        </div>
      )}

      {/* STEP 3: EVENT DETAILS */}
      {step === 3 && (
        <div className="space-y-6 text-center">
          <h2 className="text-4xl font-bold">Step 3: Event Details</h2>
          <input type="date" className="auth-input" onChange={e => updateField('date', e.target.value)} />
          <input className="auth-input" placeholder="Location" onChange={e => updateField('eventLocation', e.target.value)} />
          <div className="flex gap-4">
            <button onClick={prevStep} className="bg-gray-700 p-4 rounded-xl flex-1">Back</button>
            <button onClick={nextStep} className="auth-btn flex-1">Next</button>
          </div>
        </div>
      )}

      {/* STEP 4: PACKAGES */}
      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-center">Step 4: Select Package</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {packages.map(pkg => (
              <div key={pkg.type} onClick={() => setPackageSelected(pkg)} className={`p-6 border-2 rounded-2xl cursor-pointer ${packageSelected?.type === pkg.type ? 'border-cyan-400 bg-cyan-900/20' : 'border-gray-800'}`}>
                <h3 className="text-2xl font-bold">Package {pkg.type}</h3>
                <p className="text-xl">₱{pkg.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <button onClick={prevStep} className="bg-gray-700 p-4 rounded-xl flex-1">Back</button>
            <button onClick={nextStep} disabled={!packageSelected} className="auth-btn flex-1">Next to Payment</button>
          </div>
        </div>
      )}

      {/* STEP 5: PAYMENT (ITO YUNG PINAKITA MO) */}
      {step === 5 && (
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center bg-emerald-400 bg-clip-text text-transparent">
            💳 Secure Your ₱1,000 Reservation
          </h2>
          <div className="text-center p-8 bg-black/50 border-2 border-emerald-400/30 rounded-3xl">
            <img src="/IMG_7162.jpg" alt="QR Code" className="w-72 h-72 mx-auto rounded-2xl mb-6" />
            <div className="text-lg text-emerald-300">Storyline Studios | 09286675952</div>
          </div>
          <div className="p-8 border-2 border-purple-500/30 rounded-3xl text-center">
            <label className="block text-xl font-bold mb-4 text-purple-400">Upload Receipt Screenshot</label>
            <input type="file" onChange={handleReceiptUpload} className="w-full" required />
            {receiptFile && <p className="mt-2 text-green-400">✅ {receiptFile.name}</p>}
          </div>
          <div className="flex gap-4">
            <button onClick={prevStep} className="bg-gray-700 p-4 rounded-xl flex-1">Back</button>
            <button onClick={submitPayment} disabled={!receiptUrl || isUploading} className="auth-btn flex-1">
              {isUploading ? "Uploading..." : "Confirm & Reserve Slot"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingFlow; // ✅ CRITICAL: ITO ANG EXIT DOOR NG CODE MO
