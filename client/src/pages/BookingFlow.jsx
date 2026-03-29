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
      "https://api.cloudinary.com/v1_1/dhfdcigsm/image/upload",
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
        date: new Date(form.date).toISOString(), // ✅ ISO
        eventLocation: form.eventLocation,
        eventType: form.eventType,
        age: Number(form.age), // ✅ NUMBER

        package: {
          type: selectedPackage.type,
          price: Number(selectedPackage.price), // ✅ NUMBER
          inclusions: selectedPackage.inclusions,
        },

        receiptUrl: receiptUrl,

        total: Number(selectedPackage.price), // ✅ NUMBER

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
      alert("Booking successful!");
      window.location.href = "/";

    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Step Navigation
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-4">
          Storyline Studios Booking
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Step {step} of 5
        </p>

        {/* STEP 1: BASIC INFO */}
        {step === 1 && (
          <div className="space-y-3">
            <input name="name" placeholder="Full Name" className="input" onChange={handleChange} />
            <input name="email" placeholder="Email" className="input" onChange={handleChange} />
            <input name="phone" placeholder="Phone" className="input" onChange={handleChange} />

            <button className="btn" onClick={nextStep}>
              Next
            </button>
          </div>
        )}

        {/* STEP 2: EVENT DETAILS */}
        {step === 2 && (
          <div className="space-y-3">
            <input type="date" name="date" className="input" onChange={handleChange} />
            <input name="eventLocation" placeholder="Event Location" className="input" onChange={handleChange} />
            <input name="eventType" placeholder="Event Type" className="input" onChange={handleChange} />
            <input name="age" placeholder="Age" className="input" onChange={handleChange} />

            <div className="flex justify-between">
              <button className="btn-secondary" onClick={prevStep}>Back</button>
              <button className="btn" onClick={nextStep}>Next</button>
            </div>
          </div>
        )}

        {/* STEP 3: PACKAGE */}
        {step === 3 && (
          <div className="space-y-3">
            {packages.map((pkg, i) => (
              <div
                key={i}
                onClick={() => setSelectedPackage(pkg)}
                className={`p-3 border rounded cursor-pointer ${
                  selectedPackage?.type === pkg.type
                    ? "border-blue-500 bg-blue-50"
                    : ""
                }`}
              >
                <h3 className="font-bold">{pkg.type}</h3>
                <p>₱{pkg.price}</p>
                <ul className="text-sm">
                  {pkg.inclusions.map((inc, idx) => (
                    <li key={idx}>• {inc}</li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="flex justify-between">
              <button className="btn-secondary" onClick={prevStep}>Back</button>
              <button className="btn" onClick={nextStep}>Next</button>
            </div>
          </div>
        )}

        {/* STEP 4: PAYMENT */}
        {step === 4 && (
          <div className="text-center space-y-4">
            <p className="font-medium">Scan to Pay</p>

            <img
              src="/IMG_7162.jpg"
              alt="QR Code"
              className="w-40 mx-auto"
            />

            <input
              type="file"
              onChange={(e) => setReceipt(e.target.files[0])}
              className="mx-auto"
            />

            <div className="flex justify-between">
              <button className="btn-secondary" onClick={prevStep}>Back</button>
              <button className="btn" onClick={nextStep}>Next</button>
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRM */}
        {step === 5 && (
          <div className="space-y-3">
            <h2 className="font-semibold">Review & Confirm</h2>

            <p><strong>Name:</strong> {form.name}</p>
            <p><strong>Date:</strong> {form.date}</p>
            <p><strong>Location:</strong> {form.eventLocation}</p>
            <p><strong>Package:</strong> {selectedPackage?.type}</p>

            <div className="flex justify-between">
              <button className="btn-secondary" onClick={prevStep}>Back</button>

              <button
                onClick={submitBooking}
                disabled={loading}
                className="btn"
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 🔹 Tailwind Utility Classes */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }
        .btn {
          width: 100%;
          background: black;
          color: white;
          padding: 10px;
          border-radius: 6px;
        }
        .btn-secondary {
          background: #ddd;
          padding: 10px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}
