import React from 'react'
import { Link } from 'react-router-dom'
import HotelCardItems from './HotelCardItems';

export default function Hotels({trip}) {
    return (
    <div className='mb-10'>
      <h2 className='font-bold text-2xl mt-5 mb-4'>Hotel Recommendations</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {trip?.TripData?.hotelOptions?.map((hotel, index) => (
          <HotelCardItems key={index} hotel={hotel} />
        ))}
      </div>
    </div>
      );
      
}
