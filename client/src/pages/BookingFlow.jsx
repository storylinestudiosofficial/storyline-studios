import React, { useState } from "react";
import axios from "axios";

export default function BookingFlow() {
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
  const [loading, setLoading] = useState(false);

  // 🔹 SAMPLE PACKAGES (edit as needed)
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

  // 🔹 Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Upload to Cloudinary
  const uploadToCloudinary = async () => {
    if (!receipt) throw new Error("Please upload receipt");

    const data = new FormData();
    data.append("file", receipt);
    data.append("storyline_receipts", "YOUR_UPLOAD_PRESET"); // change this

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1dhfdcigsm/image/upload", // change this
        data
      );
      return res.data.secure_url;
    } catch (err) {
      throw new Error("Cloudinary upload failed");
    }
  };

  // 🔹 Submit Booking
  const submitBooking = async () => {
    try {
      setLoading(true);

      if (!selectedPackage) {
        alert("Please select a package");
        return;
      }

      // 1. Upload receipt first
      const receiptUrl = await uploadToCloudinary();

      // 2. Prepare payload (FIXED TYPES)
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        date: new Date(form.date).toISOString(), // ✅ ISO STRING
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

      // 3. Send to backend
      await axios.post(
        "/api/bookings", // 🔴 CHANGE THIS
        payload
      );

      // 4. Success
      alert("Booking successful!");
      window.location.href = "/"; // ✅ REDIRECT

    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          err.message ||
          "Booking failed"
      ); // ✅ SHOW SERVER ERROR
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">
          Storyline Studios Booking
        </h1>

        {/* FORM */}
        <div className="grid gap-3">
          <input
            name="name"
            placeholder="Full Name"
            className="p-2 border rounded"
            onChange={handleChange}
          />
          <input
            name="email"
            placeholder="Email"
            className="p-2 border rounded"
            onChange={handleChange}
          />
          <input
            name="phone"
            placeholder="Phone"
            className="p-2 border rounded"
            onChange={handleChange}
          />
          <input
            type="date"
            name="date"
            className="p-2 border rounded"
            onChange={handleChange}
          />
          <input
            name="eventLocation"
            placeholder="Event Location"
            className="p-2 border rounded"
            onChange={handleChange}
          />
          <input
            name="eventType"
            placeholder="Event Type"
            className="p-2 border rounded"
            onChange={handleChange}
          />
          <input
            name="age"
            placeholder="Age"
            className="p-2 border rounded"
            onChange={handleChange}
          />
        </div>

        {/* PACKAGES */}
        <h2 className="text-lg font-semibold mt-6 mb-2">
          Select Package
        </h2>
        <div className="grid gap-3">
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
        </div>

        {/* QR CODE */}
        <div className="mt-6 text-center">
          <p className="mb-2 font-medium">Scan to Pay</p>
          <img
            src="/IMG_7162.jpg" // ✅ FIXED PATH
            alt="QR Code"
            className="w-40 mx-auto"
          />
        </div>

        {/* RECEIPT UPLOAD */}
        <div className="mt-4">
          <input
            type="file"
            onChange={(e) => setReceipt(e.target.files[0])}
          />
        </div>

        {/* SUBMIT */}
        <button
          onClick={submitBooking}
          disabled={loading}
          className="mt-6 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
