import { FormFields, TosterMessages } from '@/types/enum';
import { getStreamById } from '@/utils/api/academic';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ExamCard from './exam-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideLoader } from '@/components/common/LucideLoader';
import FallbackLoader from '@/components/ui/fallback-loader';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from '@/store';
import { getStandards, getStreams } from '@/store/slice/admin/academic';
import { Check, Plus } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ProfileFormValues } from '@/schemas/user/profile-schema';
import TargetYearAndScores from './target-year-score';
import { updateProfileData } from './my-profile-details';
import { getUserProfile } from '@/store/slice/user/userProfileSlice';
import { GenericType } from '@/types';

interface Subject {
  id: number;
  name: string;
  star: number;
  is_active?: boolean;
}

interface BestExam {
  streamId: number;
  streamName: string;
  targetYear: string;
  targetScore: string;
  subjects?: Subject[];
}

const ExamDetails = () => {
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.userProfile);
  const allStreams = useSelector((state) => state.selectors.streams);
  const academicStreams = useSelector((state) => state.academic.streams);
  const allStandards = useSelector((state) => state.academic.standards);

  const [examData, setExamData] = useState<BestExam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStream, setSelectedStream] = useState<GenericType | null>(null);
  const [selectedStandardId, setSelectedStandardId] = useState<number | null>(null);
  const [selectedTargets, setSelectedTargets] = useState<{ targetScore: string; targetYear: string | null }>({
    targetScore: '',
    targetYear: null
  });
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [hasStandardError, setHasStandardError] = useState('');

  // Filter standards based on selected stream
  const filteredStandards = useMemo(() => {
    if (!selectedStream) return [];
    return allStandards.filter((s) => s.streams.id === selectedStream.id);
  }, [selectedStream, allStandards]);

  // Check if a stream is already in exam data
  const isStreamInExamData = useCallback(
    (streamId: number) => {
      return examData.some((exam) => exam.streamId === streamId);
    },
    [examData]
  );

  useEffect(() => {
    // Fetch streams and standards on component mount
    dispatch(getStreams());
    dispatch(getStandards());
  }, [dispatch]);

  useEffect(() => {
    // Process profile target data
    if (!profileData?.target?.length) return;

    const loadExamData = async () => {
      setIsLoading(true);
      try {
        const formattedExamData = await processExamData(profileData);
        setExamData(formattedExamData);
      } catch (error) {
        console.error('Error processing exam data:', error);
        toast.error(TosterMessages.SOMETHING_WENT_WRONG);
      } finally {
        setIsLoading(false);
      }
    };

    loadExamData();
  }, [profileData]);

  // Process exam data from profile
  const processExamData = async (profileData: any): Promise<BestExam[]> => {
    // Format initial exam data from targets
    const formattedExamData: BestExam[] = profileData.target.map((exam: any) => ({
      streamId: exam.id,
      streamName: exam.name,
      targetYear: exam.targetYear || '2025',
      targetScore: exam.targetScore || '700',
      subjects: []
    }));

    // Skip subject fetching if no current exams
    if (!profileData.target?.length) {
      return formattedExamData;
    }

    // Fetch subjects for each exam
    const subjectDataByStreamId = await fetchSubjectsForExams(profileData);

    // Merge subjects with the target data
    return formattedExamData.map((exam) => ({
      ...exam,
      subjects: subjectDataByStreamId[exam.streamId] || []
    }));
  };

  // Fetch subjects for exams
  const fetchSubjectsForExams = async (profileData: any): Promise<Record<string, Subject[]>> => {
    const subjectPromises = profileData.target.map(async (exam: any) => {
      try {
        const response = await getStreamById(exam.id);
        console.log('response subjects', response);
        const subjects =
          response?.stream_subjects
            ?.filter((sub: any) => sub.is_active)
            .map((sub: any) => ({
              id: sub.subject_id,
              name: sub.subjectName,
              star:
                profileData.best
                  ?.find((item: any) => item.streamId === exam.id)
                  ?.subjects?.find((subItem: any) => subItem.id === sub.subject_id)?.star || 0
            })) || [];

        return { streamId: exam.id, subjects };
      } catch (error) {
        console.error(`Error fetching subjects for exam ${exam.id}:`, error);
        return { streamId: exam.id, subjects: [] };
      }
    });

    const results = await Promise.all(subjectPromises);

    // Convert array to object for easier lookup
    return results.reduce(
      (acc, { streamId, subjects }) => {
        acc[streamId] = subjects;
        return acc;
      },
      {} as Record<string, Subject[]>
    );
  };

  // Handle exam data changes
  const handleExamChange = (streamId: number, updatedExam: BestExam) => {
    const updatedData = examData.map((exam) => (exam.streamId === streamId ? updatedExam : exam));
    setExamData(updatedData);
  };

  // Handle stream selection
  const handleSelectStream = (stream: GenericType) => {
    if (isStreamInExamData(stream.id)) {
      return;
    }
    setSelectedStream((prev) => (prev?.id === stream.id ? null : stream));
    setSelectedStandardId(null);
    setHasStandardError('');
  };

  // Handle standard selection
  const handleSelectStandard = (standardId: number) => {
    setSelectedStandardId((prev) => (prev === standardId ? null : standardId));
    setHasStandardError('');
  };

  // Prepare profile update payload
  const prepareProfilePayload = () => {
    const updatedTargets = selectedStream
      ? [
          ...profileData?.target,
          {
            id: selectedStream?.id ?? 0,
            name: selectedStream?.name ?? '',
            targetYear: selectedTargets?.targetYear ?? '',
            targetScore: selectedTargets?.targetScore ?? ''
          }
        ]
      : examData.map((exam) => ({
          id: exam.streamId,
          name: exam.streamName,
          targetYear: exam.targetYear,
          targetScore: exam.targetScore
        }));

    const transformedCurrentExams =
      profileData?.standard?.map((item: any) => ({
        streamId: item.streamId,
        standardId: item.standard.id
      })) || [];

    const updatedCurrentExams = selectedStream
      ? [...transformedCurrentExams, { streamId: selectedStream?.id || null, standardId: selectedStandardId }]
      : transformedCurrentExams;

    return {
      name: profileData?.name || '',
      referalCode: '',
      referLevel: profileData?.referLevel || '',
      profileImage: profileData?.profileImage || '',
      gender: profileData?.gender || '',
      dob: profileData?.dob?.toString() || '',
      address: profileData?.address || '',
      city: Number(profileData?.city) || 0,
      zipcode: profileData?.zipCode || '',
      studentId: profileData.userId,
      stateId: profileData?.state,
      currentExam: updatedCurrentExams || [],
      target: updatedTargets,
      best: examData,
      email: profileData?.email
    };
  };

  // Handle exam update
  const handleUpdateExam = async () => {
    if (selectedStream && !selectedStandardId) {
      setHasStandardError('Please select a standard');
      return;
    }

    setIsUpdateLoading(true);
    const profilePayload = prepareProfilePayload();
    try {
      if (await updateProfileData(profilePayload)) {
        if (profileData?.mobileNumber) {
          await getUserProfile(profileData.mobileNumber);
        }
        setSelectedStream(null);
        setSelectedStandardId(null);
        setSelectedTargets({ targetScore: '', targetYear: null });
        toast.success(selectedStream ? 'Exam added successfully' : 'Exam updated successfully');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(TosterMessages.PROFILE_UPDATE_FAILED);
    } finally {
      setIsUpdateLoading(false);
    }
  };

  return (
    <div className="space-y-4 pl-4 pr-3 md:pl-10 md:pr-7">
      <h2 className="border-b pb-3 text-base font-medium text-B2CAgrayn md:pb-8 md:text-[1.5rem]">{FormFields.EXAM}</h2>

      {isLoading ? (
        <FallbackLoader />
      ) : (
        <div className="space-y-6">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 md:gap-4">
              {allStreams.map((item) => {
                const isSelected = selectedStream?.id === item.id;
                const isInExamData = isStreamInExamData(item.id);
                return (
                  <Button
                    key={item.id}
                    type="button"
                    size="md"
                    rounded="full"
                    variant="default"
                    disabled={selectedStream !== null && isInExamData}
                    className={cn(
                      'gap-2 px-4 lg:!px-6',
                      isSelected || isInExamData
                        ? 'bg-primary text-default hover:bg-primary/90 hover:ring-primary'
                        : 'bg-secondaryBtn text-B2Cgray hover:bg-secondaryBtn/90 hover:ring-B2Cgray'
                    )}
                    onClick={() => handleSelectStream(item)}
                  >
                    {isInExamData ? (
                      <Check size={16} className={`ml-1 ${isInExamData ? 'text-default' : 'text-B2Cgray'}`} />
                    ) : (
                      <Plus size={16} className={`ml-1 ${isSelected ? 'text-default' : 'text-B2Cgray'}`} />
                    )}

                    {item.name}
                  </Button>
                );
              })}
            </div>

            {selectedStream && (
              <div className="space-y-4">
                <h3 className="text-base font-normal text-B2Cgray">Which class are you studying in?</h3>
                {filteredStandards.length > 0 ? (
                  <div className="flex flex-wrap gap-2 md:gap-4">
                    {filteredStandards.map((item) => (
                      <Button
                        key={item.id}
                        type="button"
                        size="md"
                        rounded="full"
                        variant="default"
                        className={cn(
                          'px-4 lg:!px-6',
                          selectedStandardId === item.id
                            ? 'bg-primary text-default hover:bg-primary/90 hover:ring-primary'
                            : 'bg-secondaryBtn text-B2Cgray hover:bg-secondaryBtn/90 hover:ring-B2Cgray'
                        )}
                        onClick={() => handleSelectStandard(item.id)}
                      >
                        {item.name}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-B2CAgrayn">No standards found</p>
                )}
                {hasStandardError && <p className="text-sm text-destructive">please select standard</p>}
              </div>
            )}
            {!selectedStream?.id && (
              <div className="mt-4 grid grid-cols-1 gap-4 md:mt-8 xl:grid-cols-2">
                {examData
                  .filter((exam) => !selectedStream || exam.streamId === selectedStream.id)
                  .map((exam) => (
                    <ExamCard
                      key={exam.streamId}
                      title={exam.streamName}
                      inputs={[
                        {
                          label: 'Target Year',
                          placeholder: 'Target Year',
                          icon: <img src="/images/calendar.svg" alt="Calendar Icon" />
                        },
                        {
                          label: 'Target Score',
                          placeholder: 'Target Score',
                          icon: <span>{academicStreams.find((stream) => stream.id === exam.streamId)?.total_score || 0}</span>
                        }
                      ]}
                      subjects={exam?.subjects || []}
                      onExamUpdate={(updatedExam) => handleExamChange(exam.streamId, { ...updatedExam, streamId: exam.streamId })}
                      targetYear={exam.targetYear}
                      targetScore={exam.targetScore}
                    />
                  ))}
              </div>
            )}

            {selectedStandardId && <TargetYearAndScores targets={selectedTargets} setTargets={setSelectedTargets} />}
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              variant="default"
              color="primary"
              className="gap-1 !px-20 text-sm"
              data-testid="update-exam"
              disabled={isUpdateLoading}
              onClick={handleUpdateExam}
            >
              {isUpdateLoading && <LucideLoader />}
              {selectedStream ? 'Add Exam' : 'Update Exam'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamDetails;
