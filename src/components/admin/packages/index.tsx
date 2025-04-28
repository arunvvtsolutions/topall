'use client';
import AdminSectionHeader from '@/components/common/admin-header';
import DateRangePicker from '@/components/common/date-range-picker';
import React from 'react';
import PurchaseDetailsTable from './purchase-details-table';
import { Card } from '@/components/ui/card';
import PurchaseCard from './purchase-analytics-card';
import { purchaseAnalytics } from './mock-data';

const Packages = () => {
  const handleDateSelect = (date: any) => {
    console.log('date', date);
  };
  return (
    <div className="mx-2 h-full min-h-[calc(100vh-6.97rem)] sm:mx-2 md:mx-2 lg:mx-2 xl:mx-6">
      <AdminSectionHeader
        title=""
        action={
          <DateRangePicker
            className={`w-full rounded-md border border-borderad bg-white !text-[#4B4B4B] sm:w-auto`}
            onChange={handleDateSelect}
          />
        }
      />
      <Card className="mb-4 w-full overflow-hidden">
        <div className="grid h-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <PurchaseCard
            title={purchaseAnalytics.totalPurchases.title}
            value={purchaseAnalytics.totalPurchases.value}
            percentageChange={purchaseAnalytics.totalPurchases.percentageChange}
            showIcon={purchaseAnalytics.totalPurchases.showIcon}
            index={0}
            totalItems={4}
            className="pr-[90px] sm:pr-0"
            seperatorClass="2xl:mr-10 xl:mr-2 mr-0"
            status={purchaseAnalytics.totalPurchases.status}
          />
          <PurchaseCard
            title={purchaseAnalytics.neet.title}
            value={purchaseAnalytics.neet.value}
            percentageChange={purchaseAnalytics.neet.percentageChange}
            showIcon={purchaseAnalytics.neet.showIcon}
            index={1}
            totalItems={4}
            status={purchaseAnalytics.neet.status}
            seperatorClass="2xl:mr-10 xl:mr-2 mr-0"
          />
          <PurchaseCard
            title={purchaseAnalytics.jee.title}
            value={purchaseAnalytics.jee.value}
            percentageChange={purchaseAnalytics.jee.percentageChange}
            showIcon={purchaseAnalytics.jee.showIcon}
            index={2}
            totalItems={4}
            className="sm:pl-[96px] lg:pl-0"
            seperatorClass="2xl:mr-10 xl:mr-2 mr-0"
            status={purchaseAnalytics.jee.status}
          />
          <PurchaseCard
            title={purchaseAnalytics.cbse.title}
            value={purchaseAnalytics.cbse.value}
            percentageChange={purchaseAnalytics.cbse.percentageChange}
            showIcon={purchaseAnalytics.cbse.showIcon}
            index={3}
            totalItems={4}
            status={purchaseAnalytics.cbse.status}
          />
        </div>
      </Card>
      <div>
        <PurchaseDetailsTable />
      </div>
    </div>
  );
};

export default Packages;
