import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck, Star } from "lucide-react";

const backgroundImages = [
  "/travel-bg-1.jpg",
  "/travel-bg-2.jpg",
  "/travel-bg-3.jpg"
];

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 6000); // Change image every 6 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900">
      
      {/* Background Slideshow */}
      {backgroundImages.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={img}
            alt="Travel Destination"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay to ensure text is always readable */}
          <div className="absolute inset-0 bg-black/40"></div>
          {/* Gradient overlay from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-center text-center px-6 pt-20">
        
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8 animate-fade-in-up shadow-lg">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>Tripnexa AI 2.0 is now live</span>
        </div>

        {/* Main Headline */}
        <h1 className="max-w-5xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-8 animate-fade-in-up delay-100 drop-shadow-lg">
          Be inspired to experience{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 drop-shadow-md">
            the world.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="max-w-2xl text-lg sm:text-xl leading-8 text-gray-200 mb-10 animate-fade-in-up delay-200 drop-shadow-md font-medium">
          Say goodbye to dozens of open tabs. Tripnexa's AI analyzes millions of data points to instantly generate hyper-personalized itineraries, hand-picked hotel options, and seamless daily schedules.
        </p>

        {/* Call to Actions */}
        <div className="flex items-center gap-4 mb-16 animate-fade-in-up delay-300">
          <Link to="/create-trip">
            <button className="flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.7)] hover:-translate-y-1">
              Generate Free Itinerary <Sparkles className="w-5 h-5 text-yellow-500" />
            </button>
          </Link>
        </div>

        {/* Trust Markers */}
        <div className="absolute bottom-12 flex flex-col sm:flex-row items-center gap-6 text-sm text-gray-300 animate-fade-in-up delay-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <span>Bank-grade Security</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-500"></div>
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span>Trusted by 10,000+ travelers</span>
          </div>
        </div>

      </div>
    </div>
  );
}
