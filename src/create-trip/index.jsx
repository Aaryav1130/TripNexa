import React, { useEffect, useState } from "react";
import { db, auth } from "../constants/firebase.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import AuthModal from "../constants/authModel.jsx";
import {
  SelectBudgetOptions,
  SelectTravelsList,
} from "../constants/options";
import axios from 'axios';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

export default function CreateTrip() {
  const [formData, setFormData] = useState({});
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [place, setPlace] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledDestination = searchParams.get("destination");

  // If a destination was passed via query param, pre-fill it
  useEffect(() => {
    if (prefilledDestination) {
      const locationObj = { label: prefilledDestination, value: { description: prefilledDestination } };
      setPlace(locationObj);
      handleInputChange('location', locationObj);
    }
  }, [prefilledDestination]);

  // Calculate number of days from date range
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        handleInputChange("noOfdays", String(diffDays));
      }
    }
  }, [startDate, endDate]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData?.location) {
      toast("Please select a destination");
      return false;
    }
    if (!startDate || !endDate) {
      toast("Please select your travel dates");
      return false;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      toast("Return date must be after departure date");
      return false;
    }
    if (!formData?.budget) {
      toast("Please select your budget");
      return false;
    }
    if (!formData?.companions) {
      toast("Please select who you're traveling with");
      return false;
    }
    return true;
  };
  
  const onGenerateTrip = async () => {
    if (!validateForm()) return;
    
    if (!auth.currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.email) {
        toast.error("User email not found. Please log in again.");
        return;
    }

    try {
      setLoading(true);
      
      const payload = {
          location: formData.location,
          noOfdays: String(formData.noOfdays),
          budget: formData.budget,
          companions: formData.companions,
          userEmail: user.email
      };

      const response = await axios.post("http://localhost:8000/api/trips/generate", payload);
      
      if (response.data && response.data.trip_id) {
          navigate('/view-trip/' + response.data.trip_id);
      } else {
          toast.error("Failed to retrieve trip ID from server.");
      }
      
    } catch (error) {
      console.error('Error generating trip:', error);
      toast.error('Error generating trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD for min attribute
  const today = new Date().toISOString().split('T')[0];

  // Calculate displayed days
  const calculatedDays = startDate && endDate
    ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-5 sm:px-10 md:px-32 lg:px-56 xl:px-72">
      
      {/* Header Section */}
      <div className="text-center mb-16">
        <h2 className="font-extrabold text-4xl md:text-5xl tracking-tight text-slate-900 mb-4">
          {prefilledDestination ? (
            <>
              Your Trip to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{prefilledDestination}</span> 🏕️
            </>
          ) : (
            <>
              Tell Us About Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Dream Trip</span> 🏕️
            </>
          )}
        </h2>
        <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto">
          {prefilledDestination
            ? `Pick your travel dates, budget, and companions — we'll handle the rest!`
            : `We'll tailor your travel experience to match your style and preferences. Just answer a few quick questions to get started!`
          }
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">
        <div className="flex flex-col gap-10">
          
          {/* Location Search — only show if NOT pre-filled from destination card */}
          {!prefilledDestination && (
            <div className="group">
              <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">📍</span> 
                Where would you like to explore?
              </h2>
              <div className="border border-slate-200 rounded-xl shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                <GooglePlacesAutocomplete
                  apiKey={import.meta.env.VITE_GOOGLE_PLACE_KEY}
                  selectProps={{
                    place,
                    onChange: (v) => {
                      setPlace(v);
                      handleInputChange('location', v);
                    },
                    placeholder: "Search for a destination...",
                    styles: {
                      control: (provided) => ({
                        ...provided,
                        border: 'none',
                        boxShadow: 'none',
                        padding: '8px',
                        borderRadius: '0.75rem',
                        fontSize: '1.05rem',
                      }),
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Pre-filled destination banner */}
          {prefilledDestination && (
            <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100">
              <span className="bg-blue-600 text-white p-3 rounded-xl text-2xl">📍</span>
              <div>
                <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">Destination</p>
                <h3 className="text-2xl font-extrabold text-slate-800">{prefilledDestination}</h3>
              </div>
            </div>
          )}

          {/* Date Range Picker */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">📅</span>
              When are you traveling?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Departure</label>
                <input
                  type="date"
                  min={today}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-slate-200 rounded-xl p-4 w-full bg-white shadow-sm text-lg outline-none transition-all focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Return</label>
                <input
                  type="date"
                  min={startDate || today}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-slate-200 rounded-xl p-4 w-full bg-white shadow-sm text-lg outline-none transition-all focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>
            {calculatedDays > 0 && (
              <div className="mt-3 inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold border border-indigo-100">
                🗓️ {calculatedDays} {calculatedDays === 1 ? 'day' : 'days'} trip
              </div>
            )}
          </div>

          {/* Budget Selection */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="bg-green-100 text-green-600 p-2 rounded-lg">💰</span>
              What is your budget?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-4">
              {SelectBudgetOptions.map((item, index) => {
                const isSelected = formData?.budget === item.title;
                return (
                  <div
                    key={index}
                    onClick={() => handleInputChange("budget", item.title)}
                    className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.02] ${
                      isSelected 
                        ? "border-blue-600 bg-blue-50/50 shadow-md ring-4 ring-blue-500/10" 
                        : "border-slate-100 hover:border-blue-300 hover:shadow-lg bg-white"
                    }`}
                  >
                    <div className="text-4xl mb-3 bg-white w-16 h-16 flex items-center justify-center rounded-xl shadow-sm border border-slate-50">{item.icon}</div>
                    <h2 className="font-bold text-xl text-slate-800 mb-1">{item.title}</h2>
                    <h2 className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</h2>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Travelers Selection */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="bg-purple-100 text-purple-600 p-2 rounded-lg">🤝</span>
              Who are you traveling with?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-4">
              {SelectTravelsList.map((item, index) => {
                const isSelected = formData?.companions === item.people;
                return (
                  <div
                    key={index}
                    onClick={() => handleInputChange("companions", item.people)}
                    className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ease-in-out hover:scale-[1.02] ${
                      isSelected 
                        ? "border-blue-600 bg-blue-50/50 shadow-md ring-4 ring-blue-500/10" 
                        : "border-slate-100 hover:border-blue-300 hover:shadow-lg bg-white"
                    }`}
                  >
                    <div className="text-4xl mb-3 bg-white w-16 h-16 flex items-center justify-center rounded-xl shadow-sm border border-slate-50">{item.icon}</div>
                    <h2 className="font-bold text-xl text-slate-800 mb-1">{item.title}</h2>
                    <h2 className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</h2>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Generate Button */}
        <div className="mt-12 flex justify-center border-t border-slate-100 pt-8">
          <Button 
            disabled={loading} 
            onClick={onGenerateTrip}
            className="w-full sm:w-auto px-12 py-7 text-lg font-bold rounded-2xl shadow-xl shadow-blue-600/20 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            {loading ? (
              <>
                <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin mr-3"/> 
                Generating AI Itinerary...
              </>
            ) : (
              'Generate Trip ✨'
            )}
          </Button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}

