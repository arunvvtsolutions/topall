'use client';

import ExamtableComponent from '@/components/admin/exams/examSections/exam-table';
import { MainDialog } from '@/components/common/MainDialog';
import { getsectionById } from '@/utils/api/exams';
import React, { useEffect, useState } from 'react';

interface ExamsectionsProps {
  isOpen: boolean;
  onClose?: () => void;
  examid: string | null;
}

const Examsections: React.FC<ExamsectionsProps> = ({ isOpen, onClose, examid }) => {
  const [examData, setExamData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const columns = [
    { header: 'S.No', accessor: 'sNo' },
    { header: 'Subject', accessor: 'subject' },
    { header: 'Section Name', accessor: 'section' },
    { header: 'Total Question', accessor: 'totalQuestion' },
    { header: 'Reused Count', accessor: 'reusedCount' }
  ];

  useEffect(() => {
    const fetchExamData = async () => {
      if (examid) {
        setLoading(true);
        setError(null);
        try {
          const data = await getsectionById(examid);
          setExamData(data);
        } catch (err) {
          setError('Failed to fetch exam sections.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchExamData();
  }, [examid]);

  const handleDialogClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <MainDialog
      title={
        <div className="flex items-center justify-start">
          <span className="ml-3 p-2">Exam Sections</span>
        </div>
      }
      className="px-0 pb-0"
      isOpen={isOpen} // Use the isOpen prop here
      onOpenChange={handleDialogClose}
      size="md"
    >
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <ExamtableComponent data={examData} columns={columns} />
    </MainDialog>
  );
};

export default Examsections;
