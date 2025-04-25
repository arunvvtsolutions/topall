'use client';
import { useState } from 'react';
import influencerData from './data.json';
import Filter from './filter';
import headerData from './header/data.json';
import InfluencerCard from './header/influencer-card';
import ProfileCard from './profile';
import DateRangePicker from '../students/date-range-picker';
import { useMediaQuery } from '@/hooks/use-media-query';

// Define pagination settings
const ITEMS_PER_PAGE = 7;
const Influencer = () => {
  const isMd = useMediaQuery('(min-width: 489px)');
  const [filteredData, setFilteredData] = useState(influencerData);

  // Function to handle filtering
  const handleFilter = (filteredResults: typeof influencerData) => {
    setFilteredData(filteredResults);
  };
  const handleDateSelect = (date: any) => {
    console.log('date', date);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex flex-wrap justify-between items-center">
        <h2 className='text-[#222222] text-2xl font-medium'>
        Influencers 
        </h2>
        <DateRangePicker
          className={`${isMd ? 'w-auto' : 'w-full'} rounded-md border border-borderad bg-white`}
          onChange={handleDateSelect}
        />
      </div>

      <div className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {headerData.map((item, index) => (
          <InfluencerCard key={index} {...item} />
        ))}
      </div>

      <div className="mb-5">
        <Filter data={influencerData} onFilter={handleFilter} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {filteredData.map((profile, index) => (
          <ProfileCard key={index} {...profile} />
        ))}
      </div>
    </div>
  );
};

export default Influencer;
