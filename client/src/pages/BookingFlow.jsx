import React, { useState } from 'react';

const BookingFlow = () => {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', date: '', location: '', package: null, receiptUrl: ''
  });

  const packages = [
    { type: 'A', price: 2399, inclusions: ['Up to 6 hours', '1 Photographer', 'Unlimited'] },
    { type: 'B', price: 4000, inclusions: ['Up to 6 hours', '1 Photographer', 'Unlimited'] },
    { type: 'C', price: 6000, inclusions: ['Up to 8 hours', '1 Photographer 1 Videographer', 'Unlimited'] },
    { type: 'D', price: 7999, inclusions: ['Up to 8 hours', '1 Photographer 1 Videographer', 'Unlimited'] }
  ];

  // CLOUDINARY UPLOAD LOGIC
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "your_preset_here"); // PALITAN MO ITO NG PRESET MO
    data.append("folder", "storyline_receipts");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dhfdcigsm/image/upload", { // PALITAN MO 'YUNG your_cloud_name
        method: "POST",
        body: data
      });
      const fileData = await res.json();
      setFormData({ ...formData, receiptUrl: fileData.secure_url });
      alert("Receipt Uploaded Successfully!");
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const submitBooking = async () => {
    if (!formData.receiptUrl) return alert("Please upload your payment receipt first.");
    // Submit to your MongoDB backend here
    alert("Booking Submitted! Check your email for confirmation.");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-deep-black text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-cyan-400">Step {step} of 5</h1>

        {/* STEPS 1-3: CLIENT INFO */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold">What's your name?</h2>
            <input type="text" className="auth-input" placeholder="Full Name" onChange={(e)=>setFormData({...formData, name: e.target.value})} />
            <button onClick={()=>setStep(2)} className="auth-btn">Next</button>
          </div>
        )}

        {/* STEP 4: PACKAGES */}
        {step === 4 && (
          <div className="animate-in fade-in">
            <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Package</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map(pkg => (
                <div key={pkg.type} onClick={()=>setFormData({...formData, package: pkg})}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${formData.package?.type === pkg.type ? 'border-cyan-400 bg-cyan-950/30' : 'border-gray-800'}`}>
                  <h3 className="text-xl font-bold text-cyan-400">Package {pkg.type}</h3>
                  <p className="text-lg font-bold mb-4">₱{pkg.price.toLocaleString()}</p>
                  <ul className="text-xs text-gray-400 space-y-1">{pkg.inclusions.map(i => <li key={i}>• {i}</li>)}</ul>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-between">
              <button onClick={()=>setStep(3)} className="text-gray-400">← Back</button>
              <button onClick={()=>setStep(5)} disabled={!formData.package} className="auth-btn max-w-[200px]">Next: Payment</button>
            </div>
          </div>
        )}

        {/* STEP 5: PAYMENT & CLOUDINARY */}
        {step === 5 && (
          <div className="text-center bg-black/50 p-10 rounded-3xl border border-cyan-400/20">
            <h2 className="text-2xl font-bold mb-6">Scan to Pay via GCash</h2>
            <img src="/IMG_7162.jpg" alt="GCash QR" className="w-64 h-64 mx-auto mb-6 rounded-xl border-4 border-white" />
            <p className="text-xl font-mono text-cyan-400 mb-8 tracking-widest uppercase font-bold">09286675952</p>
            
            <div className="max-w-xs mx-auto space-y-4">
              <label className="block text-sm text-gray-400">Upload Receipt Screenshot:</label>
              <input type="file" onChange={handleFileUpload} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-cyan-500 file:text-white" />
              <button onClick={submitBooking} disabled={isUploading || !formData.receiptUrl} className="auth-btn mt-6">
                {isUploading ? "Uploading..." : "Confirm & Submit"}
              </button>
              <button onClick={()=>setStep(4)} className="block mx-auto text-gray-500 text-sm">Wait, I want to change package</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
