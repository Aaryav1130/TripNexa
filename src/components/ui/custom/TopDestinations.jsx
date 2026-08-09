import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const destinations = [
  {
    name: "Bangalore",
    accommodations: "5,372 accommodations",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Mumbai",
    accommodations: "4,177 accommodations",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "New Delhi",
    accommodations: "12,786 accommodations",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Hyderabad",
    accommodations: "2,735 accommodations",
    image: "https://images.unsplash.com/photo-1513342791620-b106dc487c94?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Chennai",
    accommodations: "2,832 accommodations",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Chennai_Central.jpg/800px-Chennai_Central.jpg"
  },
  {
    name: "Goa",
    accommodations: "8,942 accommodations",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=400&auto=format&fit=crop"
  }
];

export default function TopDestinations() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="w-full bg-white py-16 px-6 sm:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-8 tracking-tight">Top destinations in India</h2>
        
        <div className="relative group">
          {/* Left Scroll Button */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white shadow-lg border border-slate-100 rounded-full p-2 text-slate-600 hover:text-blue-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:block"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Scrollable Container */}
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 pb-8 -mb-8 snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {destinations.map((dest, index) => (
              <Link to="/create-trip" key={index} className="flex-none w-[200px] sm:w-[240px] snap-start group/card cursor-pointer">
                <div className="flex flex-col gap-3">
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200">
                    <img 
                      src={dest.image} 
                      alt={dest.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                    />
                  </div>
                  <div className="text-center px-1">
                    <h3 className="font-bold text-slate-800 text-lg">{dest.name}</h3>
                    <p className="text-slate-500 text-sm">{dest.accommodations}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Scroll Button */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white shadow-lg border border-slate-100 rounded-full p-2 text-slate-600 hover:text-blue-600 hover:scale-110 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
