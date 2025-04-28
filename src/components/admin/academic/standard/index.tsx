'use client';
import MainCard from '@/components/common/MainCard';
import PaswordConfirmationModal from '@/components/common/password-confirmation-modal';
import SelectDropdown from '@/components/common/Select';
import DeleteConfirmationDialog from '@/components/delete-confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useDispatch, useSelector } from '@/store';
import { getStandards, getStreams } from '@/store/slice/admin/academic';
import { GenericType } from '@/types';
import { DialogTitle, FormType, TableNames, TosterMessages } from '@/types/enum';
import { deleteStandard } from '@/utils/api/academic';
import { profile } from '@/utils/mock-password';
import md5 from 'md5';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import StandardFormModal from '../forms/standard-form/standard-form-modal';
import StandardTable from './standard-table';

const StandardCard = () => {
  const dispatch = useDispatch();
  const { standards } = useSelector((state) => state.academic);
  const { streams } = useSelector((state) => state.selectors);
  const [standardData, setStandardData] = useState<any>([]);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [standardId, setStandardId] = useState<number>();
  const [standard, setStandard] = useState<any>(null);

  const [editaStandard, setEditStandard] = useState<boolean>(false);
  const [addStandard, setAddStandard] = useState<boolean>(false);
  const [viewStandard, setViewStandard] = useState<boolean>(false);
  const [selected, setSelected] = useState<GenericType>({ id: 0, name: '' });
  const [dragger, setDragger] = useState<boolean>(true);

  const streamData = [{ id: 0, name: 'Select Stream' }, ...streams];

  // Table Headers
  const columns = [
    { header: 'S.No', accessor: 's.no' },
    { header: 'Standard', accessor: 'sstandard' },
    { header: 'Stream ID', accessor: 'stream-id' },
    { header: 'Image', accessor: 'image' },
    { header: 'Status', accessor: 'status' },
    { header: 'Action', accessor: 'action' }
  ];

  // Fetch standards and streams on mount
  useEffect(() => {
    dispatch(getStreams());
    dispatch(getStandards());
  }, []);

  useEffect(() => {
    setStandardData(standards);
  }, [standards]);

  // Handle Delete Standard
  const handleDelete = (id: number) => {
    setStandardId(id);
    setShowPassword(true);
  };

  // Handle Edit Standard
  const handleEdit = (id: number) => {
    const standard = standards.find((standard: any) => standard.id === id);
    setStandard(standard);
    setEditStandard(true);
  };

  // Handle Delete Standard Confirm
  const onDeleteConfirm = async () => {
    try {
      const res = await deleteStandard(standardId ?? 0);
      if (res.statusCode === 200) {
        toast.success(TosterMessages.ADMIN_STD_DELETE_SUCCESS);
        dispatch(getStandards());
        setStandardId(undefined);
        setShowDelete(false);
      } else {
        toast.error(TosterMessages.ADMIN_STD_DELETE_FAIL);
        setStandardId(undefined);
        setShowDelete(false);
      }
    } catch (error) {
      toast.error(TosterMessages.ADMIN_STD_DELETE_FAIL);
    }
  };

  // Handle Password Confirmation
  const onPasswordConfirm = async (pass: string) => {
    try {
      // API for password confirmation
      if (profile.user.publish_password == md5(pass)) {
        setShowPassword(false);
        setShowDelete(true);
      } else {
        toast.error(TosterMessages.ADMIN_PASSWORD_ERROR);
        setShowPassword(false);
      }
    } catch (error) {
      toast.error(TosterMessages.ADMIN_SUB_DELETE_FAIL);
      setShowPassword(false);
    }
  };

  // Stream Dropdown Change Handler
  const changeSelect = (stream: GenericType) => {
    if (stream.id === 0) {
      dropDownClearHandler();
      dispatch(getStandards());
      setDragger(true);
    } else {
      const filteredStandard = standards.filter((standard: any) => standard.streams.id === stream.id);
      setStandardData(filteredStandard);
      setDragger(false);
      setSelected(stream);
    }
  };

  // Dropdown clear handler
  const dropDownClearHandler = () => {
    setSelected({ id: 0, name: '' });
  };

  // Handle Show Standard
  const onShowStandard = (id: number) => {
    const standard = standards.find((standard) => standard.id === id);
    setStandard(standard);
    setViewStandard(true);
  };

  return (
    <>
      <MainCard
        title={TableNames.STD}
        dataTestId={TableNames.STD}
        actions={
          <div className="sm:auto flex flex-grow justify-end">
            <SelectDropdown
              data={streamData}
              value={selected}
              onChange={changeSelect}
              placeholder="Select Stream"
              name="stream"
              size="default"
              width="w-full"
            />
          </div>
        }
        button={
          <>
            {/* Add Subject Button (Mobile-only) */}
            <div onClick={() => setAddStandard(true)}>
              <Button size="md" variant="default" color="primary" data-testid="add-standard-btn" className="!rounded-[8px]">
                <Icon icon="tabler:plus" className="text-base text-white" />
                Add Standard
              </Button>
            </div>
          </>
        }
      >
        <StandardTable
          data={standardData}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShow={onShowStandard}
          draggable={dragger}
        />
      </MainCard>
      <PaswordConfirmationModal open={showPassword} onConfirm={onPasswordConfirm} onClose={() => setShowPassword(false)} />
      <DeleteConfirmationDialog
        open={showDelete}
        message={`Are you sure you want to delete the standard?`}
        onClose={() => setShowDelete(false)}
        onConfirm={onDeleteConfirm}
      />
      {editaStandard && (
        <StandardFormModal
          open={editaStandard}
          title={DialogTitle.EDIT_STANDARD}
          type={FormType.EDIT}
          initialData={standard}
          onClose={() => setEditStandard(false)}
          stream={streamData}
          clearDropdown={dropDownClearHandler}
        />
      )}
      {addStandard && (
        <StandardFormModal
          open={addStandard}
          title={DialogTitle.ADD_STANDARD}
          type={FormType.ADD}
          initialData={null}
          onClose={() => setAddStandard(false)}
          stream={streamData}
          clearDropdown={dropDownClearHandler}
        />
      )}
      {viewStandard && (
        <StandardFormModal
          open={viewStandard}
          title={DialogTitle.STANDARD}
          type={FormType.VIEW}
          initialData={standard}
          onClose={() => setViewStandard(false)}
          stream={streamData}
        />
      )}
    </>
  );
};

export default StandardCard;
