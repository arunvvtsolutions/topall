import React from 'react';
import { ChapterWiseBotTabs } from '../components/MainChapterWiseBot';

const page = ({ params }: { params: { shortUrl: any } }) => {
  const subjectName = params.shortUrl?.[0];
  return (
    <div>
      <ChapterWiseBotTabs subjectName={subjectName} />
    </div>
  );
};

export default page;
