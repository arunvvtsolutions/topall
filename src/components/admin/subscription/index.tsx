'use client';

import { useState } from 'react';
import SubscriptionHeader from './subscription-header';
import SubscriptionCard from './subscription-card';
import subscriptionsData from './data.json';

const Subscription = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
  const [subscriptions, setSubscriptions] = useState(subscriptionsData);

  const handleEdit = (id: string) => {
    console.log('Edit subscription with ID:', id);
    // Add your edit logic here
  };

  const handleDelete = (id: string) => {
    // setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  const handleMarkInactive = (id: string) => {
    // setSubscriptions(prev =>
    //   prev.map(sub =>
    //     sub.id === id ? { ...sub, active: false } : sub
    //   )
    // );
  };

  // Filter subscriptions based on active/inactive status
  const filteredSubscriptions = subscriptions.filter((sub) =>
    activeTab === 'active' ? sub.active : !sub.active
  );

  return (
    <main className=" w-full !p-4 md:!p-8">
      <h2 className="mb-6 text-2xl font-medium text-[#222222]">Subscriptions</h2>

      {/* Subscription Header with Tab Control */}
      <SubscriptionHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSubscriptions.length > 0 ? (
          filteredSubscriptions.map((subscription, index) => (
            <SubscriptionCard
              key={ index}
              {...subscription}
              onEdit={() => handleEdit}
              onDelete={() => handleDelete}
              onInactive={() => handleMarkInactive}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No {activeTab} subscriptions found.
          </p>
        )}
      </div>
    </main>
  );
};

export default Subscription;
