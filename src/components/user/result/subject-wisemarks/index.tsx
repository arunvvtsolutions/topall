import React from 'react';
import SubjectResults from './subject-wise-marks';

export default function SubjectWiseMarks() {
  return (
    <div>
      <h1 className="pb-6 text-xl font-medium">Subject Wise Marks</h1>
      <SubjectResults isLoading={false} sectionData={[]} subjectData={[]} />
    </div>
  );
}
