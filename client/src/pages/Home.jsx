import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-deep-black min-h-screen">
      {/* SECTION 1: FULL SCREEN VIDEO HERO */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <video 
          autoPlay loop muted playsInline 
          className="absolute z-0 min-w-full min-h-full object-cover opacity-50"
        >
          <source src="/compilation.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 font-cinematic tracking-tighter text-shadow-xl animate-pulse">
            Storyline Studios
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light tracking-[0.3em] uppercase">
            Every Moment Has A Story
          </p>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <p className="text-xs uppercase tracking-[0.5em] text-cyan-400">Scroll to Explore</p>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE CALL TO ACTION */}
      <section className="py-32 px-4 flex flex-col items-center justify-center text-center bg-gradient-to-b from-deep-black to-black">
        <h2 className="text-4xl font-bold mb-6 text-white">Capture the Unforgettable.</h2>
        <p className="text-gray-400 max-w-2xl mb-12 text-lg">
          Specializing in cinematic photography and social storytelling. We don't just take photos; we frame your legacy.
        </p>
        <Link 
          to="/book" 
          className="auth-btn px-16 py-6 text-2xl shadow-[0_0_30px_rgba(0,212,255,0.3)]"
        >
          Book Your Session
        </Link>
      </section>
    </div>
  );
};

export default Home;
