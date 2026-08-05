import React from 'react';
import PlacesCardItem from './PlacesCardItem';

export default function PlacesToVisit({ trip }) {
  const itinerary = trip?.TripData?.itinerary || {};

  return (
    <div className='mt-12'>
      <h1 className='font-extrabold text-3xl text-slate-800 mb-8'>Places To Visit</h1>
      <div className='flex flex-col gap-12'>
        {Object.entries(itinerary)
          .sort(([dayA], [dayB]) => {
            const numA = parseInt(dayA.replace(/\D/g, ""), 10) || parseInt(dayA, 10);
            const numB = parseInt(dayB.replace(/\D/g, ""), 10) || parseInt(dayB, 10);
            return numA - numB;
          })
          .map(([day, details], index) => {
            // Format "0" to "Day 1", "day1" to "Day 1"
            let displayDay = day;
            if (!isNaN(day)) {
              displayDay = `Day ${parseInt(day) + 1}`;
            } else {
              displayDay = day.replace(/([a-zA-Z]+)(\d+)/, '$1 $2').replace(/^./, str => str.toUpperCase());
            }

            return (
              <div key={index} className="relative">
                {/* Day Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-5">
                  <h2 className="font-extrabold text-2xl text-slate-800">{displayDay}</h2>
                  {details?.bestTimeToVisit && (
                    <span className='font-medium text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full text-sm shadow-sm inline-flex items-center w-max'>
                      🕒 Best time to visit: {details.bestTimeToVisit}
                    </span>
                  )}
                </div>
                
                <div className="pl-0 sm:pl-6 border-l-0 sm:border-l-4 border-slate-100">
                  <PlacesCardItem details={details} />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
