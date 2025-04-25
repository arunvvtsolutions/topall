'use client';

import React, { useEffect, useState } from 'react';
import SearchInput from '@/components/common/search-input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import FacultyCard from './faculty-card';
import AddFacultyForm from './add-faculty-form';
import { FacultyTitle, FormFields, FormType, TosterMessages } from '@/types/enum';
import { deleteFaculty, getAllFaculty, getFacultyById, updateFacultyActiveStatus } from '@/utils/api/faculty';
import DeleteConfirmationDialog from '@/components/delete-confirmation-dialog';
import InactiveConfirmationDialog from './inactive-confirmation';
import { toast } from 'sonner';

interface Stream {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
}

interface Faculty {
  id: number;
  name: string;
  imageFile: string | null;
  mobile: string;
  streams: Stream[];
  subject: { id: number; name: string };
  isActive: boolean;
  isExpert: boolean;
}

const Faculty = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isAddFacultyOpen, setIsAddFacultyOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
  const [facultyData, setFacultyData] = useState<Faculty[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState<number | null>(null);
  const [showInactiveModal, setShowInactiveModal] = useState(false);
  const [facultyToInactive, setFacultyToInactive] = useState<number | null>(null);
  const [editFacultyData, setEditFacultyData] = useState<Faculty | null>(null);

  const fetchFaculty = async () => {
    try {
      const response = await getAllFaculty({
        search: searchValue,
        isActive: activeTab === 'active',
      });
      setFacultyData(response || []);
    } catch (error) {
      console.error('Error fetching faculty:', error);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, [searchValue, activeTab]);
  

  const handleSearchChange = (value: string) => setSearchValue(value);
  const handleOpenModal = () => {
    setEditFacultyData(null);
    setIsAddFacultyOpen(true);
  };
  const handleCloseModal = () => setIsAddFacultyOpen(false);

  const handleEdit = async (id: number) => {
    try {
      const facultyDetails = await getFacultyById(id);
      
      setEditFacultyData(facultyDetails);
      setIsAddFacultyOpen(true);
    } catch (error) {
      console.error('Error fetching faculty details:', error);
    }
  };

  const confirmDelete = (id: number) => {
    setFacultyToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (facultyToDelete !== null) {
      try {
        await deleteFaculty(facultyToDelete);
        setFacultyData((prev) => prev.filter((faculty) => faculty.id !== facultyToDelete));
        toast.success(TosterMessages.ADMIN_FACULTY_DELETE_SUCCESS);
      } catch (error) {
        console.error('Error deleting faculty:', error);
      }
    }
    setShowDeleteModal(false);
    setFacultyToDelete(null);
  };

  const confirmInactive = (id: number) => {
    setFacultyToInactive(id);
    setShowInactiveModal(true);
  };

  const handleInactive = async () => {
    if (facultyToInactive !== null) {
      try {
        await updateFacultyActiveStatus(facultyToInactive);
        setFacultyData((prev) =>
          prev.map((faculty) => (faculty.id === facultyToInactive ? { ...faculty, isActive: false } : faculty))
        );
        toast.success(activeTab === 'inactive' ? 'Faculty Activated successfully' : 'Faculty Inactivated successfully');
      } catch (error) {
        console.error('Error updating faculty status:', error);
      }
    }
    setShowInactiveModal(false);
    setFacultyToInactive(null);
  };

  const filteredFacultyData = facultyData.filter((faculty) => faculty.isActive === (activeTab === 'active'));
  return (
    <div className="p-4 md:p-6" aria-labelledby="faculty-section">
      {/* Header Section */}
      <div className="mb-6 flex flex-wrap items-center justify-between md:border-b md:border-borderad">
        <div className="flex flex-wrap gap-4 sm:gap-6">
          <button
            className={`mt-3 pb-3 text-base font-semibold uppercase md:text-xl ${
              activeTab === 'active' ? 'border-b-2 border-primary text-primary' : 'text-[#222222]'
            }`}
            onClick={() => setActiveTab('active')}
          >
            {FormFields.ACTIVE}
          </button>

          <button
            className={`mt-3 pb-3 text-base font-semibold uppercase md:text-xl ${
              activeTab === 'inactive' ? 'border-b-2 border-primary text-primary' : 'text-[#222222]'
            }`}
            onClick={() => setActiveTab('inactive')}
          >
            {FormFields.INACTIVE}
          </button>
        </div>

        {/* Right-side content: Search & Add Faculty Button */}
        <div className="mt-4 flex w-full flex-wrap justify-between gap-3 sm:ml-auto sm:mt-0 sm:w-auto sm:flex-nowrap">
          <SearchInput
            placeholder="Search by ID or Name"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full text-xs text-B2CAgray sm:w-[12.5rem] md:w-[20rem]"
            aria-label="Search Faculty by ID or Name"
          />

          <Button
            onClick={handleOpenModal}
            size="md"
            variant="default"
            data-testid="subject-btn"
            className="hover:bg-primary-dark hover:border-primary-dark z-20 flex min-w-[8.125rem] items-center justify-center gap-1 border border-primary bg-primary text-white transition-colors duration-300 ease-in-out hover:shadow-lg active:scale-95"
            aria-label="Add Faculty"
          >
            <Icon icon="si:add-fill" className="text-lg text-white" aria-hidden="true" />
            {FacultyTitle.CREATE_FACULTY}
          </Button>
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="pt-5 md:pt-0">
  {filteredFacultyData.length > 0 ? (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {filteredFacultyData.map((faculty) => (
        <FacultyCard
          key={faculty.id}
          id={faculty.id}
          name={faculty.name}
          profileImage={faculty.imageFile}
          phoneNumber={faculty.mobile}
          subject={faculty.subject}
          streams={faculty.streams}
          isExpert={faculty.isExpert}
          isActive={faculty.isActive}
          onEdit={handleEdit}
          onDelete={confirmDelete}
          onInactive={confirmInactive}
        />
      ))}
    </div>
  ) : (
    <div className="py-8 text-center text-sm text-gray-500">
      {FormFields.NO_DATA_MSG}
    </div>
  )}
</div>

      {isAddFacultyOpen && (
        <AddFacultyForm
          isOpen={isAddFacultyOpen}
          onClose={handleCloseModal}
          initialData={editFacultyData}
          type={editFacultyData ? FormType.EDIT : FormType.ADD}
          refreshFaculty={fetchFaculty}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationDialog
          open={showDeleteModal}
          message={'Are you sure you want to delete this faculty member?'}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {showInactiveModal && (
        <InactiveConfirmationDialog
          open={showInactiveModal}
          message={`Are you sure you want to ${activeTab==='inactive'? "Inactive":"Active"} this Faculty ?`}
          onClose={() => setShowInactiveModal(false)}
          onConfirm={handleInactive}
          isActive={activeTab}
        />
      )}
    </div>
  );
};

export default Faculty;
