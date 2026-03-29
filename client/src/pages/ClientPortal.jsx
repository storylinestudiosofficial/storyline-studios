import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ClientPortal = () => {
  const { user, login } = useAuth();
  const [booking, setBooking] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(true);

  // Mock booking data (replace with real API call)
  const mockBooking = {
    event: { date: '2024-12-15', location: 'Manila Hotel', type: 'Wedding' },
    package: { type: 'C', price: 6000 },
    payment: { retainerVerified: true, status: { retainerVerified: true } }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      setShowLogin(false);
      setBooking(mockBooking); // Fetch real booking here
    }
  };

  if (showLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="bg-black/70 backdrop-blur-xl border border-cyan-400/30 rounded-3xl p-12 max-w-md w-full mx-4 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Create Your Private Access
          </h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="text"
              placeholder="Choose Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 bg-black/50 border-2 border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:bg-black/70 transition-all duration-300 text-lg"
              required
            />
            <input
              type="password"
              placeholder="Choose Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-black/50 border-2 border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:bg-black/70 transition-all duration-300 text-lg"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 p-5 rounded-2xl font-semibold text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-cyan-400/50"
            >
              Create Account & Access Portal
            </button>
          </form>
          <p className="text-center mt-6 text-sm text-gray-400">
            Your event details are secure here
          </p>
        </div>
      </div>
    );
  }

  // Client Dashboard
  return (
    <div className="min-h-screen py-20 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
          Your Storyline Studios Portal
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Track your cinematic story from reservation to final delivery
        </p>
      </div>

      {/* Event Summary Card */}
      <div className="bg-gradient-to-br from-black/90 to-gray-900/50 border border-cyan-400/30 rounded-3xl p-10 md:p-12 mb-16 shadow-2xl backdrop-blur-xl">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          📍 My Event Details
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-lg">
          <div className="p-6 bg-black/50 rounded-2xl border border-cyan-400/20">
            <div className="text-2xl font-bold text-cyan-400 mb-2">📅 Date</div>
            <div>{booking?.event.date}</div>
          </div>
          <div className="p-6 bg-black/50 rounded-2xl border border-cyan-400/20">
            <div className="text-2xl font-bold text-cyan-400 mb-2">📍 Location</div>
            <div>{booking?.event.location}</div>
          </div>
          <div className="p-6 bg-black/50 rounded-2xl border border-cyan-400/20">
            <div className="text-2xl font-bold text-cyan-400 mb-2">🎁 Package</div>
            <div>Package {booking?.package.type} (₱{booking?.package.price})</div>
          </div>
        </div>
      </div>

      {/* Story Progress Bar */}
      <div className="bg-gradient-to-br from-black/90 to-gray-900/50 border border-cyan-400/30 rounded-3xl p-10 md:p-12">
        <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent text-center">
          🎬 Story Progress
        </h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {[
            { label: 'Retainer Verified & Date Locked', checked: booking?.payment.status.retainerVerified },
            { label: 'Shoot Completed', checked: booking?.payment.status.shootCompleted || false },
            { label: 'Culling/Editing', checked: booking?.payment.status.cullingEditing || false },
            { label: 'Color Grading', checked: booking?.payment.status.colorGrading || false },
            { label: 'Final Review', checked: booking?.payment.status.finalReview || false },
            { 
              label: 'Download Files', 
              checked: booking?.payment.status.finalBalancePaid || false,
              button: true
            }
          ].map((step, index) => (
            <div key={index} className="flex items-center p-6 bg-black/50 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-6 flex-shrink-0 ${
                step.checked 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg' 
                  : 'bg-gray-800 border-2 border-gray-600'
              }`}>
                {step.checked ? '✓' : index + 1}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-lg">{step.label}</div>
              </div>
              {step.button && step.checked && (
                <button className="ml-4 px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Download Now
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className="text-center mt-20">
        <button 
          onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}
          className="px-12 py-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-500/50 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ClientPortal;
