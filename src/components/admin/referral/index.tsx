'use client';
import MainCard from '@/components/common/MainCard';
import PasswordConfirmationModal from '@/components/common/password-confirmation-modal';
import SelectDropdown from '@/components/common/Select';
import DeleteConfirmationModal from '@/components/delete-confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { FormType, ReferralItems, TosterMessages } from '@/types/enum';
import { deleteStream, getStreamById } from '@/utils/api/academic';
import { profile } from '@/utils/mock-password';
import md5 from 'md5';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AddBenefitsForm from './add-referral';
import ReferralHeader from './referral-header';
import ReferralTable from './referral-table';
// import mockData from './data.json';
import DateRangePicker from './date-ranger';
import {
  deleteReferral,
  getReferralBenefitsById,
  getReferralBenefitsHistory,
  getReferralBenefitsList
} from '@/utils/api/referral';

const ReferralCard = () => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showFormModal, setFormShowModal] = useState<boolean>(false);
  const [referralId, setReferralId] = useState<number>();
  const [selectedReferral, setSelectedReferral] = useState<any>(null);
  const [benefitsList, setBenefitsList] = useState<any[]>([]);
  const [benefitsHistory, setBenefitsHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [listData, historyData] = await Promise.all([getReferralBenefitsList(), getReferralBenefitsHistory()]);
        setBenefitsList(listData);
        setBenefitsHistory(historyData);
      } catch (error) {
        console.error('Failed to fetch referral data:', error);
      }
    };

    fetchAllData();
  }, []);

  const formatBenefitsList = (data: any[]) => {
    return data.map((item, index) => ({
      's.no': index + 1,
      id: item.id,
      level: item.level,
      referrer: `${item.referrerBenefitedDays} days / ${item.referrerBenefitedTests} tests`,
      referee: `${item.refereeBenefitedDays} days / ${item.refereeBenefitedTests} tests`,
      endDate: new Date(item.expiredDate).toLocaleDateString('en-IN'),
      Status: item.isActive ? 'Active' : 'Inactive',
      Action: item.isActive
    }));
  };
  const formatBenefitsHistory = (data: any[]) => {
    return data.map((item, index) => ({
      's.no': index + 1,
      id: item.id,
      level: item.level,
      referrer: `${item.referrerBenefitedDays} days / ${item.referrerBenefitedTests} tests`,
      referee: `${item.refereeBenefitedDays} days / ${item.refereeBenefitedTests} tests`,
      endDate: new Date(item.expiredDate).toLocaleDateString('en-IN'),
      Status: 'Expired',
      Action: false
    }));
  };
  // Handle Delete
  const handleDelete = (id: number) => {
    setReferralId(id);
    setShowPassword(true);
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (referralId === undefined) {
      toast.error('Referral ID is missing');
      return;
    }

    const response = await deleteReferral(referralId);
    if (response?.statusCode === 200) {
      setShowDeleteModal(false);
      refreshData()
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
    { header: 'S.No', accessor: 's.no' },
    { header: 'Level', accessor: 'level' },
    { header: 'Referrer Benefited', accessor: 'referrer' },
    { header: 'Referee Benefited', accessor: 'referee' },
    { header: 'End Date', accessor: 'endDate' },
    { header: 'Status', accessor: 'Status' },
    { header: 'Action', accessor: 'Action' }
  ];

  const handleShowModal = (type: FormType) => {
    setFormShowModal(true);
  };

  // Handle Edit
  const handleEditViewChange = async (id: number, type: FormType) => {
    try {
      const referralData = await getReferralBenefitsById(id);
      if (referralData) {
        setSelectedReferral(referralData);
        setFormShowModal(true);
      } else {
        toast.error(TosterMessages.SOMETHING_WENT_WRONG);
      }
    } catch (error) {
      toast.error(TosterMessages.SOMETHING_WENT_WRONG);
    }
  };

  const refreshData = async () => {
    try {
      const [listData, historyData] = await Promise.all([
        await getReferralBenefitsList(),
        await getReferralBenefitsHistory(),
      ]);
      setBenefitsList(listData);
      setBenefitsHistory(historyData);
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
    }
  };
  return (
    <>
      <div className="mb-6 flex justify-end gap-2">
        {/* <SelectDropdown
          name="standard"
          data={streamOptions}
          value={selectedStream}
          onChange={(selected) => setSelectedStream(selected.name)}
          placeholder="Select Standard"
          width="w-[170px]"
          color="text-[#4B4B4B]"
          placeholderColor="text-[#4B4B4B]"
          borderColor="border-borderad"
          text="text-[#4B4B4B]"
        /> */}
        {/* <DateRangePicker className="!h-7 rounded-[8px] border border-borderad" /> */}
      </div>
      <ReferralHeader />
      <div className="mb-5">
        <MainCard
          title="Referral Benefits"
          textColor={true}
          actions={
            <Button
              size="md"
              variant="default"
              color="primary"
              data-testid="subject-btn"
              onClick={() => handleShowModal(FormType.ADD)}
              className="!rounded-[8px] text-sm"
            >
              <Icon icon="si:add-fill" className="mr-2 !text-base text-white" />
              {ReferralItems.ADD_BENEFITS}
            </Button>
          }
        >
          <ReferralTable
            data={formatBenefitsList(benefitsList ?? [])}
            columns={columns}
            onDelete={handleDelete}
            onEdit={handleEditViewChange}
            
          />
        </MainCard>
      </div>

      <MainCard title="Referral Benefits History" textColor={true}>
        <ReferralTable
          data={formatBenefitsHistory(benefitsHistory ?? [])}
          columns={columns}
          onDelete={handleDelete}
          onEdit={handleEditViewChange}
          referralHistory={true}
        />
      </MainCard>

      {showFormModal && (
        <AddBenefitsForm
          isOpen={showFormModal}
          initialData={''}
          onClose={() => {
            setFormShowModal(false);
          }}
          refreshData={refreshData}
        />
      )}
      {selectedReferral && showFormModal && (
        <AddBenefitsForm
          isOpen={showFormModal}
          initialData={selectedReferral}
          refreshData={refreshData}
          onClose={() => {
            setFormShowModal(false);
            setSelectedReferral(null);
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
            setReferralId(undefined);
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
};
export default ReferralCard;
