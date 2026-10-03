import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Star, MapPin, Calendar, Users, IndianRupee, Zap, CreditCard, Search, ArrowRight } from "lucide-react";

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
  "Weekend Getaway",
  "Honeymoon",
  "Solo",
  "Family",
  "Adventure",
  "Budget"
];

const TABS = ["Itinerary", "Hotels", "Flights"];

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
    if (isFocused || prompt.length > 0) return;
    
    const currentFullText = PLACEHOLDER_EXAMPLES[placeholderIndex];
    let typingSpeed = isDeleting ? 30 : 70;

    if (!isDeleting && placeholderText === currentFullText) {
      typingSpeed = 2500;
      setIsDeleting(true);
    } else if (isDeleting && placeholderText === "") {
      setIsDeleting(false);
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_EXAMPLES.length);
      typingSpeed = 500;
    }

    const timeout = setTimeout(() => {
      setPlaceholderText((prev) => 
        isDeleting 
          ? currentFullText.substring(0, prev.length - 1)
          : currentFullText.substring(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [placeholderText, isDeleting, placeholderIndex, isFocused, prompt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "Itinerary") {
      navigate("/create-trip", { state: { prompt, destination, dates, travelers, budget } });
    } else {
      // For now, other tabs just navigate to create-trip as well
      navigate("/create-trip");
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-slate-900 flex flex-col justify-between">
      
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
            className={`w-full h-full object-cover ${index === currentImage ? "animate-ken-burns" : ""}`}
          />
          {/* Lighter overlay with bottom gradient */}
          <div className="absolute inset-0 bg-black/25"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
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
      <div className="relative z-10 flex-grow flex flex-col justify-center items-center text-center px-4 sm:px-6 pt-32 pb-12 w-full max-w-5xl mx-auto">
        
        {/* Subtle Badge */}
        <Link 
          to="/take-ai-help" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6 animate-fade-in-up shadow-lg transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>Tripnexa AI 2.0 is now live</span>
          <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
        </Link>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 animate-fade-in-up delay-100 drop-shadow-lg">
          Be inspired to experience{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 drop-shadow-md">
            the world.
          </span>
        </h1>

        {/* Interactive Search Card */}
        <div className="w-full mt-6 animate-fade-in-up delay-200">
          
          {/* Tabs */}
          <div className="flex justify-center sm:justify-start gap-2 mb-3 px-2">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-t-xl text-sm font-semibold transition-all ${
                  activeTab === tab 
                    ? "bg-white text-slate-900 shadow-[0_-4px_15px_rgba(255,255,255,0.1)]" 
                    : "bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-sm"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Glassmorphism Card */}
          <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-xl rounded-2xl rounded-tl-none p-4 sm:p-6 shadow-2xl border border-white/20 text-left">
            
            {/* AI Prompt Input Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow flex items-center">
                <Sparkles className="absolute left-4 w-5 h-5 text-indigo-500" />
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={isFocused || prompt ? "" : (activeTab === "Itinerary" ? placeholderText : `Search for ${activeTab.toLowerCase()}...`)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-[60px] text-slate-800 placeholder-slate-400 transition-all shadow-inner leading-relaxed overflow-hidden"
                  rows="1"
                  aria-label="Describe your trip"
                />
              </div>
              <button 
                type="submit"
                className="relative overflow-hidden group flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all md:w-auto w-full shadow-lg hover:shadow-xl shrink-0"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_2s_infinite]"></div>
                <span>Generate {activeTab}</span> <Sparkles className="w-5 h-5 text-yellow-400" />
              </button>
            </div>

            {/* Suggestion Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 hide-scrollbar">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Suggestions:</span>
              {SUGGESTION_CHIPS.map(chip => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setPrompt(chip);
                    setIsFocused(true);
                  }}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-slate-200"
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="h-px bg-slate-200 w-full mb-4"></div>

            {/* Quick Search Row (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where to?" 
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  placeholder="Dates" 
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select 
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Travelers</option>
                  <option value="1">1 Traveler</option>
                  <option value="2">2 Travelers</option>
                  <option value="3+">3+ Travelers</option>
                </select>
              </div>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Budget (₹)" 
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                />
              </div>
            </div>
            
          </form>
        </div>
      </div>

      {/* Trust Strip (Normal Flow at Bottom) */}
      <div className="relative z-10 w-full bg-slate-900/60 backdrop-blur-md border-t border-white/10 py-4 px-4 sm:px-8 mt-auto animate-fade-in-up delay-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-300">
          
          {/* Key Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Search className="w-4 h-4 text-blue-400" />
              <span>Real-time prices</span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-3 bg-white/5 rounded-full px-4 py-1.5 border border-white/10">
            <div className="flex text-yellow-400">
              {[...Array(TRUST_RATING)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-xs font-semibold tracking-wide text-white/90">Trusted by {TRUST_TRAVELERS_COUNT} travelers</span>
          </div>
          
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
