'use client';
import { GenericType } from '@/types';
import { useParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { sampleFiles, streams } from '../mock-data';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { streamWise as streamWiseData } from '../mock-data';
import PDFCard from './pdf-card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import SelectDropdown from '@/components/common/Select';
import FileUploadModal from './upload-file-modal';
import { toast } from 'sonner';
import { ButtonNames, TosterMessages } from '@/types/enum';
import { profile } from '@/utils/mock-password';
import DeleteConfirmationModal from '@/components/delete-confirmation-dialog';
import PasswordConfirmationModal from '@/components/common/password-confirmation-modal';
import md5 from 'md5';

const SyllabusIndex = () => {
  const { streamId, streamwiseId } = useParams();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedStandard, setSelectedStandard] = useState<GenericType>();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const [breadCrumbData, setBreadCrumbData] = useState<{ stream: GenericType | null; streamWise: GenericType | null }>({
    stream: null,
    streamWise: null
  });

  // useEffect to Set The BreadCrumb Data
  useEffect(() => {
    const stream = streams.find((s) => s.id === Number(streamId)) || null;
    const streamWise = streamWiseData.find((s) => s.id === Number(streamwiseId)) || null;
    setBreadCrumbData({ stream, streamWise });
  }, [streamwiseId, streamId]);

  const { stream, streamWise } = breadCrumbData;
  const streamName = stream?.name ?? `Stream #${streamId}`;
  const streamWiseName = streamWise?.name ?? `Stream #${streamwiseId}`;

  const breadcrumbItems = useMemo(
    () => [
      { label: 'All Folders', href: '/admin/uploads' },
      { label: streamName, href: `/admin/uploads/${streamId}` },
      { label: streamWiseName }
    ],
    [streamName, streamWiseName, streamId]
  );

  // File Edit Handler
  const handleEdit = (id: string) => {
    console.log(`Editing file with id: ${id}`);
    // Add your edit logic here
  };

  // Standard Filter Handler
  const standardFilterHandler = (std: GenericType) => {
    setSelectedStandard(std);
  };

  // File Delete Handler
  const handleDelete = () => {
    setShowPassword(true);
  };

  // File Delete Confirm Handler
  const handleDeleteConfirm = async () => {
    toast.success(TosterMessages.FILE_DELETE_SUCCESS);
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
      toast.error(TosterMessages.FILE_DELETE_FAIL);
      setShowPassword(false);
    }
  };

  return (
    <div className="mx-2 mt-3 h-full min-h-[calc(100vh-6.72rem)] sm:mx-2 md:mx-2 lg:mx-2 xl:mx-6">
      <div className="flex justify-between">
        <div>
          <Breadcrumbs items={breadcrumbItems} separator={<BreadcrumbSeparator />} />
        </div>
        <div className="flex flex-wrap justify-between pl-2 sm:pl-0">
          <SelectDropdown
            size="default"
            data={[{ name: 'Standard', id: 0 }, ...streams]}
            value={selectedStandard}
            onChange={standardFilterHandler}
            name="standard"
            primaryIcon={false}
            placeholder="Standard"
            placeholderColor="text-[#4B4B4B]"
            placeholderSize="md:text-sm text-xs"
            borderColor="border-borderad"
          />
          <Button
            variant="default"
            color="secondary"
            className="w-full rounded-lg border border-borderad bg-[#FFFFFF] text-xs font-medium text-[#4B4B4B] sm:ml-2 sm:w-auto md:text-sm"
            size="md"
            type="button"
            onClick={() => setOpenModal(true)}
          >
            <Icon icon="si:add-fill" className="mr-1 md:text-xl" />
            {ButtonNames.UPLOAD_FILE}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sampleFiles && sampleFiles.length > 0 ? (
          sampleFiles.map((file) => {
            return <PDFCard file={file} onEdit={handleEdit} onDelete={handleDelete} />;
          })
        ) : (
          <p>No Data Found</p>
        )}
      </div>

      {/* File Create Modal */}
      {openModal && (
        <FileUploadModal
          title="UPLOAD FILES"
          secondaryTitle="Select and upload the files"
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          open={showDeleteModal}
          message={'Are you sure you want to delete this File?'}
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

export default SyllabusIndex;
