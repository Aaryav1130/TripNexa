import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GetPlaceDetails } from '../../services/GlobalApis';
import ImageCarousel from '@/components/ui/custom/ImageCarousel';
import { MapPin, Clock, Ticket } from 'lucide-react';

const Photo_Ref_Url = 'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key='+import.meta.env.VITE_GOOGLE_PLACE_KEY;

// Sub-component to handle fetching and maintaining state for EACH activity individually
function PlaceActivityCard({ activity }) {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (activity?.placeName) {
      GetPlacePhoto();
    }
  }, [activity]);

  const GetPlacePhoto = async () => {
    try {
      const data = {
        textQuery: activity?.placeName
      };
      const result = await GetPlaceDetails(data);
      
      const fetchedPhotos = result?.data?.places?.[0]?.photos;
      if (fetchedPhotos && fetchedPhotos.length > 0) {
        // Get up to 5 photos
        const photoUrls = fetchedPhotos.slice(0, 5).map(photo => 
          Photo_Ref_Url.replace('{NAME}', photo.name)
        );
        setPhotos(photoUrls);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return (
    <Link 
      to={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(activity?.placeName)} 
      target='_blank'
      className='no-underline text-black block mb-4 group'
    >
      <div className='flex flex-col sm:flex-row bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
        
        {/* Carousel Section (Left side on desktop, top on mobile) */}
        <div className='w-full sm:w-[200px] h-[200px] sm:h-auto shrink-0 relative'>
          <ImageCarousel photos={photos} className='w-full h-full' />
        </div>

        {/* Details Section */}
        <div className='p-5 flex flex-col justify-center flex-grow'>
          <h2 className='font-bold text-xl text-slate-800 mb-2 group-hover:text-blue-600 transition-colors'>
            {activity?.placeName || "No Place Name"}
          </h2>
          
          <p className='text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed'>
            {activity?.placeDetails || "No details available"}
          </p>
          
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-6 mt-auto pt-4 border-t border-slate-50'>
            {/* Travel Time */}
            {activity?.travelTime && activity?.travelTime !== "No Travel Time Available" && (
              <div className='flex items-center gap-2 text-orange-500'>
                <Clock size={16} />
                <span className='text-sm font-semibold'>{activity.travelTime}</span>
              </div>
            )}
            
            {/* Ticket Pricing */}
            {activity?.ticketPricing && activity?.ticketPricing !== "No Ticket Pricing Available" && activity?.ticketPricing !== "null" && (
              <div className='flex items-center gap-2 text-green-600'>
                <Ticket size={16} />
                <span className='text-sm font-semibold'>{activity.ticketPricing}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function PlacesCardItem({ details }) {
  if (!details?.activities || details.activities.length === 0) {
    return null;
  }

  return (
    <div className='mt-4 flex flex-col gap-2'>
      {details.activities.map((activity, index) => (
        <PlaceActivityCard key={index} activity={activity} />
      ))}
    </div>
  );
}
