import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import SelectedInfo from '../components/SelectedInfo';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';

export default function Viewtrip() {
    const {tripId} = useParams();
    const [trip, setTrip] = useState([]);

    useEffect(()=>{
        tripId&&getTripData();
    },[tripId]);

    const getTripData = async() => {
        try {
            const response = await axios.get(`http://localhost:8000/api/trips/${tripId}`);
            if (response.data) {
                console.log("Doc: ", response.data);
                setTrip(response.data);
            }
        } catch (error) {
            console.error("Error fetching trip:", error);
            toast("NO TRIP FOUND!!!")
        }
    }
    
  return (
    <div className='relative min-h-screen p-6 md:p-10 md:px-20 lg:px-44 xl:px-56 bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 overflow-hidden'>
        {/* Decorative blurred blobs for background texture */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob pointer-events-none"></div>
        <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-fuchsia-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000 pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-yellow-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000 pointer-events-none"></div>
        
        {/* Main Content (with relative z-index) */}
        <div className="relative z-10">
            {/* User Selected Information */}
            <SelectedInfo trip={trip}/>
            {/* Hotels List */}
            <Hotels trip={trip}/>
            {/* Itinerary */}
            <PlacesToVisit trip={trip}/>
            {/* Footer */}
            <Footer />
        </div>
    </div>
  )
}
