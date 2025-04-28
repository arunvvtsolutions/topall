import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ProgressBar from '@/components/common/ProgressBar';
import MultipleAvatars from './multiple-avatars';
import SectionFormModal from './section-form';
import DeleteConfirmationModal from '@/components/delete-confirmation-dialog';
import { useDispatch, useSelector } from '@/store';
import { getSectionsByExamId } from '@/store/slice/exam/sections';
import { AdminOnlyGroups, DialogTitle, FormFields, FormType, Roles, TosterMessages } from '@/types/enum';
import { useParams, useRouter } from 'next/navigation';
import { deleteSection, getSectionEditById } from '@/utils/api/section';
import { HttpStatus } from '@/types/constants';
import FileIcon from './file-icon';
import AutoIcon from './auto-icon';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

const DraggableCard = ({
  row,
  index,
  testDetails,
  overallTotal,
  marks,
  published
}: {
  row: any;
  index: number;
  testDetails?: any;
  overallTotal?: number;
  marks?: number;
  published?: boolean;
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { examId } = useParams();
  const user = useSelector((state) => state.userProfile);

  const [editSubject, setEditSubject] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<null>(null);
  const handleImportQuestions = () => {
    router.push(`/admin/exams/${examId}/sections/${row.id}/import-questions`);
  };
  const handleEditSection = async (id: string) => {
    try {
      const sectionData = await getSectionEditById(String(examId), id);
      if (sectionData) {
        setInitialData(sectionData);
        setEditSubject(true);
      } else {
        toast.error(TosterMessages.SOMETHING_WENT_WRONG);
      }
    } catch (error) {
      toast.error(TosterMessages.SOMETHING_WENT_WRONG);
    }
  };

  const handleDeleteSection = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteSection = async (sectionId: string) => {
    try {
      const response = await deleteSection(String(examId), sectionId);
      if (response?.statusCode === HttpStatus.OK) {
        toast.success(TosterMessages.ADMIN_SECTION_DELETE_SUCCESS);
        setShowDeleteModal(false);
        dispatch(getSectionsByExamId(String(examId)));
      } else {
        toast.error(response?.message || 'Failed to process the request.');
      }
    } catch (error) {
      toast.error(TosterMessages.SOMETHING_WENT_WRONG);
    }
  };

  const handleAddSection = (sectionId: string) => {
    const route = `/admin/exams/${examId}/sections/${sectionId}/add-questions`;
    router.push(route);
  };

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 'auto'
  };

  const handleViewSection = () => {
    router.push(`/admin/exams/${examId}/sections/${row.id}/view-questions`);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="flex w-full justify-between rounded-lg border bg-white pb-3 pl-1 pr-3 pt-3 shadow-sm transition-transform sm:max-w-none"
      >
        {AdminOnlyGroups.includes(user.role.role as Roles) && (
          <div {...attributes} {...listeners} className="flex w-[30px] cursor-grab">
            <Button size="icon" variant="outline" className="h-[25px] w-[25px] items-start border-none bg-transparent">
              <Icon icon="material-symbols:drag-indicator" className="cursor-grab text-2xl text-primary transition-all" />
            </Button>
          </div>
        )}

        <div className={cn('w-full', !AdminOnlyGroups.includes(user.role.role as Roles) ? 'ml-[12px]' : '')}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold capitalize text-[rgba(34,34,34,1)]">{`${row.subjectName} ${row.name}`}</h3>
            <MultipleAvatars staffList={[row.staffs]} />
          </div>
          <h3 className="mb-4 text-[12px] font-medium text-[rgba(34,34,34,1)]">
            {FormFields.SECTION_MARK} :{Math.min(row.questionList.length * row.cMark, row.maxAttempts * row.cMark)} /{' '}
            {row.totalMark}
          </h3>
          <h3 className="mb-4 text-[12px] font-medium text-[rgba(34,34,34,1)]">
            {row.questionType === 1 ? FormFields.INT_QUESTIONS : FormFields.MCQ_QUESTIONS}( {FormFields.MAX_ATTEM}: {row.maxAttempts} )
          </h3>
          <div className="mb-3 flex justify-between">
            <ProgressBar current={row.questionList.length} total={row.totalQuestions} />
          </div>
          <div className="flex justify-between">
            {AdminOnlyGroups.includes(user.role.role as Roles) && (
              <div className="flex gap-2">
                <Button
                  size="icon"
                  disabled={published}
                  onClick={() => handleEditSection(row.id)}
                  className={`group relative h-7 w-7 rounded-full bg-[rgba(255,161,38,1)] transition-all duration-200 ease-in-out hover:bg-white`}
                >
                  <Icon
                    icon="cuida:edit-outline"
                    fontSize={15}
                    className={`text-white transition-colors duration-200 ease-in-out group-hover:text-[rgba(255,161,38,1)]`}
                  />
                </Button>
                <Button
                  size="icon"
                  onClick={handleDeleteSection}
                  disabled={published}
                  className={`group relative h-7 w-7 rounded-full bg-[rgba(255,71,71,1)] transition-all duration-200 ease-in-out`}
                >
                  <Icon
                    icon="hugeicons:delete-03"
                    fontSize={15}
                    className={`text-white transition-colors duration-200 ease-in-out group-hover:text-[rgba(255,71,71,1)] ${
                      published ? 'pointer-events-none' : ''
                    }`}
                  />
                </Button>
              </div>
            )}

            <div className={cn('flex gap-2', !AdminOnlyGroups.includes(user.role.role as Roles) ? 'w-full justify-end' : '')}>
              <Button
                size="icon"
                className="mr relative h-7 w-7 rounded-full ring-1 ring-inset ring-default-300 hover:ring-default-300"
                onClick={() => handleAddSection(row.id)}
                disabled={row.questionList.length === row.totalQuestions}
              >
                <Icon icon="mingcute:add-line" fontSize={15} className="text-[rgba(0,168,107,1)]" />
              </Button>
              {AdminOnlyGroups.includes(user.role.role as Roles) && (
                <>
                  <div>
                    <Button
                      size="icon"
                      className="relative h-7 w-7 rounded-full ring-1 ring-inset ring-default-300 hover:ring-default-300"
                      onClick={handleImportQuestions}
                      disabled={row.questionList.length === row.totalQuestions}
                    >
                      <FileIcon />
                    </Button>
                  </div>
                  {/* <Button
                    size="icon"
                    disabled={published}
                    className="relative h-7 w-7 rounded-full ring-1 ring-inset ring-default-300 hover:ring-default-300"
                  >
                    <AutoIcon />
                  </Button> */}
                </>
              )}
              <Button
                size="icon"
                className="relative h-7 w-7 rounded-full ring-1 ring-inset ring-default-300 hover:ring-default-300"
                onClick={handleViewSection}
                // disabled={row.staffs.id !== user.userId}
              >
                <Icon icon="solar:eye-linear" fontSize={15} className="text-primary" />
              </Button>
            </div>
          </div>
        </div>
        {/* {showImportModal && (
          <ImportQuestions examId={Number(examId)} sectionId={Number(row.id)} onClose={() => setShowImportModal(false)} />
        )} */}
        {editSubject && initialData && (
          <SectionFormModal
            open={editSubject}
            title={DialogTitle.EDIT_SECTION}
            type={FormType.EDIT}
            onClose={() => {
              setEditSubject(false);
              setInitialData(null);
            }}
            initialData={initialData}
            testDetails={testDetails}
            overallTotal={overallTotal}
            marks={marks && marks}
            row={row}
          />
        )}
        {showDeleteModal && (
          <DeleteConfirmationModal
            open={showDeleteModal}
            message={'Are you sure you want to delete this section?'}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => confirmDeleteSection(row.id)}
          />
        )}
      </div>
    </>
  );
};

export default DraggableCard;
