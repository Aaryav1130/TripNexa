import React, { useEffect, useState } from "react";
import { GetPlaceDetails } from "../../services/GlobalApis";

export default function SelectedInfo({ trip }) {
  const Photo_Ref_Url =
    "https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=" +
    import.meta.env.VITE_GOOGLE_PLACE_KEY;
  const [photo, setPhoto] = useState();
  useEffect(() => {
    trip && GetPlacePhoto();
  }, [trip]);
  const GetPlacePhoto = async () => {
    try {
      const data = {
        textQuery: trip?.userSelections?.location?.label,
      };
      const result = await GetPlaceDetails(data).then((resp) => {
        resp.data.places[0].photos[3].name;
        const photo_url = Photo_Ref_Url.replace(
          "{NAME}",
          resp.data.places[0].photos[3].name
        );
        setPhoto(photo_url);
      });
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-xl border border-slate-100 mb-10 group">
      <img
        src={photo || "/placeholder_img.jpg"}
        className="h-[380px] md:h-[450px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
        alt="Destination"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>
      
      <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full text-white">
        <h2 className="font-extrabold text-3xl md:text-5xl mb-5 drop-shadow-xl">
          {trip?.userSelections?.location?.label}
        </h2>
        
        <div className="flex flex-wrap gap-3 md:gap-4">
          <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold border border-white/30 flex items-center gap-2 shadow-sm transition-colors hover:bg-white/30">
            🗓️ <span className="tracking-wide">{trip?.userSelections?.noOfdays} Days</span>
          </span>
          <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold border border-white/30 flex items-center gap-2 shadow-sm transition-colors hover:bg-white/30">
            💰 <span className="tracking-wide">{trip?.userSelections?.budget} Budget</span>
          </span>
          <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold border border-white/30 flex items-center gap-2 shadow-sm transition-colors hover:bg-white/30">
            🤝 <span className="tracking-wide">{trip?.userSelections?.companions}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
