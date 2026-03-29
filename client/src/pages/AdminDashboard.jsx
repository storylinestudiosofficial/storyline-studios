import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch('/api/admin/bookings') // Admin-only route
      .then(res => res.json())
      .then(setBookings);
  }, []);

  const confirmBooking = async (id) => {
    const res = await fetch(`/api/bookings/verify/${id}`, { method: 'POST' });
    if (res.ok) {
      alert("Payment Verified! Date Locked & Email Sent.");
      window.location.reload();
    }
  };

  return (
    <div className="p-8 bg-deep-black min-h-screen">
      <h1 className="text-3xl font-bold text-cyan-400 mb-8">Storyline Studios Admin</h1>
      <div className="overflow-x-auto bg-gray-900 rounded-xl border border-white/10">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4">Client</th>
              <th className="p-4">Event Date</th>
              <th className="p-4">Receipt</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-4">{b.client.name}</td>
                <td className="p-4">{new Date(b.event.date).toDateString()}</td>
                <td className="p-4">
                  <a href={b.receipt} target="_blank" className="text-cyan-400 underline text-sm">View Proof</a>
                </td>
                <td className="p-4">
                  {b.payment.retainerVerified ? '✅ Confirmed' : '⏳ Pending'}
                </td>
                <td className="p-4">
                  {!b.payment.retainerVerified && (
                    <button 
                      onClick={() => confirmBooking(b._id)}
                      className="bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-2 rounded text-sm font-bold"
                    >
                      Confirm Payment
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;