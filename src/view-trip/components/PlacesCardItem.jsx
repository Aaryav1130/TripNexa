import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetPlaceDetails } from '../../services/GlobalApis';
import ImageCarousel from '@/components/ui/custom/ImageCarousel';
import { MapPin, Clock, Ticket, Navigation, Heart } from 'lucide-react';
import axios from 'axios';

const Photo_Ref_Url = 'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key='+import.meta.env.VITE_GOOGLE_PLACE_KEY;

// Sub-component to handle fetching and maintaining state for EACH activity individually
function PlaceActivityCard({ activity, index, totalActivities }) {
  const [photos, setPhotos] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (activity?.placeName) {
      GetPlacePhoto();
    }
  }, [activity]);

  const addToFavorites = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Please log in to save favorites");
    
    try {
      if (isFavorited) return; 
      await axios.post("http://localhost:8000/api/favorites/add", {
        user_email: user.email,
        place_name: activity?.placeName,
        place_details: activity,
        place_type: "Activity"
      });
      setIsFavorited(true);
    } catch (err) {
      console.error(err);
    }
  };

  const GetPlacePhoto = async () => {
    try {
      const data = {
        textQuery: activity?.placeName
      };
      const result = await GetPlaceDetails(data);
      
      const fetchedPhotos = result?.data?.places?.[0]?.photos;
      if (fetchedPhotos && fetchedPhotos.length > 0) {
        const photoUrls = fetchedPhotos.slice(0, 5).map(photo => 
          Photo_Ref_Url.replace('{NAME}', photo.name)
        );
        setPhotos(photoUrls);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  const isLast = index === totalActivities - 1;

  return (
    <div className="relative flex gap-6 sm:gap-8 pb-10 group">
      
      {/* Timeline Line & Dot */}
      <div className="flex flex-col items-center">
        {/* The Dot */}
        <div className="w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-[0_0_0_2px_rgba(37,99,235,0.2)] z-10 relative mt-1" />
        {/* The Line */}
        {!isLast && (
          <div className="w-0.5 bg-slate-200 flex-grow mt-2 group-hover:bg-blue-200 transition-colors" />
        )}
      </div>

      {/* Main Card Content */}
      <div className="flex-grow">
        
        {/* Time Badge if available (using index as mock if not present) */}
        <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          {activity?.timeTravel ? activity.timeTravel : `Stop ${index + 1}`}
        </div>
        
        <div className='flex flex-col sm:flex-row bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 shadow-sm'>
          
          {/* Carousel Section */}
          <div className='w-full sm:w-[220px] h-[200px] sm:h-auto shrink-0 relative bg-slate-100'>
            <ImageCarousel photos={photos} className='w-full h-full object-cover' />
            
            {/* Favorite Button */}
            <button 
              onClick={addToFavorites}
              className={`absolute top-3 left-3 p-2 rounded-full shadow-md z-20 transition-all ${isFavorited ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-500 border border-white/50 hover:bg-white'}`}
            >
              <Heart size={16} className={isFavorited ? 'fill-red-500' : ''} />
            </button>
          </div>

          {/* Details Section */}
          <div className='p-5 flex flex-col justify-center flex-grow'>
            <div className="flex justify-between items-start gap-4 mb-2">
              <h2 className='font-extrabold text-xl text-slate-800 line-clamp-2'>
                {activity?.placeName || "No Place Name"}
              </h2>
            </div>
            
            <p className='text-sm text-slate-600 mb-6 line-clamp-3 leading-relaxed'>
              {activity?.placeDetails || "No details available"}
            </p>
            
            <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-auto pt-4 border-t border-slate-100'>
              
              {/* Badges */}
              <div className='flex flex-wrap items-center gap-3'>
                {activity?.travelTime && activity?.travelTime !== "No Travel Time Available" && (
                  <div className='flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100'>
                    <Clock size={14} />
                    <span className='text-xs font-bold'>{activity.travelTime}</span>
                  </div>
                )}
                
                {activity?.ticketPricing && activity?.ticketPricing !== "No Ticket Pricing Available" && activity?.ticketPricing !== "null" && (
                  <div className='flex items-center gap-1.5 text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-100'>
                    <Ticket size={14} />
                    <span className='text-xs font-bold'>{activity.ticketPricing}</span>
                  </div>
                )}
              </div>

              {/* Get Directions Button */}
              <Link 
                to={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(activity?.placeName)} 
                target='_blank'
                className='shrink-0'
              >
                <button className="w-full lg:w-auto bg-slate-800 hover:bg-black text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2 shadow-sm">
                  <Navigation size={14} /> Get Directions
                </button>
              </Link>

            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default function PlacesCardItem({ details }) {
  if (!details?.activities || details.activities.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-slate-500 font-medium">No activities planned for this day yet.</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col pt-2'>
      {details.activities.map((activity, index) => (
        <PlaceActivityCard 
          key={index} 
          activity={activity} 
          index={index} 
          totalActivities={details.activities.length} 
        />
      ))}
    </div>
  );
}
