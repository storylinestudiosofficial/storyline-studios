import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-deep-black min-h-screen">
      {/* SECTION 1: FULL SCREEN VIDEO HERO */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <video 
          autoPlay loop muted playsInline 
          className="absolute z-0 min-w-full min-h-full object-cover opacity-60"
        >
          <source src="/compilation.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 font-cinematic tracking-tighter text-shadow-xl">
            Every Moment <br/> Has A Story
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light tracking-widest">
            Let Us Tell Yours
          </p>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <p className="text-xs uppercase tracking-[0.5em] text-cyan-400">Scroll to Explore</p>
          </div>
        </div>
      </section>

      {/* SECTION 2: BOOKING TRIGGER (Lalabas lang pag nag-scroll) */}
      <section className="py-32 px-4 flex flex-col items-center justify-center text-center bg-gradient-to-b from-deep-black to-black">
        <h2 className="text-4xl font-bold mb-8 text-white">Ready to capture your story?</h2>
        <Link 
          to="/book" 
          className="auth-btn px-12 py-5 text-2xl max-w-md"
        >
          Book Storyline Studios
        </Link>
      </section>
    </div>
  );
};

export default Home;
