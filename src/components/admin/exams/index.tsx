'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { GetExamPayload, Syllabus } from '@/types/exams';
import { PaginationWithLinks } from '@/components/common/pagination-with-links';
import { useRouter, useSearchParams } from 'next/navigation';
import { changePublishStatus, deleteExam, getSyllabusById, pinAndUnpinExams } from '@/utils/api/exams';
import { toast } from 'sonner';
import { LucideLoader } from '@/components/common/LucideLoader';
import { HttpStatus } from '@/types/constants';
import { useDispatch, useSelector } from '@/store';
import { filteredExams, getExams } from '@/store/slice/admin/exams';
import { DialogTitle, FormType, TosterMessages } from '@/types/enum';
import { useDebounce } from '@/hooks/use-debounce';
import Examsections from './examSections';

import { getSingleTest } from '@/utils/api/examination';
import PasswordConfirmationModal from '@/components/common/password-confirmation-modal';
import DeleteConfirmationDialog from '@/components/delete-confirmation-dialog';
import { passwordConfirm } from '@/utils/mock-password';
import CreateTestModal from './forms/examination-form';
import ExamHeader from './exam-header';
import ExamCard from './exam-card';
import FilterModal from './FilterModal';
import ShowSyllabus from './view-syllabus/view-syllabus-accordion';
import PublishConfirmationDialog from '@/components/common/publish-unpublish';
import { setSectionsSuccess } from '@/store/slice/exam/sections';

const ExamsList = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { examFilters, examsList, loading } = useSelector((state) => state.adminExams);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [page, setPage] = useState(Number(searchParams.get('page') || '1'));
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(search);
  const [isExamDialogOpen, setExamDialogOpen] = useState(false);
  const [testId, setTestId] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormType | null>(null);
  const [initialData, setInitialData] = useState<any | null>(null);
  const [examIdToDelete, setExamIdToDelete] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showSyllabus, setShowSyllabus] = useState<boolean>(false);
  const [syllabusData, setSyllabusData] = useState<Syllabus[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const PAGE_LIMIT = 9;
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [currentExamId, setCurrentExamId] = useState<string | null>(null);
  const [showPackage, setShowPackage] = useState<string | null>(null);

  const handlePublishAction = useCallback((id: string, currentPublishState: boolean, startDate: string | Date) => {
    // Convert startDate to a Date object
    const startDateTime = new Date(startDate);
    const currentDateTime = new Date();

    if (startDateTime < currentDateTime) {
      toast.error(TosterMessages.ADMIN_PUBLISH_ERROR);
    } else {
      // Handle the publish action
      setCurrentExamId(id);
      setIsPublishing(!currentPublishState);
      setIsPasswordDialogOpen(true);
    }
  }, []);

  const handlePasswordConfirm = useCallback((password: string) => {
    passwordConfirm(
      password,
      () => {
        // If password is correct, close the password dialog and open the publish dialog
        setIsPasswordDialogOpen(false);
        setIsPublishDialogOpen(true);
      },
      () => {
        toast.error(TosterMessages.ADMIN_PUBLISH_PASSWORD_ERROR);
        setIsPasswordDialogOpen(false);
      }
    );
  }, []);

  const handleChangePublish = useCallback(async () => {
    if (!currentExamId) return;

    try {
      const response = await changePublishStatus(currentExamId);
      if (response?.status === HttpStatus.OK) {
        dispatch(getExams({ limit: PAGE_LIMIT, page: 1, search: '' }));
        router.push('?page=1');
        toast.success(`Exam successfully ${isPublishing ? 'published' : 'unpublished'}`);
      } else {
        throw new Error(TosterMessages.ADMIN_PUBLISH_PASSWORD_STATUS);
      }
    } catch (error) {
      toast.error(TosterMessages.ADMIN_PUBLISH_PASSWORD_STATUS);
    } finally {
      setIsPublishDialogOpen(false);
    }
  }, [currentExamId, isPublishing, dispatch, router]);

  // Fetch Exams List
  const getExamsList = useCallback(async () => {
    const payload = { limit: PAGE_LIMIT, page, search: debouncedSearch };
    try {
      if (Object.values(examFilters).some((arr) => arr.length > 0)) {
        // if (page !== 1) {
        //   setPage(1);
        //   updateQueryParams({ page: '1' });
        // }
        await dispatch(filteredExams({ ...payload, page: page, ...examFilters }));
      } else {
        await dispatch(getExams(payload));
      }
    } catch (error) {
      toast.error('Failed to fetch exams. Please try again later.');
    }
  }, [dispatch, page, debouncedSearch, examFilters]);

  // Pin/Unpin exam
  const handlePin = useCallback(
    async (id: string, pin: string | null) => {
      const payload: GetExamPayload = { limit: PAGE_LIMIT, page: 1, search: '' };
      try {
        const pinExamsResp = await pinAndUnpinExams(id);
        if (pinExamsResp?.status === HttpStatus.OK) {
          dispatch(getExams(payload));
          router.push('?page=1');
          setPage(1);
          setSearch('');
          toast.success(pin === null ? 'Pinned Successfully' : 'Unpinned Successfully');
        } else {
          throw new Error('Failed to pin/unpin exam');
        }
      } catch (error) {
        toast.error('Failed to pin/unpin exam. Please try again.');
      }
    },
    [getExamsList]
  );

  // Create Exam Handler
  const createExamHandler = () => {
    setShowFormModal(true);
    setFormType(FormType.ADD);
    setInitialData(null);
  };

  // Update Exam Handler
  const updateExamHandler = async (examId: string) => {
    try {
      const singleTest = await getSingleTest(Number(examId));
      if (singleTest.published) {
        toast.error(TosterMessages.ADMIN_EXAM_PUBLISHED_ERROR);
        return;
      }
      setInitialData(singleTest);
      setShowFormModal(true);
      setFormType(FormType.EDIT);
    } catch (error) {
      toast.error(TosterMessages.ADMIN_EXAM_UPDATE_FAIL);
      setShowFormModal(false);
      setFormType(null);
    }
  };

  // Delete Exam Handler
  const deleteExamHandler = async (examId: string) => {
    try {
      const singleTest = await getSingleTest(Number(examId));
      if (singleTest.published) {
        toast.error(TosterMessages.ADMIN_EXAM_PUBLISHED_ERROR);
        return;
      }
      setExamIdToDelete(Number(examId));
      setShowPassword(true);
    } catch (error) {
      toast.error(TosterMessages.ADMIN_EXAM_DELETE_FAIL);
    }
  };

  // Password Confirm Handler for Deletion
  const passwordConfirmHandler = async (password: string) => {
    passwordConfirm(
      password,
      () => {
        setShowPassword(false);
        setShowDeleteModal(true);
      },
      () => {
        setShowPassword(false);
      }
    );
  };
  const reusedqutioncount = (id: string) => {
    setExamDialogOpen(true);
    setTestId(id);
  };
  // Delete Confirmation Handler
  const deleteConfirmaHandler = async () => {
    try {
      const response = await deleteExam(examIdToDelete);
      if (response.statusCode === HttpStatus.OK) {
        toast.success(TosterMessages.ADMIN_EXAM_DELETE_SUCCESS);
        setShowDeleteModal(false);
        setExamIdToDelete(null);
        getExamsList();
      }
    } catch (error) {
      toast.error(TosterMessages.ADMIN_EXAM_DELETE_FAIL);
      setExamIdToDelete(null);
      setShowDeleteModal(false);
    }
  };

  // View Syllabus Handler
  const viewSyllabusHandler = async (examId: string) => {
    setIsLoading(true);
    setShowSyllabus(true);
    try {
      const response = await getSyllabusById(Number(examId));
      setSyllabusData(response);
    } catch (error) {
      toast.error(TosterMessages.ADMIN_SYLLABUS_FETCH_FAIL);
    } finally {
      setIsLoading(false);
    }
  };

  // Close Syllabus Handler
  const closeSyllabusHandler = () => {
    setShowSyllabus(false);
    setSyllabusData([]);
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    const newValue = value.trimStart();
    setSearch(newValue);
    setPage(1);
    updateQueryParams({ search: newValue, page: '1' });
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateQueryParams({ page: newPage.toString() });
  };

  const handleSectionPage = (examId: string) => {
    dispatch(setSectionsSuccess([]));
    router.push(`/admin/exams/${examId}/sections`);
  };

  const handleShowPackage = useCallback(
    (id: string) => {
      setShowPackage(showPackage === id ? null : id);
    },
    [showPackage]
  );

  // Update query params
  const updateQueryParams = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });
    router.push(`?${newSearchParams.toString()}`);
  };

  useEffect(() => {
    getExamsList();
  }, [getExamsList]);

  return (
    <>
      <div className="flex h-screen flex-col space-y-6">
        <ExamHeader
          onShowFilter={() => setShowFilterModal(true)}
          onShowCreate={createExamHandler}
          totalExamCount={examsList?.totalExamCount}
          searchValue={search}
          onSearchChange={handleSearchChange}
        />
        <div className="mb-8 flex-grow">
          {loading ? (
            <div className="flex items-center justify-center">
              <LucideLoader className="h-8 w-8 text-primary" />
            </div>
          ) : examsList && examsList?.examList.length ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {examsList?.examList.map((exam) => (
                  <ExamCard
                    key={exam.id}
                    {...exam}
                    onChangePin={handlePin}
                    onChangePublish={(id: string, published: boolean, startDate: string | Date) =>
                      handlePublishAction(id, published, startDate)
                    }
                    reusedquestionid={reusedqutioncount}
                    updateExamHandler={updateExamHandler}
                    deleteExamHandler={deleteExamHandler}
                    handleSectionPage={handleSectionPage}
                    viewSyllabus={viewSyllabusHandler}
                    showPackage={showPackage === exam.id}
                    onShowPackage={handleShowPackage}
                  />
                ))}
              </div>
            </>
          ) : !loading && examsList?.examList ? (
            <div className="flex h-full items-center justify-center text-center">No Exams Available</div>
          ) : null}
        </div>

        {examsList && examsList?.totalExamCount > 0 && (
          <div className="mt-auto">
            <PaginationWithLinks
              page={page}
              pageSize={PAGE_LIMIT}
              totalCount={examsList?.totalExamCount}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <FilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          updateQueryParams={() => {
            setPage(1);
            updateQueryParams({ page: '1' });
          }}
        />
      )}

      {isExamDialogOpen && <Examsections isOpen={isExamDialogOpen} onClose={() => setExamDialogOpen(false)} examid={testId} />}

      {showFormModal && (
        <CreateTestModal
          isOpen={showFormModal}
          type={formType}
          onClose={() => setShowFormModal(false)}
          initialData={initialData}
          getExamsList={getExamsList}
        />
      )}

      {showPassword && (
        <PasswordConfirmationModal
          open={showPassword}
          onClose={() => setShowPassword(false)}
          onConfirm={passwordConfirmHandler}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationDialog
          open={showDeleteModal}
          message="Are you sure you want to delete this Test?"
          onClose={() => setShowDeleteModal(false)}
          onConfirm={deleteConfirmaHandler}
        />
      )}

      {isPasswordDialogOpen && (
        <PasswordConfirmationModal
          open={isPasswordDialogOpen}
          onClose={() => setIsPasswordDialogOpen(false)}
          onConfirm={handlePasswordConfirm}
        />
      )}

      {isPublishDialogOpen && (
        <PublishConfirmationDialog
          open={isPublishDialogOpen}
          isPublishing={isPublishing}
          onClose={() => setIsPublishDialogOpen(false)}
          onPublish={handleChangePublish}
          onUnpublish={handleChangePublish}
        />
      )}

      {showSyllabus && (
        <ShowSyllabus
          isLoading={isLoading}
          syllabusData={syllabusData}
          open={showSyllabus}
          title={DialogTitle.SYLLABUS}
          onOpenChange={closeSyllabusHandler}
        />
      )}
    </>
  );
};

export default ExamsList;
