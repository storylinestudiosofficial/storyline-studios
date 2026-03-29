import React, { useState } from "react";

export default function BookingFlow() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    eventLocation: "",
    eventType: "",
    age: "",
  });

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [receipt, setReceipt] = useState(null);

  // 🔹 Packages
  const packages = [
    {
      type: "Basic",
      price: 5000,
      inclusions: ["2 Hours Shoot", "50 Edited Photos"],
    },
    {
      type: "Standard",
      price: 10000,
      inclusions: ["4 Hours Shoot", "100 Edited Photos", "Highlight Video"],
    },
    {
      type: "Premium",
      price: 20000,
      inclusions: ["Whole Day Coverage", "Full Video", "Unlimited Photos"],
    },
  ];

  // 🔹 Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Cloudinary Upload (FETCH)
  const uploadToCloudinary = async () => {
    if (!receipt) throw new Error("Please upload your receipt");

    const data = new FormData();
    data.append("file", receipt);
    data.append("upload_preset", "storyline_receipts"); 

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dhfdcigsm/image/upload", // 🔴 PALITAN MO ITO NG CLOUD NAME MO
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error?.message || "Cloudinary upload failed");
    }

    return result.secure_url;
  };

  // 🔹 Submit Booking
  const submitBooking = async () => {
    try {
      setLoading(true);

      if (!selectedPackage) {
        alert("Please select a package");
        return;
      }

      // 1. Upload receipt
      const receiptUrl = await uploadToCloudinary();

      // 2. Prepare payload (FIXED TYPES)
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        date: new Date(form.date).toISOString(), 
        eventLocation: form.eventLocation,
        eventType: form.eventType,
        age: form.age ? Number(form.age) : 0,

        package: {
          type: selectedPackage.type,
          price: Number(selectedPackage.price),
          inclusions: selectedPackage.inclusions,
        },

        receiptUrl: receiptUrl,

        total: Number(selectedPackage.price),

        status: {
          paid: true,
          verified: false,
        },
      };

      // 3. Send to backend (RENDER MONOLITH SAFE)
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Booking failed");
      }

      // 4. Success
      alert("🎉 Booking successful for Storyline Studios!");
      window.location.href = "/";

    } catch (err) {
      console.error(err);
      alert(err.message || "❌ Something went wrong with your booking");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Step Navigation
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6 text-black">
      <div className="bg-white w-full max-w-2xl p-8 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold mb-6 text-black text-center">
          Storyline Studios Booking
        </h1>

        <p className="text-sm text-gray-500 mb-6 text-center">
          Step {step} of 5
        </p>

        {/* STEP 1: BASIC INFO */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <input name="name" placeholder="Full Name" className="p-3 border rounded-lg w-full" style={{ color: 'black' }} onChange={handleChange} />
            <input name="email" placeholder="Email" className="p-3 border rounded-lg w-full" style={{ color: 'black' }} onChange={handleChange} />
            <input name="phone" placeholder="Phone" className="p-3 border rounded-lg w-full" style={{ color: 'black' }} onChange={handleChange} />

            <button className="w-full py-3 bg-black text-white rounded-lg font-bold" onClick={nextStep}>
              Next Step
            </button>
          </div>
        )}

        {/* STEP 2: EVENT DETAILS */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <input type="date" name="date" className="p-3 border rounded-lg w-full" style={{ color: 'black' }} onChange={handleChange} />
            <input name="eventLocation" placeholder="Event Location" className="p-3 border rounded-lg w-full" style={{ color: 'black' }} onChange={handleChange} />
            <input name="eventType" placeholder="Event Type" className="p-3 border rounded-lg w-full" style={{ color: 'black' }} onChange={handleChange} />
            <input name="age" placeholder="Celebrant's Age" className="p-3 border rounded-lg w-full" style={{ color: 'black' }} type="number" onChange={handleChange} />

            <div className="flex justify-between gap-3">
              <button className="px-6 py-3 bg-gray-300 rounded-lg font-bold text-black" onClick={prevStep}>Back</button>
              <button className="flex-1 py-3 bg-black text-white rounded-lg font-bold" onClick={nextStep}>Next Step</button>
            </div>
          </div>
        )}

        {/* STEP 3: PACKAGE */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            {packages.map((pkg, i) => (
              <div
                key={i}
                onClick={() => setSelectedPackage(pkg)}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedPackage?.type === pkg.type
                    ? "border-blue-500 bg-blue-50 text-blue-900 shadow-inner"
                    : "border-gray-200 text-black hover:border-blue-400"
                }`}
              >
                <div className="flex justify-between">
                  <h3 className="font-bold text-lg">{pkg.type}</h3>
                  <p className="font-bold text-lg text-black">₱{pkg.price}</p>
                </div>
                <ul className="text-sm mt-2 list-disc list-inside text-gray-700">
                  {pkg.inclusions.map((inc, idx) => (
                    <li key={idx}>{inc}</li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="flex justify-between gap-3">
              <button className="px-6 py-3 bg-gray-300 rounded-lg font-bold text-black" onClick={prevStep}>Back</button>
              <button className="flex-1 py-3 bg-black text-white rounded-lg font-bold disabled:opacity-50" disabled={!selectedPackage} onClick={nextStep}>Next Step</button>
            </div>
          </div>
        )}

        {/* STEP 4: PAYMENT */}
        {step === 4 && (
          <div className="text-center space-y-6 animate-fadeIn">
            <p className="font-bold text-xl text-emerald-600">Scan QR to Pay Reservation Fee</p>

            <img
              src="/IMG_7162.jpg"
              alt="Storyline Studios QR Code"
              className="w-64 mx-auto rounded-xl shadow-lg border-2 border-gray-100 object-contain"
              onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=QR+Code+Not+Found"; }}
            />

            <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
              <label className="block text-sm text-gray-700 mb-3">Upload Payment Proof (Screenshot)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setReceipt(e.target.files[0])}
                className="mx-auto text-black"
                style={{ color: 'black' }}
              />
            </div>

            <div className="flex justify-between gap-3">
              <button className="px-6 py-3 bg-gray-300 rounded-lg font-bold text-black" onClick={prevStep}>Back</button>
              <button className="flex-1 py-3 bg-black text-white rounded-lg font-bold disabled:opacity-50" disabled={!receipt} onClick={nextStep}>Verify & Next →</button>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRM */}
        {step === 5 && (
          <div className="space-y-6 animate-fadeIn text-black p-4 border-2 border-gray-100 rounded-xl bg-gray-50">
            <h2 className="font-bold text-2xl text-cyan-600">Review Your Booking</h2>
            
            <div className="space-y-3 p-4 bg-white rounded-lg shadow-inner">
              <p><strong>👤 Name:</strong> {form.name}</p>
              <p><strong>📧 Email:</strong> {form.email}</p>
              <p><strong>📅 Date:</strong> {form.date}</p>
              <p><strong>📍 Location:</strong> {form.eventLocation}</p>
              <p><strong>🎬 Package:</strong> {selectedPackage?.type} - (₱{selectedPackage?.price})</p>
            </div>

            <div className="flex justify-between gap-3">
              <button className="px-6 py-3 bg-gray-300 rounded-lg font-bold text-black" onClick={prevStep}>Back</button>

              <button
                onClick={submitBooking}
                disabled={loading}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow-emerald-500/20 shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Processing...
                  </>
                ) : (
                  <>✅ Confirm & Reserve Slot</>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
      
    </div>
  );
}
