import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageCarousel({ photos, className }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Default placeholder if no photos are provided
  if (!photos || photos.length === 0) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400">No Image Available</span>
      </div>
    );
  }

  const prevSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? photos.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isLastSlide = currentIndex === photos.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className={`relative group overflow-hidden ${className}`}>
      {/* Images container */}
      <div 
        className="flex transition-transform ease-out duration-500 h-full w-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {photos.map((photoUrl, index) => (
          <div key={index} className="h-full w-full shrink-0">
            <img
              src={photoUrl}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows (visible only on hover if more than 1 image) */}
      {photos.length > 1 && (
        <>
          <div 
            onClick={prevSlide}
            className="absolute top-1/2 left-2 -translate-y-1/2 p-1 rounded-full bg-white/80 text-gray-800 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md z-10"
          >
            <ChevronLeft size={20} />
          </div>
          <div 
            onClick={nextSlide}
            className="absolute top-1/2 right-2 -translate-y-1/2 p-1 rounded-full bg-white/80 text-gray-800 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md z-10"
          >
            <ChevronRight size={20} />
          </div>
        </>
      )}

      {/* Dots Indicators */}
      {photos.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
          {photos.map((_, index) => (
            <div
              key={index}
              className={`transition-all w-1.5 h-1.5 bg-white rounded-full ${
                currentIndex === index ? "opacity-100 scale-125" : "opacity-50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
