'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@/store';
import { toast } from 'sonner';
import TesttypeTable from '@/components/admin/academic/testtype/test-type-table';
import MainCard from '@/components/common/MainCard';
import SelectDropdown from '@/components/common/Select';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { GenericType, SingleStream, Streams } from '@/types';

import { Testtype } from '@/types';
import { getStreams, getTesttype } from '@/store/slice/admin/academic';
import { ButtonNames, DialogTitle, FormType, TosterMessages } from '@/types/enum';
import PasswordConfirmationModal from '@/components/common/password-confirmation-modal';
import DeleteConfirmationModal from '@/components/delete-confirmation-dialog';
import { deleteTesttype, getTestById } from '@/utils/api/academic';
import TestTypeFormModal from '../forms/testtype-form/testtype-form-model';
import { number } from 'zod';
import { profile } from '@/utils/mock-password';
import md5 from 'md5';
import InstructionModal from './instruction-modal';
import { HttpStatus } from '@/types/constants';

const columns = [
  { header: 'S.No', accessor: 's.no' },
  { header: 'Stream', accessor: 'Stream' },
  { header: 'Test Type', accessor: 'Test Type' },
  { header: 'Stream ID', accessor: 'Stream ID' },
  { header: 'Instructions', accessor: 'Instructions' },
  { header: 'Image', accessor: 'Image' },
  { header: 'Leaderboard for Tests', accessor: 'Leaderboard for Tests' },
  { header: 'Status', accessor: 'Status' },
  { header: 'Action', accessor: 'Action' }
];

const TesttypeCard = () => {
  const dispatch = useDispatch();
  const { testtype } = useSelector((state) => state.academic);
  const { streams } = useSelector((state) => state.selectors);
  const [dragger, setDragger] = useState<boolean>(true);

  const [selectedStream, setSelectedStream] = useState<GenericType | null>(null);
  const [filteredTesttype, setFilteredTesttype] = useState<Testtype[]>([]);
  const [testTypeId, setTestTypeId] = useState<number>();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedTestType, setSelectedTestType] = useState<Testtype | null>(null);
  const [showInstructionModal, setShowInstructionModal] = useState<boolean>(false);

  const [showFormModel, setShowFormModel] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormType | null>(null);

  useEffect(() => {
    dispatch(getTesttype());
  }, [dispatch]);

  useEffect(() => {
    const filteredData =
      selectedStream && selectedStream.id !== 0
        ? testtype.filter((testType: Testtype) => testType.streams?.id === selectedStream.id)
        : testtype;
    setFilteredTesttype(filteredData);
  }, [selectedStream, testtype]);

  const handleStreamChange = (streams: GenericType | null) => {
    if (!streams) return;

    if (streams.id === 0) {
      setDragger(true);
      dropDownClearHandler();
      setSelectedStream(null);
    } else {
      setDragger(false);

      setSelectedStream(streams);
    }
  };

  const handleDelete = (id: number) => {
    setTestTypeId(id);
    setShowPassword(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const deleteRes = await deleteTesttype(1);
      if (deleteRes.statusCode === HttpStatus.BAD_REQUEST) {
        toast.error(TosterMessages.ADMIN_TEST_TYPE_IN_USE);
        return;
      }
      if (deleteRes.statusCode === HttpStatus.OK) {
        toast.success(TosterMessages.ADMIN_TEST_DELETE_SUCCESS);
        dispatch(getTesttype());
      } else {
        toast.error(TosterMessages.ADMIN_TEST_DELETE_FAIL);
      }
    } catch (error) {
      toast.error(TosterMessages.ADMIN_TEST_DELETE_FAIL);
    } finally {
      setShowDeleteModal(false);
      setTestTypeId(undefined);
    }
  };

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

  const handleShowModal = (type: FormType) => {
    setFormType(type);
    setShowFormModel(true);
  };
  const handleEditViewChange = async (id: number, type: FormType) => {
    try {
      const testtypeData = await getTestById(id);
      if (testtypeData) {
        setSelectedTestType(testtypeData[0]);
        setFormType(type);
        setShowFormModel(true);
      } else {
        toast.error(TosterMessages.SOMETHING_WENT_WRONG);
      }
    } catch (error) {
      toast.error(TosterMessages.SOMETHING_WENT_WRONG);
    }
  };

  const handleView = (id: number, type: FormType) => {
    const testType = testtype.find((tt: any) => tt.id === id);
    setSelectedTestType(testType || null);
    setShowFormModel(true);
    setFormType(type);
  };

  const closeModal = () => {
    setShowFormModel(false);
    setSelectedTestType(null);
  };

  // Dropdown clear handler
  const dropDownClearHandler = () => {
    setSelectedStream({ id: 0, name: '' });
  };

  const handleShowInstructionModal = async (id: number) => {
    const testTypeRes = await getTestById(id);
    setSelectedTestType(testTypeRes[0]);
    setShowInstructionModal(true);
  };

  return (
    <MainCard
      title={DialogTitle.TESTTYPE}
      actions={
        <SelectDropdown
          value={selectedStream}
          placeholder="Select Stream"
          data={[{ id: 0, name: 'Select Stream' }, ...streams]}
          onChange={handleStreamChange}
          name="stream select"
          size="default"
          width="w-full"
        />
      }
      button={
        <Button
          size="md"
          variant="default"
          color="primary"
          onClick={() => handleShowModal(FormType.ADD)}
          data-testid="add-testtype-btn"
          className="!rounded-[8px]"
        >
          <Icon icon="tabler:plus" className="text-base text-white" />
          {ButtonNames.ADD_TEST}
        </Button>
      }
    >
      <TesttypeTable
        columns={columns}
        data={filteredTesttype}
        showActions
        draggable={dragger}
        onDelete={handleDelete}
        onEdit={handleEditViewChange}
        onShow={handleView}
        onInstruction={handleShowInstructionModal}
        onRowReorder={() => console.log('Row reorder action triggered')}
      />

      {showDeleteModal && (
        <DeleteConfirmationModal
          open={showDeleteModal}
          message="Are you sure you want to delete this Test type?"
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {showPassword && (
        <PasswordConfirmationModal
          open={showPassword}
          onClose={() => setShowPassword(false)}
          onConfirm={passwordConfirmHandler}
        />
      )}

      {showFormModel && (
        <TestTypeFormModal
          open={showFormModel}
          type={formType}
          initialData={selectedTestType} // Empty object for Add mode
          onClose={closeModal}
          stream={[{ id: 0, name: 'Select Stream' }, ...streams]}
        />
      )}

      {/* insturuction modal */}
      {showInstructionModal && (
        <InstructionModal
          data={selectedTestType}
          isOpen={showInstructionModal}
          onClose={() => {
            setShowInstructionModal(false);
            setSelectedTestType(null);
          }}
        />
      )}
    </MainCard>
  );
};

export default TesttypeCard;
