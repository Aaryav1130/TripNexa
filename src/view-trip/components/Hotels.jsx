import React, { useState, useMemo } from 'react';
import HotelCardItems from './HotelCardItems';
import { Search, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Hotels({ trip }) {
  const destination = trip?.userSelections?.location?.label || "";
  
  // Filter States
  const [budgetRange, setBudgetRange] = useState(50000);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState('Best match');
  
  // Checkbox States
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(destination)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  // --- MOCK AMENITIES ENRICHMENT ---
  // Since AI doesn't return amenities, we pseudo-randomly assign them based on hotelName length to make filters functional.
  const enrichHotelData = (hotels) => {
    return hotels.map(hotel => {
      const seed = hotel?.hotelName?.length || 5;
      
      const amenities = [];
      if (seed % 2 === 0 || seed > 15) amenities.push("Free Breakfast");
      if (seed % 3 === 0) amenities.push("Pool");
      if (seed % 4 === 0) amenities.push("Golf course [on-site]");
      if (seed % 5 === 0) amenities.push("Facilities for disabled guests");
      if (parseFloat(hotel?.ratings || 4) >= 4.5) amenities.push("Excellent Location");

      let type = "Hotel";
      if (hotel?.hotelName?.toLowerCase().includes("hostel")) type = "Hostel";
      else if (hotel?.hotelName?.toLowerCase().includes("resort")) type = "Resort";
      else if (hotel?.hotelName?.toLowerCase().includes("apartment")) type = "Serviced apartment";
      else if (seed % 7 === 0) type = "Entire homes & apartments";

      // Parse price cleanly, accommodating both old string formats and new raw integers
      let rawPrice = 0;
      if (typeof hotel.pricePerNight === 'number') {
        rawPrice = hotel.pricePerNight;
      } else if (hotel.pricePerNight) {
        const match = String(hotel.pricePerNight).match(/[\d,]+/);
        rawPrice = match ? parseInt(match[0].replace(/,/g, '')) : 0;
      }

      return {
        ...hotel,
        mockAmenities: amenities,
        mockType: type,
        parsedPrice: rawPrice
      };
    });
  };

  // --- FILTERING & SORTING LOGIC ---
  const filteredAndSortedHotels = useMemo(() => {
    let hotels = enrichHotelData(trip?.TripData?.hotelOptions || []);

    // 1. Text Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      hotels = hotels.filter(h => h.hotelName?.toLowerCase().includes(q) || h.address?.toLowerCase().includes(q));
    }

    // 2. Budget Filter
    hotels = hotels.filter(h => h.parsedPrice <= budgetRange);

    // 3. Amenities Filter
    if (selectedAmenities.length > 0) {
      hotels = hotels.filter(h => selectedAmenities.every(amenity => h.mockAmenities.includes(amenity)));
    }

    // 4. Property Type Filter
    if (selectedTypes.length > 0) {
      hotels = hotels.filter(h => selectedTypes.includes(h.mockType));
    }

    // 5. Sorting
    if (sortBy === 'Price: Low to High') {
      hotels.sort((a, b) => a.parsedPrice - b.parsedPrice);
    } else if (sortBy === 'Price: High to Low') {
      hotels.sort((a, b) => b.parsedPrice - a.parsedPrice);
    } else if (sortBy === 'Top reviewed') {
      hotels.sort((a, b) => parseFloat(b.ratings || 0) - parseFloat(a.ratings || 0));
    }

    return hotels;
  }, [trip, searchQuery, budgetRange, selectedAmenities, selectedTypes, sortBy]);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredAndSortedHotels.length / itemsPerPage);
  const currentHotels = filteredAndSortedHotels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page to 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, budgetRange, selectedAmenities, selectedTypes, sortBy]);

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleTypeChange = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className='mb-16 mt-8'>
      
      {/* Top Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className='font-extrabold text-2xl text-slate-800'>
            {filteredAndSortedHotels.length} properties in {destination.split(',')[0]}
          </h2>
        </div>
        <div className="hidden md:block">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm text-slate-700 bg-white outline-none focus:border-blue-500 cursor-pointer shadow-sm hover:border-slate-400 transition-colors"
          >
            <option>Best match</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Top reviewed</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Sidebar (Filters & Map) */}
        <div className="w-full lg:w-1/4 shrink-0 flex flex-col gap-6 sticky top-24">
          
          {/* Map Feature */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm relative h-[220px] group cursor-pointer">
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
            <div className="absolute inset-0 bg-blue-900/10 pointer-events-none group-hover:bg-transparent transition-colors flex items-center justify-center">
              <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-lg pointer-events-auto hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2">
                <MapPin size={18}/> Search on Map
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative shadow-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by hotel name" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-full py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-slate-300"
            />
          </div>

          {/* Budget Filter */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 text-sm">Your budget (per night)</h3>
            <input 
              type="range" 
              min="0" 
              max="100000" 
              step="500"
              value={budgetRange}
              onChange={(e) => setBudgetRange(Number(e.target.value))}
              className="w-full accent-blue-600 mb-4"
            />
            <div className="flex items-center justify-between gap-4">
              <div className="border border-slate-200 rounded-md px-3 py-1.5 w-full text-xs text-slate-600 bg-slate-50">
                <span className="text-slate-400 mr-1 block text-[10px] mb-0.5">MIN</span> Rs. 0
              </div>
              <div className="border border-slate-200 rounded-md px-3 py-1.5 w-full text-xs text-slate-600 bg-slate-50">
                <span className="text-slate-400 mr-1 block text-[10px] mb-0.5">MAX</span> Rs. {budgetRange.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Popular Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-3 text-sm">Popular filters</h3>
            <div className="flex flex-col gap-3">
              {['Golf course [on-site]', 'Facilities for disabled guests', 'Excellent Location', 'Free Breakfast', 'Pool'].map((filter, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedAmenities.includes(filter)}
                    onChange={() => handleAmenityChange(filter)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors select-none">{filter}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Property Types */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-3 text-sm">Property type</h3>
            <div className="flex flex-col gap-3">
              {['Hotel', 'Hostel', 'Resort', 'Serviced apartment', 'Entire homes & apartments'].map((type, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeChange(type)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors select-none">{type}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Right Main Content (Hotel List) */}
        <div className="w-full lg:w-3/4 flex flex-col gap-4">
          
          {/* Promo Banner */}
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-start gap-3 shadow-sm">
             <div className="bg-red-500 text-white rounded-full p-1.5 shrink-0 mt-0.5">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
             </div>
             <div>
               <h4 className="text-red-600 font-bold text-sm">Hurry! 47% of properties on our site are fully booked!</h4>
               <p className="text-slate-600 text-xs mt-0.5">Rooms in {destination.split(',')[0]} are in high demand on your selected dates. Reserve yours now before prices go up.</p>
             </div>
          </div>

          {filteredAndSortedHotels.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-700 mb-2">No properties found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your filters or search query to see more results.</p>
              <button 
                onClick={() => {setBudgetRange(100000); setSearchQuery(""); setSelectedAmenities([]); setSelectedTypes([]);}}
                className="mt-4 text-blue-600 font-medium hover:underline text-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5 mt-2">
              {currentHotels.map((hotel, index) => (
                // Pass the enriched raw price so the card doesn't have to guess
                <HotelCardItems key={index} hotel={hotel} index={index} rawPrice={hotel.parsedPrice} />
              ))}
            </div>
          )}

          {/* Pagination UI */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 mb-4">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex justify-center items-center rounded-full hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 flex justify-center items-center rounded-full text-sm font-bold transition-all ${
                    currentPage === i + 1 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex justify-center items-center rounded-full hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
          
        </div>
        
      </div>
    </div>
  );
}
