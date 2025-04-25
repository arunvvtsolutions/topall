'use client';
import MainCard from '@/components/common/MainCard';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import StremTable from '@/components/admin/academic/stream/strem-table';
import { useDispatch, useSelector } from '@/store';
import { getStreams, getSyllabusLink } from '@/store/slice/admin/academic';
import { useEffect, useState } from 'react';
import DeleteConfirmationModal from '@/components/delete-confirmation-dialog';
import { deleteStream, deleteSubject, getStreamById } from '@/utils/api/academic';
import { TosterMessages } from '@/types/enum';
import { toast } from 'sonner';
import PasswordConfirmationModal from '@/components/common/password-confirmation-modal';
import StreamFormModal from '../forms/stream-form/stream-form';
import { FormType } from '@/types/enum';
import { profile } from '@/utils/mock-password';
import md5 from 'md5'; 

export default function StreamCard() {
  const dispatch = useDispatch();
  const { streams } = useSelector((state) => state.academic);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [streamId, setStreamId] = useState<number>();
  const [showFormModal, setFormShowModal] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormType | null>(null);
  const [selectedStream, setSelectedStream] = useState<null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      dispatch(getStreams());
    };

    fetchSubjects();
  }, []);

  // Handle Delete
  const handleDelete = (id: number) => {
    setStreamId(id);
    setShowPassword(true);
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    const response = await deleteStream(streamId ?? 0);
    if (response?.statusCode === 200) {
      dispatch(getStreams());
      dispatch(getSyllabusLink());
      setShowDeleteModal(false);
      toast.success(TosterMessages.ADMIN_STREAM_DELETE_SUCCESS);
    } else {
      toast.error(TosterMessages.ADMIN_STREAM_DELETE_FAIL);
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
  //columms
  const columns = [
    { header: 'S.No', accessor: 'S.No' },
    { header: 'Stream Name', accessor: 'Stream Name' },
    { header: 'Question Type', accessor: 'Question Type' },
    { header: 'Total Marks', accessor: 'Total Marks' },
    { header: 'Total Time', accessor: 'Total Time' },
    { header: 'Image', accessor: 'Image' },
    { header: 'Status', accessor: 'Status' },
    { header: 'Action', accessor: 'Action' }
  ];

  const handleShowModal = (type: FormType) => {
    setFormType(type);
    setFormShowModal(true);
  };

  // Handle Edit
  const handleEditViewChange = async (id: number, type: FormType) => {
    try {
      const streamData = await getStreamById(id);
      if (streamData) {
        setSelectedStream(streamData);
        setFormType(type);
        setFormShowModal(true);
      } else {
        toast.error(TosterMessages.SOMETHING_WENT_WRONG);
      }
    } catch (error) {
      toast.error(TosterMessages.SOMETHING_WENT_WRONG);
    }
  };

  return (
    <>
      <MainCard
        title="Stream"
        actions={
          <Button
            size="md"
            variant="default"
            color="primary"
            data-testid="subject-btn"
            onClick={() => handleShowModal(FormType.ADD)}
            className="!rounded-[8px]"
          >
            <Icon icon="si:add-fill" className="text-base text-white" />
            Add Stream
          </Button>
        }
      >
        <StremTable
          data={streams}
          columns={columns}
          onDelete={handleDelete}
          onEdit={handleEditViewChange}
          onRowReorder={() => console.log('rendered row')}
          draggable
          showActions
        />
      </MainCard>

      {/* Stream AddEdit Modal */}
      {showFormModal && (
        <StreamFormModal
          isOpen={showFormModal}
          type={formType}
          initialData={selectedStream}
          onClose={() => {
            setFormShowModal(false);
            setSelectedStream(null);
          }}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          open={showDeleteModal}
          message={'Are you sure you want to delete this Stream?'}
          onClose={() => {
            setShowDeleteModal(false);
            setStreamId(undefined);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* Password Modal */}
      {showPassword && (
        <PasswordConfirmationModal
          open={showPassword}
          onClose={() => {
            setShowPassword(false);
            setShowDeleteModal(false);
          }}
          onConfirm={passwordConfirmHandler}
        />
      )}
    </>
  );
}
