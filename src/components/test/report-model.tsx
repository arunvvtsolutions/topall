'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { CardContent } from '@/components/ui/card';
import { MainDialog } from '@/components/common/MainDialog';
import { LucideLoader } from '@/components/common/LucideLoader';
import { toast } from 'sonner';
import { getReportTypes } from '@/store/slice/admin/exams';
import { useDispatch, useSelector } from '@/store';
import { updateReportIssue } from '@/utils/api/exams';
import { HttpStatus } from '@/types/constants';
import { TosterMessages } from '@/types/enum';

interface Props {
  userId: number | null;
  questionId: number | null;
  isOpen: boolean;
  roleId: number;
  onClose: () => void;
}

export default function ReportModal({ userId, questionId, isOpen, onClose, roleId }: Props) {
  const reportTypes = useSelector((state) => state.adminExams.reportTypes);

  const dispatch = useDispatch();
  const [reportTypeIds, setReportIds] = useState<number[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Handle checkbox selection
  const handleCheckboxChange = (reportId: number) => {
    setReportIds((prev) => (prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]));
  };

  // Answerkey Reporting Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      userId: String(userId),
      roleId,
      questionId,
      reportTypeIds,
      additionalInfo
    };

    try {
      console.log('payload', payload);
      const response = await updateReportIssue(payload);
      console.log('response', response);
      if (response.status === HttpStatus.CREATED) {
        toast.success(TosterMessages.REPORT_SUCCESS);
        onClose();
      } else {
        toast.error(TosterMessages.REPORT_FAIL);
        onClose();
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(TosterMessages.REPORT_FAIL);
      onClose();
    }
  };

  // Button is disabled if no report type is selected and no additional feedback is provided
  const isSubmitDisabled = reportTypeIds.length === 0 && additionalInfo.trim() === '';

  useEffect(() => {
    dispatch(getReportTypes());
  }, []);

  return (
    <MainDialog
      isOpen={isOpen}
      title={<span className="text-lg font-medium text-primary sm:text-lg md:text-lg">What seems to be the problem?</span>}
      secondaryTitle={<span className="text-[#222222]">You can add multiple issues by selecting them</span>}
      onOpenChange={onClose}
      size="default"
    >
      <CardContent className="p-0">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4">
            {/* Checkboxes for issues */}
            <div className="flex flex-col space-y-3">
              {reportTypes.length > 0 ? (
                reportTypes.map((issue) => (
                  <div key={issue.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={issue.id.toString()}
                      className="border border-B2CAgray bg-white hover:border-primary"
                      color="primary"
                      checked={reportTypeIds.includes(issue.id)}
                      onCheckedChange={() => handleCheckboxChange(issue.id)}
                    />
                    <label
                      htmlFor={issue.id.toString()}
                      className="text-xs font-normal leading-none text-B2CAgray peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sm:text-sm md:text-base"
                    >
                      {issue.report_type}
                    </label>
                  </div>
                ))
              ) : (
                <div>No issues found</div>
              )}
            </div>

            {/* Additional feedback */}
            <div className="space-y-2">
              <label className="text-sm font-normal text-B2CAgray">Additional feedback</label>
              <Textarea
                color="secondary"
                data-test-id="report-description"
                placeholder="Type your feedback here..."
                className="mx-0 min-h-[200px] w-full max-w-full sm:max-w-[502px]"
                onChange={(e) => setAdditionalInfo(e.target.value)}
                value={additionalInfo} // Controlled component
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                variant="default"
                color="primary"
                className="h-[54px] w-full max-w-[332px] text-[16px] font-semibold text-borderButton"
                data-test-id="submit-button"
                disabled={isSubmitDisabled || loading}
              >
                {loading && <LucideLoader className="mr-2" />}
                Submit
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </MainDialog>
  );
}
