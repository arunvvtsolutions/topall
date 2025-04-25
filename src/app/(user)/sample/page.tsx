import Payment from '@/components/payment/Form';
import React from 'react';

const SamplePage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Complete Your Purchase</h1>
      <Payment />
    </div>
  )
};

export default SamplePage;
