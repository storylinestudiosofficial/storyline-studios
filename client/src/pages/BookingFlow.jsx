import React, { useState, useEffect } from 'react';

const BookingFlow = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', location: '',
    eventType: '', age: '', date: '', eventLocation: ''
  });
  const [packageSelected, setPackageSelected] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptUrl, setReceiptUrl] = useState(''); // ✅ Cloudinary URL
  const [isUploading, setIsUploading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);

  // Packages
  const packages = [
    { type: 'A', price: 2399, inclusions: ['1 Photographer', '2hrs', '10 photos', '30s reel'] },
    { type: 'B', price: 4000, inclusions: ['1 Photographer', '4hrs', '25 photos', '1min reel'] },
    { type: 'C', price: 6000, inclusions: ['2 Photographers', '6hrs', '50 photos', '2min reel'] },
    { type: 'D', price: 7999, inclusions: ['2+Video', '8hrs', '100 photos', '5min reel'] }
  ];

  useEffect(() => {
    fetch('/api/calendar')
      .then(res => res.json())
      .then(setBlockedDates)
      .catch(console.error);
  }, []);

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => step < 5 && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);

  // ✅ FIXED: Cloudinary Receipt Upload
  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    console.log('📤 Uploading receipt:', file.name);

    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', 'storyline_receipts'); // Your Cloudinary preset

    try {
      // ✅ CLOUDINARY DIRECT UPLOAD (Unsigned)
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dhfdcigsm`, // REPLACE with YOUR_CLOUD_NAME
        {
          method: 'POST',
          body: uploadData
        }
      );
      
      const data = await response.json();
      if (data.secure_url) {
        setReceiptUrl(data.secure_url);
        setReceiptFile(file);
        console.log('✅ Cloudinary URL:', data.secure_url);
      } else {
        throw new Error('No secure_url in response');
      }
    } catch (error) {
      console.error('❌ Upload failed:', error);
      alert('Receipt upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ FIXED: Complete Booking Submit
  const submitBooking = async () => {
    if (!receiptUrl || !packageSelected || !formData.name || !formData.email) {
      alert('Please complete all required fields and upload receipt');
      return;
    }

    setIsUploading(true);
    console.log('🚀 Submitting booking...');

    const bookingData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      eventLocation: formData.eventLocation,
      eventType: formData.eventType,
      age: formData.age || null,
      package: packageSelected,
      receiptUrl: receiptUrl,  // ✅ From Cloudinary
      total: packageSelected.price
    };

    console.log('📤 Booking data:', bookingData);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log('✅ Booking SUCCESS:', result);
        setSubmitSuccess(true);
        alert('🎉 Booking confirmed! Redirecting to home...');
        
        // ✅ SUCCESS REDIRECT
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
        
      } else {
        throw new Error(result.error || 'Booking failed');
      }
    } catch (error) {
      console.error('❌ Submit error:', error);
      alert(`Booking failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 max-w-4xl mx-auto bg-deep-black">
      {/* Step Progress */}
      <div className="flex justify-center mb-20 gap-3">
        {[1,2,3,4,5].map(s => (
          <div key={s} className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg transition-all duration-300 ${
            s === step ? 'bg-gradient-to-r from-cyan-500 to-blue-600 scale-110 shadow-cyan-500/50' :
            s < step ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-gray-800 border-2 border-gray-600'
          }`}>
            {s}
          </div>
        ))}
      </div>

      {/* STEPS 1-4 (Abbreviated - same as previous) */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Step 1: Your Info</h2>
          <input placeholder="Full Name *" onChange={e => updateField('name', e.target.value)} className="w-full p-5 rounded-2xl border border-cyan-400/30 bg-black/50 focus:border-cyan-400 text-lg" />
          <input type="email" placeholder="Email *" onChange={e => updateField('email', e.target.value)} className="w-full p-5 rounded-2xl border border-cyan-400/30 bg-black/50 focus:border-cyan-400 text-lg" />
          <input type="tel" placeholder="Phone *" onChange={e => updateField('phone', e.target.value)} className="w-full p-5 rounded-2xl border border-cyan-400/30 bg-black/50 focus:border-cyan-400 text-lg" />
          <div className="flex gap-4">
            <button onClick={prevStep} className="flex-1 p-4 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold">← Back</button>
            <button onClick={nextStep} className="flex-1 p-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl font-semibold shadow-lg">Next →</button>
          </div>
        </div>
      )}

      {/* STEP 2, 3, 4 - Same structure as Step 1 (abbreviated for brevity) */}
      {step === 2 && <div>Event Details Form</div>}
      {step === 3 && <div>Date Picker</div>}
      {step === 4 && (
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {packages.map(pkg => (
            <div key={pkg.type} onClick={() => setPackageSelected(pkg)} className={`p-8 rounded-3xl cursor-pointer hover:scale-105 transition-all border-4 ${
              packageSelected?.type === pkg.type ? 'border-cyan-400 bg-cyan-500/20 shadow-2xl' : 'border-gray-700 hover:border-cyan-400 bg-black/50'
            }`}>
              <div className="text-3xl font-bold mb-4 text-cyan-400">Package {pkg.type}</div>
              <div className="text-2xl font-bold mb-6 text-white">₱{pkg.price}</div>
              <ul className="space-y-2 mb-8">
                {pkg.inclusions.map(i => <li key={i} className="flex items-center"><span className="w-2 h-2 bg-cyan-400 rounded mr-3" />{i}</li>)}
              </ul>
            </div>
          ))}
          <div className="col-span-full flex gap-4 justify-center mt-12">
            <button onClick={prevStep} className="px-12 py-4 bg-gray-800 hover:bg-gray-700 rounded-2xl font-bold">← Back</button>
            <button onClick={nextStep} disabled={!packageSelected} className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 disabled:opacity-50 rounded-2xl font-bold shadow-xl">Payment →</button>
          </div>
        </div>
      )}

      {/* ✅ STEP 5: PAYMENT - FULLY FIXED */}
      {step === 5 && (
        <div className="max-w-2xl mx-auto space-y-8 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Final Step: Secure Payment
          </h2>

          {/* ✅ FIXED QR CODE PATH */}
          <div className="p-8 bg-emerald-500/10 border-2 border-emerald-400/30 rounded-3xl">
            <h3 className="text-2xl font-bold text-emerald-400 mb-6">Scan QR → Pay ₱1,000</h3>
            <img 
              src="/IMG_7162.jpg"  // ✅ EXACT FILENAME - Vite public/ works perfectly
              alt="Storyline Studios GCash QR Code"
              className="w-80 h-80 mx-auto rounded-2xl shadow-2xl border-4 border-white/30 object-contain"
              onError={(e) => {
                console.log('QR load failed - using fallback');
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="hidden bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-2xl border-2 border-gray-600 mt-4 mx-auto max-w-md">
              <div className="text-lg font-bold mb-2">QR Code Loading...</div>
              <div className="text-sm text-gray-400">Please wait or contact us</div>
            </div>
            <div className="mt-6 p-4 bg-black/50 rounded-xl">
              <div className="font-bold text-emerald-300">Storyline Studios</div>
              <div className="text-sm text-gray-300">09xxxxxxxxx</div>
            </div>
          </div>

          {/* Receipt Upload */}
          <div className="p-8 bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-2 border-purple-400/30 rounded-3xl">
            <label className="block text-2xl font-bold text-purple-400 mb-6">📸 Upload Receipt</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleReceiptUpload}
              disabled={isUploading}
              className="w-full p-6 border-2 border-dashed border-purple-500/50 rounded-2xl bg-black/50 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:font-semibold file:bg-gradient-to-r file:from-purple-500 file:to-purple-600 file:text-white hover:file:from-purple-600 hover:file:to-purple-700 text-lg"
            />
            
            {/* ✅ UPLOAD STATUS */}
            {isUploading && (
              <div className="mt-4 p-4 bg-blue-500/20 border border-blue-400 rounded-xl animate-pulse">
                <div className="flex items-center">
                  <div className="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full mr-3" />
                  <span className="font-semibold text-blue-300">Uploading to Cloudinary...</span>
                </div>
              </div>
            )}
            
            {receiptUrl && (
              <div className="mt-4 p-4 bg-green-500/20 border-2 border-green-400/50 rounded-xl">
                <div className="font-bold text-green-400 mb-1">✅ Receipt Uploaded!</div>
                <div className="text-green-300 text-sm break-all">{receiptUrl}</div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={prevStep}
              className="flex-1 py-5 px-8 bg-gray-800/70 hover:bg-gray-700 border border-gray-600/50 rounded-2xl font-bold text-xl transition-all backdrop-blur-sm"
            >
              ← Back to Packages
            </button>
            <button
              onClick={submitBooking}
              disabled={!receiptUrl || isUploading || !packageSelected}
              className="flex-1 py-5 px-8 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-emerald-400/50 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center"
            >
              {isUploading ? (
                <>
                  <span className="animate-spin mr-3">⏳</span>
                  Processing...
                </>
              ) : (
                '✅ Confirm & Reserve Slot'
              )}
            </button>
          </div>

          {submitSuccess && (
            <div className="p-8 bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-4 border-green-400/50 rounded-3xl text-center animate-pulse">
              <div className="text-2xl font-bold text-green-400 mb-4">🎉 SUCCESS!</div>
              <div className="text-green-300">Booking confirmed. Redirecting...</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingFlow;
