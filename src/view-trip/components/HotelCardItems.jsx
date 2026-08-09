import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetPlaceDetails } from "../../services/GlobalApis";
import ImageCarousel from "@/components/ui/custom/ImageCarousel";
import { MapPin, Sparkles, Tag, CheckCircle2, Heart } from "lucide-react";
import axios from "axios";

export default function HotelCardItems({ hotel, index = 0, rawPrice = 0 }) {
  const Photo_Ref_Url =
    "https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=" +
    import.meta.env.VITE_GOOGLE_PLACE_KEY;
  const [photos, setPhotos] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    hotel?.hotelName && GetPlacePhoto();
  }, [hotel]);

  const addToFavorites = async (e) => {
    e.preventDefault(); // Prevent link click
    e.stopPropagation();
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Please log in to save favorites");
    
    try {
      if (isFavorited) return; // In a full app, we'd handle toggle remove here
      await axios.post("http://localhost:8000/api/favorites/add", {
        user_email: user.email,
        place_name: hotel?.hotelName,
        place_details: hotel,
        place_type: "Hotel"
      });
      setIsFavorited(true);
    } catch (err) {
      console.error(err);
    }
  };

  const GetPlacePhoto = async () => {
    try {
      const data = {
        textQuery: hotel?.hotelName + " " + hotel?.address,
      };
      const result = await GetPlaceDetails(data);
      
      const fetchedPhotos = result?.data?.places?.[0]?.photos;
      if (fetchedPhotos && fetchedPhotos.length > 0) {
        const photoUrls = fetchedPhotos.slice(0, 5).map(photo => 
          Photo_Ref_Url.replace("{NAME}", photo.name)
        );
        setPhotos(photoUrls);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  // Mock data generators for realism based on index/name length so they remain stable
  const reviewCount = (hotel?.hotelName?.length || 5) * 43 + (index * 112);
  const locationScore = Math.min(9.8, 8.5 + (index * 0.2)).toFixed(1);
  const discountPercent = 15 + (index % 5) * 8;
  
  // Try to use the passed rawPrice, or fallback for old DB trips
  let basePrice = rawPrice;
  if (basePrice === 0) {
    basePrice = Math.floor(parseFloat(hotel?.ratings || 4)) * 1200 + (index * 350);
  }
  
  const originalPrice = Math.round(basePrice / (1 - (discountPercent / 100)));
  const discountedPrice = `Rs. ${basePrice.toLocaleString()}`;

  return (
    <Link
      to={
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(hotel?.hotelName + "," + hotel?.address)
      }
      target="_blank"
      className="no-underline text-black group block"
    >
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row relative">
        
        {/* Top Badge Overlay */}
        {index === 0 && (
          <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg z-10 flex items-center gap-1">
            <Sparkles size={12}/> 2024 Award
          </div>
        )}

        {/* Left Section: Image Carousel */}
        <div className="w-full sm:w-[260px] h-[220px] shrink-0 relative bg-slate-100">
          <ImageCarousel photos={photos} className="w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-0.5 rounded z-10 pointer-events-none">
            1/{Math.max(1, photos.length)}
          </div>
          
          {/* Favorite Button */}
          <button 
            onClick={addToFavorites}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-md z-20 transition-all ${isFavorited ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-500 border border-white/50 hover:bg-white'}`}
          >
            <Heart size={16} className={isFavorited ? 'fill-red-500' : ''} />
          </button>
        </div>
        
        {/* Middle Section: Details */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow border-b sm:border-b-0 sm:border-r border-slate-100 min-w-0">
          <h2 className="text-xl font-extrabold text-slate-800 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
            {hotel?.hotelName}
          </h2>
          
          {/* Star Rating */}
          <div className="flex items-center gap-0.5 mb-2">
            {[...Array(Math.max(1, Math.floor(parseFloat(hotel?.ratings) || 4)))].map((_, i) => (
              <span key={i} className="text-yellow-400 text-sm">★</span>
            ))}
          </div>

          <div className="flex items-start gap-1.5 text-blue-600 font-medium text-sm mb-3">
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
            <h2 className="line-clamp-2 hover:underline">{hotel?.address}</h2>
          </div>
          
          {/* Dynamic Tags */}
          <div className="mt-auto flex flex-col gap-2 pt-2">
            
            {/* Property Type Badge */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 w-fit px-2 py-0.5 rounded-md border border-slate-200">
              {hotel?.mockType || "Hotel"}
            </div>

            {/* Dynamic Amenities */}
            {hotel?.mockAmenities && hotel.mockAmenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {hotel.mockAmenities.slice(0, 3).map((amenity, i) => (
                  <span key={i} className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded font-medium">
                    {amenity}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1">
              <span className="text-blue-500 text-base leading-none">⛊</span> Agoda Preferred
            </div>
          </div>
        </div>

        {/* Right Section: Price & Rating */}
        <div className="w-full sm:w-[240px] shrink-0 flex flex-col bg-slate-50/50">
          
          {/* Rating Block */}
          <div className="p-4 flex flex-col items-end text-right border-b border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex flex-col">
                <span className="text-blue-700 font-bold text-sm">
                  {parseFloat(hotel?.ratings) >= 4.5 ? 'Exceptional' : 'Very good'}
                </span>
                <span className="text-slate-500 text-xs">{reviewCount.toLocaleString()} reviews</span>
              </div>
              <div className="bg-blue-700 text-white font-extrabold text-lg px-2 py-1 rounded-md rounded-tr-none shadow-sm">
                {(parseFloat(hotel?.ratings) || 4.2).toFixed(1)}
              </div>
            </div>
            <div className="text-xs font-bold text-slate-700">
              {locationScore} Location score
            </div>
          </div>

          {/* Pricing Block */}
          <div className="p-4 flex flex-col items-end text-right mt-auto">
              <div className="text-[10px] text-slate-500 mb-1">Per night before taxes and fees</div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-slate-400 line-through decoration-red-500">
                  Rs. {originalPrice.toLocaleString()}
                </span>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-1 rounded">
                  -{discountPercent}%
                </span>
              </div>
              <div className="text-2xl font-extrabold text-red-600 leading-tight mb-2">
                {discountedPrice}
              </div>
              <div className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1 mb-3">
                <CheckCircle2 size={12}/> FREE CANCELLATION
              </div>
              
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm shadow-md flex justify-center items-center gap-2">
                View Deal
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </button>
          </div>
        </div>

      </div>
    </Link>
  );
}
