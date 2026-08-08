import React, { useState, useMemo } from 'react';
import PlacesCardItem from './PlacesCardItem';
import { MapPin, CalendarDays, Navigation } from 'lucide-react';

export default function PlacesToVisit({ trip }) {
  const itinerary = trip?.TripData?.itinerary || {};
  const destination = trip?.userSelections?.location?.label || "";
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(destination)}&t=&z=12&ie=UTF8&iwloc=&output=embed`;

  // Parse days into a predictable array sorted by day number
  const daysArray = useMemo(() => {
    return Object.entries(itinerary)
      .sort(([dayA], [dayB]) => {
        const numA = parseInt(dayA.replace(/\D/g, ""), 10) || parseInt(dayA, 10);
        const numB = parseInt(dayB.replace(/\D/g, ""), 10) || parseInt(dayB, 10);
        return numA - numB;
      })
      .map(([day, details]) => {
        let displayDay = day;
        if (!isNaN(day)) {
          displayDay = `Day ${parseInt(day) + 1}`;
        } else {
          displayDay = day.replace(/([a-zA-Z]+)(\d+)/, '$1 $2').replace(/^./, str => str.toUpperCase());
        }
        return { originalKey: day, displayDay, details };
      });
  }, [itinerary]);

  // State for Day Tabs
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  if (daysArray.length === 0) return null;

  const activeDayData = daysArray[activeDayIndex];

  return (
    <div className='mt-16 mb-20'>
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
          <CalendarDays size={28} />
        </div>
        <h1 className='font-extrabold text-3xl text-slate-800'>Your Daily Itinerary</h1>
      </div>
      
      {/* Horizontal Day Tabs */}
      <div className="flex overflow-x-auto gap-3 pb-4 mb-6 custom-scrollbar">
        {daysArray.map((dayObj, idx) => (
          <button
            key={idx}
            onClick={() => setActiveDayIndex(idx)}
            className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all shadow-sm ${
              activeDayIndex === idx 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 shadow-lg scale-105'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-blue-600'
            }`}
          >
            {dayObj.displayDay}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Sidebar (Map & Day Overview) */}
        <div className="w-full lg:w-1/3 shrink-0 flex flex-col gap-6 sticky top-24">
          
          {/* Active Day Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-2xl text-slate-800 mb-2">{activeDayData.displayDay} Overview</h3>
            <div className="flex items-start gap-2 text-slate-500 text-sm mb-4">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span>Exploring the highlights of {destination.split(',')[0]}</span>
            </div>
            
            {activeDayData.details?.bestTimeToVisit && (
              <div className="bg-blue-50 border border-blue-100 text-blue-700 p-3 rounded-xl flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm">
                   🕒
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-70">Best Time</div>
                  <div className="font-semibold text-sm">{activeDayData.details.bestTimeToVisit}</div>
                </div>
              </div>
            )}
            
            <div className="mt-6 flex flex-col gap-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Activities</div>
              <div className="flex items-center gap-3 font-semibold text-slate-700">
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">{activeDayData.details?.activities?.length || 0}</div>
                 <span>Total stops planned</span>
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative h-[350px] group cursor-pointer">
            <iframe 
              src={mapUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
            {/* Map Overlay Button */}
            <div className="absolute inset-0 bg-slate-900/10 pointer-events-none group-hover:bg-transparent transition-colors flex items-center justify-center">
              <button className="bg-slate-900/90 backdrop-blur-sm text-white font-bold py-2.5 px-6 rounded-full shadow-lg pointer-events-auto hover:bg-black hover:scale-105 transition-all flex items-center gap-2 text-sm">
                <Navigation size={16}/> View Full Route
              </button>
            </div>
          </div>
        </div>

        {/* Right Main Content (Timeline) */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm min-h-[600px]">
             {/* Timeline Container passed to PlacesCardItem */}
             <PlacesCardItem details={activeDayData.details} />
          </div>
        </div>
        
      </div>
    </div>
  );
}
