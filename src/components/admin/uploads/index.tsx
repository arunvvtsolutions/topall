'use client';
import AdminSectionHeader from '@/components/common/admin-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import React, { useState } from 'react';
import Folder from './folder';
import CreateFolder from './create-folder';
import { FormType, TosterMessages } from '@/types/enum';
import { toast } from 'sonner';
import PasswordConfirmationModal from '@/components/common/password-confirmation-modal';
import DeleteConfirmationModal from '@/components/delete-confirmation-dialog';
import { profile } from '@/utils/mock-password';
import md5 from 'md5';
import { streams } from './mock-data';

const Uploads = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [formType, setFormType] = useState<FormType | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Create Folder Handler
  const handleCreateFolder = () => {
    setOpenModal(true);
    setFormType(FormType.ADD);
  };

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

  return (
    <div className="mx-2 h-full min-h-[calc(100vh-6.75rem)] sm:mx-2 md:mx-2 lg:mx-2 xl:mx-6">
      <div>
        <AdminSectionHeader
          title="All Folders"
          action={
            <Button
              variant="default"
              color="secondary"
              className="rounded-sm border border-borderad bg-[#FFFFFF] text-xs font-medium text-[#4B4B4B] md:text-sm"
              size="md"
              type="button"
              onClick={handleCreateFolder}
            >
              <Icon icon="si:add-fill" className="mr-1 md:text-xl" />
              Add Stream Folder
            </Button>
          }
          className="mt-3 flex items-center justify-between pb-4"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {streams && streams.length > 0 ? (
          streams.map((stream: any) => (
            <Folder key={stream.id} title={stream.name} onDelete={() => handleDelete(stream.id)} id={stream.id} />
          ))
        ) : (
          <div className="col-span-full flex h-[70vh] w-full items-center justify-center text-xl text-[#222222]">
            No Folder Found
          </div>
        )}
      </div>

      {openModal && (
        <CreateFolder
          onClose={() => setOpenModal(false)}
          label="STREAM"
          open={openModal}
          iconName="stash:folder-alt"
          data={streams}
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

export default Uploads;
