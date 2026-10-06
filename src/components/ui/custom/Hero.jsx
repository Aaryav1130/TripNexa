import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Star, MapPin, Calendar, Users, IndianRupee, ArrowRight, Umbrella, Heart, Backpack, Building2, Plane } from "lucide-react";

const BACKGROUND_IMAGES = [
  { url: "/travel-bg-1.jpg", label: "📍 Swiss Alps" },
  { url: "/travel-bg-2.jpg", label: "📍 Kyoto, Japan" },
  { url: "/travel-bg-3.jpg", label: "📍 Amalfi Coast" }
];

const PLACEHOLDER_EXAMPLES = [
  "5 days in Bali under ₹60k with beaches and good food",
  "Romantic weekend in Udaipur",
  "Family trip to Manali in December",
  "Solo backpacking in Vietnam for 10 days"
];

const SUGGESTION_CHIPS = [
  { label: "Weekend Getaway", icon: Umbrella },
  { label: "Honeymoon", icon: Heart },
  { label: "Solo", icon: Backpack },
  { label: "Family", icon: Users }
];

const TABS = [
  { name: "Itinerary", icon: Sparkles },
  { name: "Hotels", icon: Building2 },
  { name: "Flights", icon: Plane }
];

const TRUST_RATING = 5;
const TRUST_TRAVELERS_COUNT = "10,000+";

export default function Hero() {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState("Itinerary");
  
  // Form State
  const [prompt, setPrompt] = useState("");
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");
  const [travelers, setTravelers] = useState("");
  const [budget, setBudget] = useState("");

  // Typing Effect State
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Background Slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Animated Placeholder Typing
  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setPlaceholderText(PLACEHOLDER_EXAMPLES[0]);
      return;
    }

    if (isFocused || prompt.length > 0) return;
    
    const currentString = PLACEHOLDER_EXAMPLES[placeholderIndex];
    let timeoutId;

    if (!isDeleting && placeholderText.length < currentString.length) {
      timeoutId = setTimeout(() => {
        setPlaceholderText(currentString.slice(0, placeholderText.length + 1));
      }, 40);
    } else if (!isDeleting && placeholderText.length === currentString.length) {
      timeoutId = setTimeout(() => {
        setIsDeleting(true);
      }, 1500);
    } else if (isDeleting && placeholderText.length > 0) {
      timeoutId = setTimeout(() => {
        setPlaceholderText(currentString.slice(0, placeholderText.length - 1));
      }, 25);
    } else if (isDeleting && placeholderText.length === 0) {
      setIsDeleting(false);
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_EXAMPLES.length);
    }

    return () => clearTimeout(timeoutId);
  }, [placeholderText, isDeleting, placeholderIndex, isFocused, prompt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "Itinerary") {
      navigate("/create-trip", { state: { prompt, destination, dates, travelers, budget } });
    } else {
      navigate("/create-trip");
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-slate-900 flex flex-col justify-center">
      
      {/* Background Slideshow */}
      {BACKGROUND_IMAGES.map((img, index) => (
        <div
          key={img.url}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImage ? "opacity-100 z-0" : "opacity-0 -z-10"
          }`}
        >
          <img
            src={img.url}
            alt="Travel Destination"
            className={`w-full h-full object-cover motion-safe:animate-ken-burns ${index === currentImage ? "scale-100" : "scale-105"}`}
          />
          {/* Lighter overlay with bottom gradient */}
          <div className="absolute inset-0 bg-black/25"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        </div>
      ))}

      {/* Image Info & Indicators */}
      <div className="absolute top-24 right-8 z-10 flex flex-col items-end gap-3 animate-fade-in-up">
        <div className="flex gap-2">
          {BACKGROUND_IMAGES.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentImage ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <div className="text-white/80 text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
          {BACKGROUND_IMAGES[currentImage].label}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center px-4 sm:px-6 pt-16">
        
        {/* Subtle Badge */}
        <Link 
          to="/take-ai-help" 
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-medium mb-5 animate-fade-in-up shadow-lg transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>Tripnexa AI 2.0 is now live</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-70" />
        </Link>

        {/* Main Headline */}
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight text-white mb-3 max-w-3xl animate-fade-in-up delay-100 drop-shadow-lg">
          Your next trip,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 drop-shadow-md">
            planned in seconds.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-gray-200 mb-8 max-w-xl animate-fade-in-up delay-200 drop-shadow-md">
          AI-crafted itineraries, hotels and daily plans, all in one place.
        </p>

        {/* Interactive Search Card */}
        <div className="w-full animate-fade-in-up delay-200">
          
          {/* Tabs */}
          <div className="flex justify-start gap-2 mb-2 px-1">
            {TABS.map(tab => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === tab.name 
                    ? "bg-white text-slate-900 shadow-md" 
                    : "bg-white/10 text-white/80 hover:bg-white/15 backdrop-blur-sm"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.name}
              </button>
            ))}
          </div>

          {/* Glassmorphism Card */}
          <div className="p-[1.5px] rounded-2xl bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-yellow-300 shadow-2xl shadow-indigo-500/20">
            <form onSubmit={handleSubmit} className="bg-slate-900/90 backdrop-blur-xl rounded-[15px] p-4 text-left">
              
              {/* AI Prompt Input Row */}
              <div className="flex flex-col md:flex-row gap-3 mb-3">
                <div className="relative flex-grow flex items-center">
                  <Sparkles className="absolute left-3 w-4 h-4 text-indigo-300" />
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={isFocused || prompt ? "" : (activeTab === "Itinerary" ? placeholderText : `Search for ${activeTab.toLowerCase()}...`)}
                    className="w-full pl-9 pr-3 h-11 bg-white/5 border border-white/15 rounded-lg text-sm text-white placeholder-slate-300 focus:ring-2 focus:ring-indigo-400/60 focus:border-transparent outline-none transition-all shadow-inner"
                    aria-label="Describe your trip"
                  />
                </div>
                <button 
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white h-11 px-5 rounded-lg font-semibold text-sm hover:brightness-110 transition-all md:w-auto w-full shadow-lg shrink-0"
                >
                  Generate {activeTab} <Sparkles className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestion Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-3 whitespace-nowrap hide-scrollbar">
                {SUGGESTION_CHIPS.map(chip => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => {
                      setPrompt(chip.label);
                      setIsFocused(true);
                    }}
                    className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full bg-white/10 text-slate-100 border border-white/10 hover:bg-white/20 transition-colors text-xs"
                  >
                    <chip.icon className="w-3.5 h-3.5 opacity-80" />
                    {chip.label}
                  </button>
                ))}
              </div>

              <div className="h-px bg-white/10 w-full mb-3"></div>

              {/* Quick Search Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where to?" 
                    className="w-full pl-9 pr-3 h-10 bg-white/5 border border-white/15 rounded-lg text-sm text-white placeholder-slate-300 focus:ring-2 focus:ring-indigo-400/60 outline-none"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    placeholder="Dates" 
                    className="w-full pl-9 pr-3 h-10 bg-white/5 border border-white/15 rounded-lg text-sm text-white placeholder-slate-300 focus:ring-2 focus:ring-indigo-400/60 outline-none"
                  />
                </div>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <select 
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className="w-full pl-9 pr-3 h-10 bg-white/5 border border-white/15 rounded-lg text-sm text-white focus:ring-2 focus:ring-indigo-400/60 outline-none appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="text-slate-800">Travelers</option>
                    <option value="1" className="text-slate-800">1 Traveler</option>
                    <option value="2" className="text-slate-800">2 Travelers</option>
                    <option value="3+" className="text-slate-800">3+ Travelers</option>
                  </select>
                </div>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="Budget (₹)" 
                    className="w-full pl-9 pr-3 h-10 bg-white/5 border border-white/15 rounded-lg text-sm text-white placeholder-slate-300 focus:ring-2 focus:ring-indigo-400/60 outline-none"
                  />
                </div>
              </div>
              
            </form>
          </div>
        </div>
        
        {/* Trust Strip */}
        <div className="mt-5 text-xs text-slate-300/80 animate-fade-in-up delay-300 flex items-center justify-center">
          Free to start &middot; No credit card required &middot;{" "}
          <span className="flex text-yellow-400 mx-1">
            {[...Array(TRUST_RATING)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </span>
          {" "}{TRUST_TRAVELERS_COUNT} travelers
        </div>

      </div>

      {/* Hide Scrollbar for Chips */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
