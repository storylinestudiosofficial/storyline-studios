import React from 'react';

const PortfolioGrid = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item, index) => (
        <div key={index} className="group relative overflow-hidden rounded-2xl bg-gray-900 border border-white/10 hover:border-cyan-400/50 transition-all duration-500 shadow-xl">
          <div className="aspect-video w-full overflow-hidden">
            {item.type === 'video' ? (
              <video src={item.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" muted loop onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
            ) : (
              <img src={item.url} alt={item.category} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            )}
          </div>
          <div className="p-6">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">{item.category}</span>
            <h3 className="text-lg font-semibold mt-1 text-white opacity-90">Storyline Project #{index + 1}</h3>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="col-span-full text-center py-20 text-gray-500 italic">
          No masterpieces uploaded yet. Check back soon!
        </div>
      )}
    </div>
  );
};

export default PortfolioGrid;
