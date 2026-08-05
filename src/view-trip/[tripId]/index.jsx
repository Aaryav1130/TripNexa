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
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
        {/* User Selected Information */}
        <SelectedInfo trip={trip}/>
        {/* Hotels List */}
        <Hotels trip={trip}/>
        {/* Itineray */}
        <PlacesToVisit trip={trip}/>
        {/* Footer */}
        <Footer />
    </div>
  )
}
