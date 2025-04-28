import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import SearchInput from '@/components/common/search-input';
import { ButtonNames, HeadersTitle } from '@/types/enum';
import CreateCouponModal from './create-coupon';
import { MultiSelect } from '@/components/common/MultiSelect';

const CouponHeader = () => {
  const [openModal, setOpenModal] = useState(false)
  return (
    <div className="flex flex-col justify-between gap-y-2 md:flex-row md:gap-y-0 mb-[10px] lg-mb-0 gap-[10px]">
      <div className="flex flex-1 flex-wrap items-center justify-between md:flex-none">
        <h1 className="text-[18px] lg:text-[24px] font-semibold text-B2CAgrayn sm:text-xl md:text-xl">{HeadersTitle.COUPON_LISTING} </h1>{' '}
      </div>
      <div className="flex-1 space-y-4 sm:flex sm:items-center sm:gap-4 sm:space-y-0 md:justify-end">
        <div className="w-full lg:w-[300px]">
          <SearchInput
            placeholder="Search by ID or Name"
            onChange={(e) => {
              console.log(e.target.value);
            }}
            className="h-[41px] rounded-lg text-xs text-[#4B4B4B]"
          />
        </div>
        <div className="w-full lg:w-[180px]">
          <MultiSelect
            options={[]}
            onValueChange={(value) => {
              console.log(value);
            }}
            defaultValue={[]}
            placeholder="Select Influencer"
            variant="default"
            color="secondary"
            dataTestId="multi-select-influencer"
            maxCount={1}
            className="h-[32px] rounded-lg bg-[#fff]"
          />
        </div>
        <div className="rounded-lg flex  hover:border-primary  hover:text-white">
          <Button
            size="sm"
            variant="outline"
            color="primary"
            className="h-9 w-[170px] flex-grow-0 rounded-sm bg-primary !px-3 text-[#fff] sm:w-auto max-w-max ml-auto"
            data-testid="create-test-btn"
            onClick={() => setOpenModal(true)}
          >
            <Icon icon="si:add-fill" className="mr-1" />
            {ButtonNames.CREATE_COUPONS}
          </Button>
        </div>
      </div>
      {openModal && <CreateCouponModal onClose={() => setOpenModal(false)} open={openModal} title="ADD COUPON" />}
    </div>
  );
};

export default CouponHeader;
