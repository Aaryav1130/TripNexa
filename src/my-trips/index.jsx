import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserCardItem from './UserCardItem.jsx';
import { LayoutDashboard, Heart, Settings, Map, Plane, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userProfile, setUserProfile] = useState({ name: "", currency: "INR", budget_style: "Moderate" });
  const [activeTab, setActiveTab] = useState("trips"); // 'trips', 'favorites', 'settings'
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (!localUser) {
      navigate("/");
      return;
    }
    setUser(localUser);
    fetchDashboardData(localUser.email);
  }, []);

  const fetchDashboardData = async (email) => {
    setLoading(true);
    try {
      // 1. Fetch Trips
      const tripsRes = await axios.get(`http://localhost:8000/api/trips/user/${email}`);
      if (tripsRes.data) setUserTrips(tripsRes.data);
      
      // 2. Fetch User Profile
      const profileRes = await axios.get(`http://localhost:8000/api/users/${email}`);
      if (profileRes.data) setUserProfile(profileRes.data);
      
      // 3. Fetch Favorites
      const favRes = await axios.get(`http://localhost:8000/api/favorites/${email}`);
      if (favRes.data) setFavorites(favRes.data);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/users/${user.email}`, {
        name: userProfile.name,
        currency: userProfile.currency,
        budget_style: userProfile.budget_style
      });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings", error);
    }
  };

  // Gamified Stats calculations
  const totalTrips = userTrips.length;
  const totalDays = userTrips.reduce((acc, trip) => {
    const days = parseInt(trip?.userSelections?.noOfdays || 0);
    return acc + (isNaN(days) ? 0 : days);
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-20">
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <img 
            src={user?.picture || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
            className="w-24 h-24 rounded-full border-4 border-blue-50 object-cover"
            alt="Profile"
          />
          <div className="text-center sm:text-left flex-grow">
            <h1 className="text-3xl font-extrabold text-slate-800">{userProfile.name || user?.name || "Traveler"}</h1>
            <p className="text-slate-500 font-medium mt-1">{user?.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                Level 1 Explorer
              </span>
              <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold border border-orange-100">
                {totalTrips} Trips Planned
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Sidebar Nav */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('trips')}
              className={`flex items-center gap-3 px-5 py-4 rounded-xl font-bold transition-all text-sm w-full text-left ${activeTab === 'trips' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
            >
              <LayoutDashboard size={18} /> My Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-3 px-5 py-4 rounded-xl font-bold transition-all text-sm w-full text-left ${activeTab === 'favorites' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
            >
              <Heart size={18} /> Saved Places
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-5 py-4 rounded-xl font-bold transition-all text-sm w-full text-left ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
            >
              <Settings size={18} /> Settings
            </button>
          </div>

          {/* Right Main Content */}
          <div className="flex-grow">
            
            {/* TRIPS TAB */}
            {activeTab === 'trips' && (
              <div className="animate-in fade-in duration-300">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1">
                    <div className="text-blue-500 mb-2"><Map size={24} /></div>
                    <div className="text-3xl font-extrabold text-slate-800">{totalTrips}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Trips</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1">
                    <div className="text-orange-500 mb-2"><CalendarDays size={24} /></div>
                    <div className="text-3xl font-extrabold text-slate-800">{totalDays}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Days Traveling</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1 col-span-2 md:col-span-1">
                    <div className="text-green-500 mb-2"><Plane size={24} /></div>
                    <div className="text-xl font-extrabold text-slate-800 mt-2">Ready?</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Plan your next one!</div>
                  </div>
                </div>

                <h2 className="font-extrabold text-2xl text-slate-800 mb-6">Your Trips</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {loading ? (
                    [1,2,3].map((item, index) => (
                      <div key={index} className="h-[250px] w-full bg-slate-200 animate-pulse rounded-2xl"></div>
                    ))
                  ) : userTrips.length > 0 ? (
                    userTrips.map((trip, index) => (
                      <UserCardItem trip={trip} key={index}/>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <p className="text-slate-500 font-medium mb-4">You haven't planned any trips yet.</p>
                      <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-blue-700 transition-colors">Start Planning</Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FAVORITES TAB */}
            {activeTab === 'favorites' && (
              <div className="animate-in fade-in duration-300">
                <h2 className="font-extrabold text-2xl text-slate-800 mb-6">Your Travel Wishlist</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {loading ? (
                    [1,2].map((item, index) => (
                      <div key={index} className="h-[150px] w-full bg-slate-200 animate-pulse rounded-2xl"></div>
                    ))
                  ) : favorites.length > 0 ? (
                    favorites.map((fav, index) => (
                      <div key={index} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="h-32 bg-slate-200 relative">
                           {/* Would load image dynamically here based on fav.place_details if available */}
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                           <div className="absolute bottom-3 left-4 right-4">
                             <h3 className="font-bold text-white text-lg line-clamp-1">{fav.place_name}</h3>
                           </div>
                           <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1.5 shadow-md">
                             <Heart size={14} className="fill-white" />
                           </div>
                        </div>
                        <div className="p-4 flex-grow">
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">
                            {fav.place_type}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <Heart size={40} className="mx-auto text-slate-300 mb-3" />
                      <p className="text-slate-500 font-medium">Your wishlist is empty.</p>
                      <p className="text-slate-400 text-sm mt-1">Look for the ❤️ icon on hotels and activities!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="animate-in fade-in duration-300">
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                  <h2 className="font-extrabold text-2xl text-slate-800 mb-6">Profile Settings</h2>
                  
                  <form onSubmit={saveSettings} className="flex flex-col gap-6 max-w-md">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Display Name</label>
                      <input 
                        type="text" 
                        value={userProfile.name}
                        onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Default Currency</label>
                      <select 
                        value={userProfile.currency}
                        onChange={(e) => setUserProfile({...userProfile, currency: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium bg-white"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Default Travel Style</label>
                      <select 
                        value={userProfile.budget_style}
                        onChange={(e) => setUserProfile({...userProfile, budget_style: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium bg-white"
                      >
                        <option value="Cheap">Cheap / Backpacker</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Luxury">Luxury</option>
                      </select>
                    </div>

                    <button 
                      type="submit"
                      className="mt-4 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-colors shadow-md w-full"
                    >
                      Save Preferences
                    </button>
                  </form>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
