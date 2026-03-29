import React, { useState, useEffect } from 'react';

const Home = () => {
  const [showPortfolio, setShowPortfolio] = useState(false);

  return (
    <>
      {/* ✅ FULL-SCREEN VIDEO HERO */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-110"
          poster="/hero-poster.jpg" // Optional poster image
        >
          <source src="/compilation.mp4" type="video/mp4" />
        </video>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5" />
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black leading-none mb-8 bg-gradient-to-r from-cyan-400 via-white to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
              Every
              <br />
              <span className="text-transparent bg-gradient-to-r from-white via-cyan-300 to-blue-300 bg-clip-text drop-shadow-4xl">
                Moment
              </span>
            </h1>
            <h2 className="text-5xl md:text-7xl lg:text-9xl font-black leading-none mb-12 bg-gradient-to-r from-cyan-400 via-white to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
              Has A
              <br />
              <span className="text-transparent bg-gradient-to-r from-white via-cyan-300 to-blue-300 bg-clip-text drop-shadow-4xl">
                Story
              </span>
            </h2>
            <p className="text-xl md:text-2xl lg:text-3xl mb-16 opacity-90 font-light max-w-3xl mx-auto px-4 leading-relaxed">
              Cinematic Photography & Videography for life's most precious moments
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-screen py-32 px-8 bg-deep-black flex items-center">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl md:text-6xl font-black mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Ready To Begin Your Cinematic Journey?
          </h3>
          <a
            href="/book"
            className="inline-flex items-center px-12 py-8 text-2xl font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 border-4 border-cyan-400/50 backdrop-blur-xl tracking-wide"
          >
            Book Storyline Studios
            <svg className="w-8 h-8 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
};

export default Home;
