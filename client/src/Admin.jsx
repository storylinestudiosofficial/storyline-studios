import React, { useEffect, useState } from "react";

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Kunin lahat ng Bookings mula sa MongoDB
  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 2. Function para sa "Confirm & Email"
  const confirmBooking = async (id) => {
    if (!window.confirm("Confirm this booking and send email?")) return;
    
    try {
      const res = await fetch(`/api/bookings/confirm/${id}`, { method: "PATCH" });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Success! Email sent to client.");
        fetchBookings(); // Refresh the list
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (err) {
      alert("❌ Failed to connect to server.");
    }
  };

  if (loading) return <div className="p-10 text-center text-black">Loading Bookings...</div>;

  return (
    <div className="min-h-screen bg-white p-6 text-black">
      <h1 className="text-3xl font-bold mb-8 border-b pb-4">Storyline Studios - Admin Portal</h1>
      
      <div className="grid gap-6">
        {bookings.map((b) => (
          <div key={b._id} className="border-2 rounded-xl p-5 shadow-sm flex flex-wrap justify-between items-start gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold">{b.name} <span className="text-sm font-normal text-gray-500">({b.eventType})</span></h2>
              <p>📧 {b.email}</p>
              <p>📅 {new Date(b.date).toDateString()}</p>
              <p>💰 Package: <strong>{b.package.type}</strong> (₱{b.package.price})</p>
              <p>Status: {b.status.verified ? <span className="text-green-600 font-bold">✅ VERIFIED</span> : <span className="text-red-500 font-bold">⏳ PENDING</span>}</p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <p className="text-xs font-bold uppercase text-gray-400">Payment Receipt</p>
              <a href={b.receiptUrl} target="_blank" rel="noreferrer">
                <img src={b.receiptUrl} alt="Receipt" className="w-32 h-32 object-cover border rounded-lg hover:opacity-80 transition" />
              </a>
              
              {!b.status.verified && (
                <button 
                  onClick={() => confirmBooking(b._id)}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-500 transition shadow-lg"
                >
                  Confirm & Send Email
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
