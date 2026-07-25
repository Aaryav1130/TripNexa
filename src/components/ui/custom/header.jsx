import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import AuthModal from "../../../constants/authModel.jsx";
import { auth } from "../../../constants/firebase.jsx";
import { Link, useLocation } from "react-router-dom";

import { User, LogOut, ChevronDown } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const firebaseAuth = getAuth();
  const location = useLocation();
  const isHome = location.pathname === "/";
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully!");
      localStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const headerBgClass = isHome 
    ? "absolute top-0 w-full z-50 bg-transparent text-white px-8 py-4 flex justify-between items-center transition-all duration-300" 
    : "sticky top-0 w-full z-50 bg-gradient-to-r from-slate-50 via-white to-blue-50/30 border-b border-gray-200 text-slate-900 px-8 py-2 flex justify-between items-center shadow-sm transition-all duration-300";

  const linkClass = isHome 
    ? "text-sm font-semibold text-white/90 hover:text-white transition-colors"
    : "text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors";

  return (
    <div className={headerBgClass}>
      <Link to="/" className="flex items-center no-underline">
        <img
          src="/logo.jpg"
          alt="Tripnexa Logo"
          className="h-16 w-16 rounded-md object-cover shadow-sm transition-transform hover:scale-105"
        />
      </Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            <div className="hidden md:flex gap-6 items-center">
              <Link to="/take-ai-help" className={linkClass}>AI Help ✨</Link>
              <Link to="/create-trip" className={linkClass}>Create Trip</Link>
              <Link to="/my-trips" className={linkClass}>My Trips</Link>
            </div>

            {/* Profile Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className="flex items-center gap-2 focus:outline-none transition-transform hover:scale-105">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${isHome ? 'bg-white/20 backdrop-blur-md border border-white/30 text-white' : 'bg-slate-900 text-white'}`}>
                  {user.email ? user.email.charAt(0).toUpperCase() : <User size={20} />}
                </div>
                <ChevronDown size={16} className={isHome ? "text-white/80" : "text-gray-500"} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transform transition-all text-slate-900">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.email}
                    </p>
                  </div>
                  
                  {/* Mobile Nav Links inside dropdown */}
                  <div className="md:hidden border-b border-gray-100 py-2">
                    <Link to="/take-ai-help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">AI Help ✨</Link>
                    <Link to="/create-trip" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Create Trip</Link>
                    <Link to="/my-trips" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Trips</Link>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Button
            onClick={() => setIsAuthModalOpen(true)}
            className={`rounded-full px-6 shadow-md transition-transform hover:scale-105 ${isHome ? 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30' : 'bg-black hover:bg-gray-800 text-white'}`}
          >
            Sign In
          </Button>
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
