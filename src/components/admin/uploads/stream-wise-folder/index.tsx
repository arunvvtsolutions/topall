'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { GenericType } from '@/types';
import { streams, streamWise } from '../mock-data';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Folder from '../folder';
import { toast } from 'sonner';
import { ButtonNames, FormType, TosterMessages } from '@/types/enum';
import { profile } from '@/utils/mock-password';
import md5 from 'md5';
import PasswordConfirmationModal from '@/components/common/password-confirmation-modal';
import DeleteConfirmationModal from '@/components/delete-confirmation-dialog';
import CreateFolder from '../create-folder';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

const StreamWiseFolder = () => {
  const { streamId } = useParams(); // Get the streamId from the URL
  const [stream, setStream] = useState<GenericType | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormType | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Delete Folder Handler
  const handleDelete = (id: number) => {
    console.log('id', id);
    setShowPassword(true);
  };

  // Delete Folder Confirmation Handler
  const handleDeleteConfirm = async () => {
    toast.success(TosterMessages.FOLDER_DELETE_SUCCESS);
    setShowDeleteModal(false);
  };

  // Password Confirmation Handler
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
      toast.error(TosterMessages.CAROUSEL_DELETE_FAIL);
      setShowPassword(false);
    }
  };

  // Edit Folder Handler
  const handleEdit = (id: number) => {
    setOpenModal(true);
    setFormType(FormType.EDIT);
    console.log('id', id);
  };

  // Create Folder Handler
  const createFolderHandler = () => {
    setOpenModal(true);
    setFormType(FormType.ADD);
  };

  useEffect(() => {
    if (!streamId) return;
    const id = Number(streamId); // Convert streamId to a number
    const foundStream = streams.find((s) => s.id === id);
    setStream(foundStream || null); // Set stream to null if not found
  }, [streamId]);

  // Fallback name when stream is not available yet
  const streamName = stream ? stream.name : `Stream #${streamId}`;

  const breadcrumbItems = [{ label: 'All Folders', href: '/admin/uploads' }, { label: streamName }];

  return (
    <div className="mx-2 mt-3 h-full min-h-[calc(100vh-6.72rem)] sm:mx-2 md:mx-2 lg:mx-2 xl:mx-6">
      <div className="flex justify-between">
        <Breadcrumbs items={breadcrumbItems} separator={<BreadcrumbSeparator />} />
        <Button
          variant="default"
          color="secondary"
          className="rounded-sm border border-borderad bg-[#FFFFFF] text-xs font-medium text-[#4B4B4B] md:text-sm"
          size="md"
          type="button"
          onClick={createFolderHandler}
        >
          <Icon icon="si:add-fill" className="mr-1 md:text-xl" />
          {ButtonNames.CREATE_FOLDER_SMALL}
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {streamWise && streamWise.length > 0 ? (
          streamWise.map((stream: any) => (
            <Folder
              key={stream.id}
              title={stream.name}
              onDelete={() => handleDelete(stream.id)}
              onEdit={() => handleEdit(stream.id)}
              id={stream.id}
            />
          ))
        ) : (
          <div className="col-span-full flex h-[75vh] w-full items-center justify-center text-xl text-[#222222]">
            No Folder Found
          </div>
        )}
      </div>

      {openModal && (
        <CreateFolder
          onClose={() => setOpenModal(false)}
          label="Folder Name"
          open={openModal}
          iconName="stash:folder-alt"
          type={formType}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          open={showDeleteModal}
          message={'Are you sure you want to delete this Folder?'}
          onClose={() => {
            setShowDeleteModal(false);
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
    </div>
  );
};

export default StreamWiseFolder;
