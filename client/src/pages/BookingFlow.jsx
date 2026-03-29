import React, { useState, useEffect } from 'react';

const BookingFlow = () => {
  const [step, setStep] = useState(1);
  const [packageSelected, setPackageSelected] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);

  useEffect(() => {
    fetch('/api/calendar')
      .then(res => res.json())
      .then(setBlockedDates)
      .catch(console.error);
  }, []);

  const packages = [
    { type: 'A', price: 2399 },
    { type: 'B', price: 4000 },
    { type: 'C', price: 6000 },
    { type: 'D', price: 7999 }
  ];

  const selectPackage = (pkg) => {
    setPackageSelected(pkg);
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-deep-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-20 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Booking - Step {step}/5
        </h1>

        {/* STEP 4: PACKAGE SELECTION */}
        {step === 4 && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold mb-12 text-center text-white">Select Your Package</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.map(pkg => (
                <div
                  key={pkg.type}
                  onClick={() => selectPackage(pkg)}
                  className={`p-8 rounded-3xl border-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    packageSelected?.type === pkg.type
                      ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/20 shadow-cyan-500/25'
                      : 'border-gray-700/50 hover:border-cyan-400/50 bg-black/50'
                  }`}
                >
                  <div className="text-4xl font-bold mb-4 text-cyan-400">
                    Package {pkg.type}
                  </div>
                  <div className="text-3xl font-bold mb-6 text-white">
                    ₱{pkg.price.toLocaleString()}
                  </div>
                  <div className={`w-full h-2 rounded-full ${
                    packageSelected?.type === pkg.type ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}></div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <p className="text-xl mb-4 text-gray-300">
                Selected: {packageSelected ? `Package ${packageSelected.type}` : 'None'}
              </p>
              <button 
                onClick={() => setStep(5)}
                disabled={!packageSelected}
                className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-white"
              >
                Next: Payment
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: PAYMENT (Dito ko nilagay ang GCash part mo) */}
        {step === 5 && (
          <div className="animate-in fade-in duration-500 text-center">
            <h2 className="text-3xl font-bold mb-8 text-white">Secure Your Date</h2>
            <div className="bg-gradient-to-br from-black/80 to-gray-900 border border-cyan-400/30 rounded-3xl p-10 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-white">Scan to Pay via GCash</h3>
              
              {/* GCash QR Image */}
              <div className="mb-8">
                <img 
                  src="IMG_7162.JPG" 
                  alt="Storyline Studios GCash QR" 
                  className="w-72 h-72 mx-auto rounded-2xl shadow-2xl border-4 border-cyan-400 bg-white p-2" 
                />
              </div>

              <div className="space-y-4 mb-10">
                <p className="text-2xl font-semibold text-cyan-400">
                  Account Name: ED****O N.
                </p>
                <p className="text-3xl font-bold text-white tracking-widest">
                  09286675952 {/* PALITAN MO ITO NG REAL NUMBER MO */}
                </p>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-2xl p-6 mb-8 text-left">
                <p className="text-gray-300 text-sm italic">
                  *Please send a screenshot of your receipt. Once verified, we will finalize your booking and give you portal access.
                </p>
              </div>

              <button 
                onClick={() => alert("Booking Submitted! Please wait for verification.")}
                className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl font-bold text-2xl shadow-xl hover:scale-105 transition-all duration-300 text-white"
              >
                I've Sent the Payment
              </button>
            </div>
            
            <button 
              onClick={() => setStep(4)}
              className="mt-8 text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Packages
            </button>
          </div>
        )}

        {/* Temporary buttons for you to test Step 4 and 5 immediately */}
        {step < 4 && (
          <div className="text-center mt-10">
            <p className="mb-4 text-gray-500">Demo Navigation:</p>
            <button onClick={() => setStep(4)} className="bg-gray-700 px-4 py-2 rounded">Go to Step 4</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
