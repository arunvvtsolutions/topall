import React from 'react';
import BannerSlide from './banner';
import LeaderBoard from './leader-board';
import UpcomingExams from './upcoming-test';
import ExamLinkPages from './exam-pages';
import Bookmarks from './bookmark';
import Header from './Header';

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 space-y-4 px-2 lg:space-y-6 lg:px-4">
      <Header />
      <BannerSlide />
      <LeaderBoard />
      <UpcomingExams />
      <ExamLinkPages />
      <Bookmarks />
    </div>
  );
};

export default Dashboard;
