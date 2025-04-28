import QuestionsAndAnswerKey from '@/components/user/answer-key';
import React from 'react';

const AnswerKeyPage = () => {
  return (
    <div className="h-full min-h-screen bg-screenbackground">
      <div className="mx-auto px-4 md:container">
        <QuestionsAndAnswerKey />
      </div>
    </div>
  );
};

export default AnswerKeyPage;
