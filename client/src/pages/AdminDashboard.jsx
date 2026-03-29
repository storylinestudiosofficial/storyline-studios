import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Kunin lahat ng Bookings mula sa MongoDB
  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/admin/bookings");
      const data = await res.json();
      if (res.ok) {
        setBookings(data);
      }
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
    if (!window.confirm("Sigurado ka na ba? Magpapadala ito ng confirmation email sa client!")) return;
    
    try {
      // Tatawagin nito yung PATCH route na ginawa natin sa server.js
      const res = await fetch(`/api/bookings/confirm/${id}`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert("✅ Success! Na-verify na ang payment at may email na silang natanggap.");
        fetchBookings(); // Refresh the list para makita ang updated status
      } else {
        alert("❌ Error: " + (data.message || "Failed to confirm"));
      }
    } catch (err) {
      alert("❌ Failed to connect to server.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black font-bold">
      Loading Storyline Bookings...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-10 flex justify-between items-center border-b-4 border-black pb-4">
          <h1 className="text-4xl font-black italic tracking-tighter">STORYLINE ADMIN</h1>
          <div className="text-right">
            <p className="text-sm font-bold uppercase text-gray-400">Total Bookings</p>
            <p className="text-2xl font-black">{bookings.length}</p>
          </div>
        </header>
        
        <div className="grid gap-8">
          {bookings.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-3xl">
              <p className="text-gray-400 italic">No bookings found in the database.</p>
            </div>
          ) : (
            bookings.map((b) => (
              <div key={b._id} className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-sm flex flex-wrap justify-between items-center gap-8 hover:border-black transition-all duration-300">
                
                {/* 📝 CLIENT INFO SECTION */}
                <div className="flex-1 min-w-[320px] space-y-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-black uppercase leading-none">{b.name}</h2>
                    {b.status.verified ? (
                      <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-black tracking-widest border border-emerald-200">VERIFIED</span>
                    ) : (
                      <span className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-xs font-black tracking-widest border border-orange-200">PENDING</span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 font-bold uppercase text-[10px]">Contact Information</p>
                      <p className="font-medium">📧 {b.email}</p>
                      <p className="font-medium">📞 {b.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-bold uppercase text-[10px]">Event Details</p>
                      <p className="font-medium">📅 {new Date(b.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      <p className="font-medium">📍 {b.eventLocation}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-400 font-bold uppercase text-[10px] mb-1">Package Selected</p>
                    <p className="text-lg font-bold text-cyan-600">{b.package.type} — ₱{b.package.price.toLocaleString()}</p>
                  </div>
                </div>

                {/* 📸 RECEIPT & ACTIONS SECTION */}
                <div className="flex flex-col items-center gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100 min-w-[200px]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Proof of Payment</p>
                  
                  <a href={b.receiptUrl} target="_blank" rel="noreferrer" className="relative group">
                    <img 
                      src={b.receiptUrl} 
                      alt="Receipt" 
                      className="w-32 h-44 object-cover border-2 border-white rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300 cursor-zoom-in" 
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition-opacity text-white text-xs font-bold">
                      View Full
                    </div>
                  </a>
                  
                  {!b.status.verified ? (
                    <button 
                      onClick={() => confirmBooking(b._id)}
                      className="w-full bg-black text-white px-6 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition-colors shadow-xl active:scale-95 shadow-black/10"
                    >
                      Verify & Send Email
                    </button>
                  ) : (
                    <div className="text-emerald-600 font-bold text-sm flex items-center gap-2">
                      <span>✅ Confirmed</span>
                    </div>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
