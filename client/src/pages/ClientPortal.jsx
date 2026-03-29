import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ClientPortal = () => {
  const { user, login } = useAuth();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (user) fetchBooking();
  }, [user]);

  const fetchBooking = async () => {
    // Fetch user's booking from backend
    const res = await fetch('/api/bookings/my-booking', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await res.json();
    setBooking(data);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="bg-black/70 backdrop-blur-xl border border-cyan-400/30 rounded-3xl p-12 max-w-md w-full mx-4">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Create Your Private Access
          </h2>
          <form className="space-y-6">
            <input type="text" placeholder="Username" className="auth-input" />
            <input type="password" placeholder="Password" className="auth-input" />
            <button className="w-full auth-btn" onClick={login}>
              Create Account & Access Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        Your Storyline Studios Portal
      </h1>
      
      {/* Event Summary */}
      <div className="bg-gradient-to-br from-black to-gray-900 border border-cyan-400/30 rounded-3xl p-12 mb-12">
        <h2 className="text-2xl font-semibold mb-6">My Event</h2>
        <div className="grid md:grid-cols-2 gap-8 text-lg">
          <div>Date: {booking?.event.date}</div>
          <div>Location: {booking?.event.location}</div>
          <div>Package: {booking?.package.type} (₱{booking?.package.price})</div>
          <div>Status: {booking?.payment.status.retainerVerified ? 'Date Locked' : 'Pending Verification'}</div>
        </div>
      </div>

      {/* Story Progress Bar */}
      <div className="bg-gradient-to-br from-black to-gray-900 border border-cyan-400/30 rounded-3xl p-12">
