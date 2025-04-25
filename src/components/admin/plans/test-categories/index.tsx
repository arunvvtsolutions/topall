'use client';
import TestCategoryCard from './test-category-card';
import { useEffect, useState } from 'react';
import { AIM_PYT_GT_Form } from '../forms/AIM-PYT-GT-form';
import ChapterWiseForm from '../forms/chapter-wise-form';
import ConceptWiseForm from '../forms/concept-wise-form';
import { useDispatch, useSelector } from '@/store';
import { getTestTypeByStreamId } from '@/store/slice/user/testType';
import { useSearchParams } from 'next/navigation';
import { getChapterData } from '@/store/slice/admin/packages';
import { getTestPlans } from '@/utils/api/packages';
import { toast } from 'sonner';
import { TosterMessages } from '@/types/enum';

const iconMap: Record<string, string> = {
  aimt: '/images/icon/sidebar-icons/outline/award.svg',
  pyt: '/images/icon/sidebar-icons/outline/calendar.svg',
  gt: '/images/icon/sidebar-icons/outline/add-square.svg',
  cwt: '/images/icon/sidebar-icons/outline/lamp-charge.svg',
  conwt: '/images/icon/sidebar-icons/outline/book.svg'
};

export default function TestCategories() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { testTypes } = useSelector((state) => state.testTypes);
  const streamId = searchParams.get('streamId');
  const planId = searchParams.get('planId');
  const [testTypeData, setTestTypeData] = useState<any>([]);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [formType, setFormType] = useState<string | null>(null);
  const [selectedTestType, setSelectedTestType] = useState<number>(0);
  const [createdData, setCreatedData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<boolean>(false);
  const [selectedPlanData, setSelectedPlanData] = useState<any>(null);

  const usageRestrictionHandler = (type: string, typeId: number) => {
    setSelectedTestType(typeId);
    setOpenModal(true);
    setFormType(type);
    setViewMode(false);
    setSelectedPlanData(null);
  };

  // Handler for viewing existing plans
  const viewPlanHandler = (type: string, typeId: number) => {
    setSelectedTestType(typeId);
    setOpenModal(true);
    setFormType(type);
    setViewMode(true);

    // Find the plan data for this test type
    const planData = createdData.find((data: any) => data.testTypeId === typeId);
    setSelectedPlanData(planData);
  };

  useEffect(() => {
    if (testTypes) {
      const filtered = testTypes.map((item: any) => {
        const shortName = item.test_type_list.short_name;
        return {
          id: item.id,
          name: item.test_type_list.name,
          short_name: shortName,
          iconPath: iconMap[shortName] || '/icons/default.png'
        };
      });
      setTestTypeData(filtered);
    }
  }, [testTypes]);

  // Plan Fetching Handler
  const fetchPlans = async () => {
    try {
      const createdPlans = await getTestPlans(Number(planId));
      setCreatedData(createdPlans);
    } catch (error) {
      console.log('errror', error);
      toast.error(TosterMessages.ADMIN_COMMON_ERROR);
    }
  };

  useEffect(() => {
    if (streamId) {
      dispatch(getTestTypeByStreamId(Number(streamId)));
      dispatch(getChapterData(Number(streamId)));
      fetchPlans();
    }
  }, [streamId]);

  return (
    <div className="mx-auto">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {testTypeData.map((category: any, index: number) => {
          const matchedData = createdData && createdData.find((data: any) => data.testTypeId === category.id);
          return (
            <TestCategoryCard
              key={index}
              category={category}
              created={!!matchedData}
              onCreate={usageRestrictionHandler}
              onView={viewPlanHandler}
              limit={matchedData?.limit}
            />
          );
        })}
      </div>

      {openModal && formType !== null && ['Generate Test', 'All India Mock Test', 'Previous Year Test'].includes(formType) && (
        <AIM_PYT_GT_Form
          name={formType}
          onClose={() => {
            fetchPlans();
            setOpenModal(false);
          }}
          testTypeId={selectedTestType}
          planId={Number(planId)}
          viewMode={viewMode}
          existingPlan={selectedPlanData}
        />
      )}

      {openModal && formType === 'Chapter Wise Test' && (
        <ChapterWiseForm
          name="Chapter Wise Test"
          onClose={() => {
            fetchPlans();
            setOpenModal(false);
          }}
          testTypeId={selectedTestType}
          planId={Number(planId)}
          streamId={Number(streamId)}
          viewMode={viewMode}
          existingPlan={selectedPlanData}
        />
      )}

      {openModal && formType === 'Concept Wise Test' && (
        <ConceptWiseForm
          name="Concept Wise Tests"
          onClose={() => {
            fetchPlans();
            setOpenModal(false);
          }}
          testTypeId={selectedTestType}
          planId={Number(planId)}
          streamId={Number(streamId)}
          viewMode={viewMode}
          existingPlan={selectedPlanData}
        />
      )}
    </div>
  );
}
