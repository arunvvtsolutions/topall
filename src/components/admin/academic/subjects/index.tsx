'use client';
import React, { useEffect, useState } from 'react';
import MainCard from '@/components/common/MainCard';
import SubjectTable from '@/components/admin/academic/subjects/subject-table';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from '@/store';
import { getSubjects } from '@/store/slice/admin/academic';
import DeleteConfirmationModal from '@/components/delete-confirmation-dialog';
import { toast } from 'sonner';
import { ButtonNames, DialogTitle, FormType, TosterMessages } from '@/types/enum';
import SubjectFormModal from '../forms/subject-form/subject-form-modal';
import PasswordConfirmationModal from '@/components/common/password-confirmation-modal';
import { deleteSubject } from '@/utils/api/academic';
import { profile } from '@/utils/mock-password';
import md5 from 'md5';

export default function SubjectCard() {
  const dispatch = useDispatch();
  const subjects = useSelector((state) => state.academic?.subjects);
  const [subjectId, setSubjectId] = useState<number>();
  const [subject, setSubject] = useState<any>(null);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [editSubject, setEditSubject] = useState<boolean>(false);
  const [addSubject, setAddSubject] = useState<boolean>(false);
  const [viewSubject, setViewSubject] = useState<boolean>(false);
  //columms
  const columns = [
    { header: 'S.No', accessor: 's.no' },
    { header: 'Subject', accessor: 'subject' },
    { header: 'Subject Code', accessor: 'subject-code' },
    { header: 'Image', accessor: 'image' },
    { header: 'Status', accessor: 'status' },
    { header: 'Action', accessor: 'action' }
  ];

  useEffect(() => {
    const fetchSubjects = async () => {
      dispatch(getSubjects());
    };

    fetchSubjects();
  }, []);
  // Handle Delete
  const handleDelete = (id: number) => {
    setSubjectId(id);
    setShowPassword(true);
  };

  // Handle Show Subject
  const handleShowSubject = (id: number) => {
    const subject = subjects?.find((subject: any) => subject.id === id);
    setSubject(subject);
    setViewSubject(true);
  };

  // Handle Edit Subject
  const handleEdit = (id: number) => {
    const subject = subjects.find((subject: any) => subject.id === id);
    setSubject(subject);
    setEditSubject(true);
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    try {
      const deleteRes = await deleteSubject(subjectId ?? 0);
      if (deleteRes.statusCode === 200) {
        toast.success(TosterMessages.ADMIN_DELETE_SUCCESS);
        dispatch(getSubjects());
        setShowDeleteModal(false);
      } else {
        toast.error(TosterMessages.ADMIN_SUB_DELETE_FAIL);
        setSubjectId(undefined);
        setShowDeleteModal(false);
      }
    } catch (error) {
      toast.error(TosterMessages.ADMIN_SUB_DELETE_FAIL);
    }
  };

  // Handle Password Confirmation
  const passwordConfirmHandler = async (pass: string) => {
    try {
      // API for password confirmation
      if (profile.user.publish_password == md5(pass)) {
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
        title={DialogTitle.SUBJECT}
        actions={
          <Button
            onClick={() => setAddSubject(true)}
            size="md"
            variant="default"
            color="primary"
            data-testid="add-subject-btn"
            className="!rounded-[8px]"
          >
            <Icon icon="si:add-fill" className="text-base text-white" />
            {ButtonNames.ADD_SUB}
          </Button>
        }
        dataTestId="subject-card"
      >
        <SubjectTable
          data={(subjects && subjects) || []}
          columns={columns}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onShow={handleShowSubject}
          onRowReorder={() => console.log('rendered row')}
          draggable
        />
      </MainCard>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          open={showDeleteModal}
          message={'Are you sure you want to delete this subject?'}
          onClose={() => {
            setShowDeleteModal(false);
            setSubjectId(undefined);
          }}
          onConfirm={handleDeleteConfirm}
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

      {/* Edit Subject Modal */}
      {editSubject && (
        <SubjectFormModal
          open={editSubject}
          title={DialogTitle.EDIT_SUB}
          type={FormType.EDIT}
          onClose={() => setEditSubject(false)}
          initialData={subject}
        />
      )}

      {/* View Subject Modal*/}
      {viewSubject && (
        <SubjectFormModal
          open={viewSubject}
          title={DialogTitle.SUB}
          type={FormType.VIEW}
          onClose={() => setViewSubject(false)}
          initialData={subject}
        />
      )}

      {/* Add Subject Modal*/}
      {addSubject && (
        <SubjectFormModal
          open={addSubject}
          title={DialogTitle.ADD_SUB}
          type={FormType.ADD}
          onClose={() => setAddSubject(false)}
          initialData={null}
        />
      )}
    </>
  );
}
