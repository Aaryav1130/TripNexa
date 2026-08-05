import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetPlaceDetails } from "../../services/GlobalApis";
import ImageCarousel from "@/components/ui/custom/ImageCarousel";
import { Star, MapPin } from "lucide-react";

export default function HotelCardItems({ hotel }) {
  const Photo_Ref_Url =
    "https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=" +
    import.meta.env.VITE_GOOGLE_PLACE_KEY;
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (hotel) {
      GetPlacePhoto();
    }
  }, [hotel]);

  const GetPlacePhoto = async () => {
    try {
      const data = {
        textQuery: hotel?.hotelName + " " + hotel?.address,
      };
      const result = await GetPlaceDetails(data);
      
      const fetchedPhotos = result?.data?.places?.[0]?.photos;
      if (fetchedPhotos && fetchedPhotos.length > 0) {
        // Get up to 5 photos
        const photoUrls = fetchedPhotos.slice(0, 5).map(photo => 
          Photo_Ref_Url.replace("{NAME}", photo.name)
        );
        setPhotos(photoUrls);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return (
    <Link
      to={
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(hotel?.hotelName + "," + hotel?.address)
      }
      target="_blank"
      className="no-underline text-black group block h-full"
    >
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
        {/* Carousel Section */}
        <div className="h-[220px] w-full relative">
          <ImageCarousel photos={photos} className="w-full h-full" />
          
          {/* Floating Rating Badge */}
          {hotel?.ratings && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-bold shadow-sm flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
              <span>{hotel.ratings}</span>
            </div>
          )}
        </div>
        
        {/* Details Section */}
        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-lg font-bold text-slate-800 line-clamp-1 mb-1">
            {hotel?.hotelName}
          </h2>
          
          <div className="flex items-start gap-1 text-slate-500 mb-4">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
            <h2 className="text-sm line-clamp-2">{hotel?.address}</h2>
          </div>
          
          <div className="mt-auto pt-2 border-t border-slate-50">
            <h2 className="text-base font-semibold text-slate-800">
              {hotel?.pricePerNight && hotel?.pricePerNight !== "null" && hotel?.pricePerNight !== "undefined" ? (
                <>
                  <span className="text-lg">{hotel.pricePerNight}</span>
                  <span className="text-sm text-slate-500 font-normal"> / Night</span>
                </>
              ) : (
                <span className="text-sm text-slate-500 font-normal">Price varies</span>
              )}
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
}
