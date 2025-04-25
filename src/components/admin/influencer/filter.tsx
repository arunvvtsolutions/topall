'use client';

import React, { useState } from 'react';
import SearchInput from '@/components/common/search-input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import AddInfluencerForm from './add-influencer';
import { InfluencerTitles } from '@/types/enum';

type Influencer = {
  imageUrl: string;
  name: string;
  id: string;
  price: string;
  people: string;
  socialMedia: string[];
};

type FilterProps = {
  data: Influencer[];
  onFilter: (filteredResults: Influencer[]) => void;
};

const Filter: React.FC<FilterProps> = ({ data, onFilter }) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showFormModal, setFormShowModal] = useState<boolean>(false);

  const onSearchChange = (value: string) => {
    setSearchValue(value);
    applyFilter(value, selectedPlatform);
  };

  const handlePlatformFilter = (platform: string) => {
    const newPlatform = selectedPlatform === platform ? null : platform;
    setSelectedPlatform(newPlatform);
    applyFilter(searchValue, newPlatform);
  };

  const applyFilter = (search: string, platform: string | null) => {
    const filteredResults = data.filter((influencer) => {
      const matchesSearch =
        influencer.name.toLowerCase().includes(search.toLowerCase()) ||
        influencer.id.toLowerCase().includes(search.toLowerCase());
      const matchesPlatform = platform ? influencer.socialMedia.includes(platform) : true;
      return matchesSearch && matchesPlatform;
    });

    onFilter(filteredResults); 
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
        {/* Search Input */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-full md:w-[300px]">
            <SearchInput
              placeholder="Search by ID or Name"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-8 text-xs text-B2CAgray rounded-[4px]"
            />
          </div>

          {/* Filter Buttons */}
          <Button
            className={`h-8 flex items-center gap-2 px-4 py-2 border ${
              selectedPlatform === 'YouTube' ? 'bg-white ' : 'bg-[#F4F4F4] text-B2CAgray'
            }`}
            onClick={() => handlePlatformFilter('YouTube')}
          >
            <Icon icon="logos:youtube-icon" /> {InfluencerTitles.YOUTUBE}
          </Button>
          <Button
            className={`h-8 flex items-center gap-2 px-4 py-2 border ${
              selectedPlatform === 'Instagram' ? 'bg-white ' : 'bg-[#F4F4F4] text-B2CAgray'
            }`}
            onClick={() => handlePlatformFilter('Instagram')}
          >
            <Icon icon="skill-icons:instagram" /> {InfluencerTitles.INSTAGRAM}
          </Button>
          {/* <Button className="h-8 flex items-center gap-2 px-4 py-2 bg-[#F4F4F4] text-B2CAgray border">
            <Icon icon="mage:filter-fill" /> {InfluencerTitles.FILTER}
          </Button> */}
        </div>

        {/* Create Influencer Button */}
        <Button className="h-[34px] flex items-center gap-2 text-sm px-4 py-2 text-white bg-[#000080]"  size="default"
              variant="default"
              color="primary"
              data-testid="testtype-submit-btn"
           onClick={() => setFormShowModal(true)}>
          <Icon icon="mingcute:add-fill" /> {InfluencerTitles.CREATE_INFLUENCER}
        </Button>
      </div>

      {showFormModal && (
        <AddInfluencerForm
          isOpen={showFormModal}
          onClose={() => setFormShowModal(false)}
        />
      )}
    </>
  );
};

export default Filter;
