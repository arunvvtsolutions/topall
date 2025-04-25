'use client';
import MainCard from '@/components/common/MainCard';
import PasswordConfirmationModal from '@/components/common/password-confirmation-modal';
import DeleteConfirmationModal from '@/components/delete-confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useDispatch, useSelector } from '@/store';
import { getYearList } from '@/store/slice/admin/academic';
import { AcademicYearList, GenericType } from '@/types';
import { ButtonNames, DialogTitle, FormType, TosterMessages } from '@/types/enum';
import { deleteYearListById, getYearListById } from '@/utils/api/academic';
import { profile } from '@/utils/mock-password';
import md5 from 'md5';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AcademicYearFormModal from '../forms/academic-year-form';
import TableComponent from './AcademicYearTable';

const stream: GenericType[] = [
  { id: 1, name: 'NEET' },
  { id: 2, name: 'JEE' }
];

const standards: GenericType[] = [
  { id: 1, name: '11th' },
  { id: 2, name: '12th' }
];

// Columns for the table
const columns = [
  { header: 'S.No', accessor: 's.no' },
  { header: 'Stream', accessor: 'streams' },
  { header: 'Standards', accessor: 'standards' },
  { header: 'Start Date', accessor: 'startDate' },
  { header: 'End Date', accessor: 'endDate' },
  { header: 'Action', accessor: 'action' }
];

export default function AcademicYear() {
  const dispatch = useDispatch();
  const { yearList } = useSelector((state) => state.academic);
  const { streams } = useSelector((state) => state.academic);
  const { standards } = useSelector((state) => state.academic);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [editAcademicYear, setEditAcademicYear] = useState<boolean>(false);
  const [addYear, setAddYear] = useState<boolean>(false);
  const [viewAcademicYear, setViewAcademicYear] = useState<boolean>(false);
  const [selectedYearData, setSelectedYearData] = useState<AcademicYearList | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getYearList());
  }, [dispatch]);

  // Handle Delete
  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowPassword(true);
  };

  // Handle Show Year
  const handleShowYear = (academicYear: AcademicYearList) => {
    setSelectedYearData(academicYear);
    setViewAcademicYear(true);
  };

  const handleEdit = async (editData: AcademicYearList) => {
    try {
      const academicYearData = await getYearListById(editData?.id);
      dispatch(getYearList());
      if (academicYearData) {
        setSelectedYearData(academicYearData);
        // setFormType(type);
        setEditAcademicYear(true);
      } else {
        toast.error(TosterMessages.SOMETHING_WENT_WRONG);
      }
    } catch (error) {
      toast.error(TosterMessages.SOMETHING_WENT_WRONG);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteYearConfirm = async () => {
    if (deleteId === null) {
      toast.error('Invalid Year ID');
      return;
    }

    try {
      const response = await deleteYearListById(deleteId);
      if (response?.statusCode === 200) {
        dispatch(getYearList());
        setShowDeleteModal(false);
         toast.success('Academic Year Successfully Deleted');
      } else {
        toast.error(TosterMessages.ADMIN_CHAPTER_UPDATE_FAIL);
      }
    } catch (error) {
      toast.error(TosterMessages.ADMIN_SUB_DELETE_FAIL);
    }
  };

  // Handle Password Confirmation
  const passwordConfirmHandler = async (pass: string) => {
    try {
      if (profile.user.publish_password === md5(pass)) {
        setShowPassword(false);
        setShowDeleteModal(true);
      } else {
        toast.error(TosterMessages.ADMIN_PASSWORD_ERROR);
        setShowPassword(false);
      }
    } catch (error) {
      toast.error(TosterMessages.ADMIN_SUB_DELETE_FAIL);
      setShowPassword(false);
    }
  };

  return (
    <>
      <MainCard
        title={DialogTitle.ACADEMIC_YEAR}
        actions={
          <Button
            onClick={() => setAddYear(true)}
            size="md"
            variant="default"
            color="primary"
            data-testid="add-year-btn"
            className="!rounded-[8px]"
          >
            <Icon icon="si:add-fill" className="text-base text-white" />
            {ButtonNames.ADD_ACADEMIC_YEAR}
          </Button>
        }
        dataTestId="year-card"
      >
        <TableComponent
          data={yearList}
          columns={columns}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onShow={handleShowYear}
          onRowReorder={() => console.log('rendered row')}
          draggable={false}
        />
      </MainCard>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          open={showDeleteModal}
          message={'Are you sure you want to delete this year?'}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteYearConfirm}
        />
      )}

      {/* Password Confirmation Modal */}
      {showPassword && (
        <PasswordConfirmationModal
          open={showPassword}
          onClose={() => setShowPassword(false)}
          onConfirm={passwordConfirmHandler}
        />
      )}

      {/* Edit Year Modal */}
      {editAcademicYear && selectedYearData && (
        <AcademicYearFormModal
          open={editAcademicYear}
          title={DialogTitle.EDIT_ACADEMIC_YEAR}
          type={FormType.EDIT}
          onClose={() => setEditAcademicYear(false)}
          initialData={selectedYearData}
          stream={streams?.map((data) => ({ id: data.id, name: data.name }))}
          standard={standards?.map((data) => ({ id: data.id, name: data.name }))}
        />
      )}

      {/* View Year Modal */}
      {viewAcademicYear && selectedYearData && (
        <AcademicYearFormModal
          open={viewAcademicYear}
          title={DialogTitle.ACADEMIC_YEAR}
          type={FormType.VIEW}
          onClose={() => setViewAcademicYear(false)}
          initialData={selectedYearData}
          standard={standards?.map((data) => ({ id: data.id, name: data.name }))}
          stream={streams?.map((data) => ({ id: data.id, name: data.name }))}
        />
      )}

      {/* Add Year Modal */}
      {addYear && (
        <AcademicYearFormModal
          open={addYear}
          title={DialogTitle.ADD_ACADEMIC_YEAR}
          type={FormType.ADD}
          onClose={() => setAddYear(false)}
          initialData={null}
          stream={streams?.map((data) => ({ id: data.id, name: data.name }))}
          standard={standards?.map((data) => ({ id: data.id, name: data.name }))}
        />
      )}
    </>
  );
}
