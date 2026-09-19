import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Compass, MapPin, Calendar, DollarSign, Sparkles } from 'lucide-react';

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
    image: "https://images.unsplash.com/photo-1616843413587-9e3a37f7bbd8?q=80&w=400&auto=format&fit=crop"
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
    <div className="w-full bg-[#F5F3ED] py-16 px-6 sm:px-10 lg:px-20">
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
              <Link to={`/create-trip?destination=${encodeURIComponent(dest.name)}`} key={index} className="flex-none w-[200px] sm:w-[240px] snap-start group/card cursor-pointer">
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
      
      {/* Features Section */}
      <div className="w-full mt-20 md:mt-32 px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto">
        <div className="border-t border-[#e2dcd0] pt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0">
          <div className="lg:border-r border-[#e2dcd0] lg:pr-10 flex flex-col gap-3">
            <MapPin className="text-[#e55934]" size={20} strokeWidth={1.5} />
            <h3 className="font-serif text-xl text-slate-800">Real Places</h3>
            <p className="text-[15px] text-slate-600 leading-relaxed">Every location is verified with real coordinates from OpenStreetMap.</p>
          </div>
          <div className="lg:border-r border-[#e2dcd0] lg:px-10 flex flex-col gap-3">
            <Calendar className="text-[#e55934]" size={20} strokeWidth={1.5} />
            <h3 className="font-serif text-xl text-slate-800">Day-by-Day</h3>
            <p className="text-[15px] text-slate-600 leading-relaxed">Detailed hourly schedules with transport times between activities.</p>
          </div>
          <div className="lg:border-r border-[#e2dcd0] lg:px-10 flex flex-col gap-3">
            <DollarSign className="text-[#e55934]" size={20} strokeWidth={1.5} />
            <h3 className="font-serif text-xl text-slate-800">Cost Breakdown</h3>
            <p className="text-[15px] text-slate-600 leading-relaxed">Per-person costs with a running total against your budget.</p>
          </div>
          <div className="lg:pl-10 flex flex-col gap-3">
            <Sparkles className="text-[#e55934]" size={20} strokeWidth={1.5} />
            <h3 className="font-serif text-xl text-slate-800">AI-Powered</h3>
            <p className="text-[15px] text-slate-600 leading-relaxed">Personalized recommendations based on your interests and travel style.</p>
          </div>
        </div>
      </div>

      {/* Footer Line */}
      <div className="w-full border-t border-[#e2dcd0] mt-24 py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-4 text-[#9a9182]">
          <div className="flex items-center gap-2">
            <Compass size={18} strokeWidth={1.5} />
            <span className="font-serif font-medium text-lg text-slate-800 tracking-wide">TripNexa</span>
          </div>
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#b3aa9a]">Free forever. No credit card required.</p>
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
