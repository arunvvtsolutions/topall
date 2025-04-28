'use client';
import { useState } from 'react';
import MainCard from '@/components/common/MainCard';
import SelectDropdown from '@/components/common/Select';
import Paginate from '@/components/common/pagination';
import SearchInput from '@/components/common/search-input';
import InfluencerProfile from './profile-header';
import ReferredTable from './referred-table';
import PaymentTable from './payment-table';
import studentMockData from './studentData.json';
import invoiceMockData from './paymentData.json';
import DateRangePicker from '../../students/date-range-picker';
import { useMediaQuery } from '@/hooks/use-media-query';

//columms
const columns = [
  { header: 'S.No', accessor: 'sNo' },
  { header: 'Invoice ID', accessor: 'invoiceId' },
  { header: 'Time Frame', accessor: 'timeFrame' },
  { header: 'Total Amount', accessor: 'totalAmount' },
  { header: 'Invoice Raised Date', accessor: 'invoiceRaisedDate' },
  { header: 'Amount Transferred Date', accessor: 'amountTransferredDate' },
  { header: 'Status', accessor: 'status' }
];

const studentColumns = [
  { header: 'Id', accessor: 'id' },
  { header: 'Device', accessor: 'device' },
  { header: 'Student Name', accessor: 'studentName' },
  { header: 'Test Taken', accessor: 'testsTaken' },
  { header: 'Question', accessor: 'questions' },
  { header: 'Last Seen', accessor: 'lastSeen' },
  { header: 'Status', accessor: 'status' }
];

const statusOptions = [
  { id: 0, name: 'Select Status' },
  { id: 1, name: 'Active' },
  { id: 2, name: 'InActive' }
];

// Define pagination settings
const ITEMS_PER_PAGE = 7;
const SingleInfluencer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [paymentSearchValue, setPaymentSearchValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<number | null>(0);
  const isMd = useMediaQuery('(min-width: 489px)');

  // Filter students based on search and dropdown
  const filteredStudents = studentMockData.filter((student) => {
    const matchesSearch =
      student.id.toLowerCase().includes(searchValue.toLowerCase()) ||
      student.studentName.toLowerCase().includes(searchValue.toLowerCase());

    const matchesStatus =
      selectedStatus === 0 ||
      student.status.toLowerCase() === statusOptions.find((option) => option.id === selectedStatus)?.name.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalStudentPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const paymentFilteredData = invoiceMockData.filter(
    (invoice) =>
      invoice.invoiceId.toLowerCase().includes(paymentSearchValue.toLowerCase()) ||
      invoice.status.toLowerCase().includes(paymentSearchValue.toLowerCase())
  );

  const handleDateSelect = (date: any) => {
    console.log('date', date);
  };
  return (
    <div>
      <div className="mb-4 flex justify-end">
         <DateRangePicker
                 className={`${isMd ? 'w-auto' : 'w-full'} rounded-md border border-borderad bg-white`}
                 onChange={handleDateSelect}
               />
      </div>
      <div className="mb-5">
        <InfluencerProfile />
      </div>
      <div className="mb-5">
        <MainCard
          title="Referred Student List"
          actions={
            <SelectDropdown
              name="statusFilter"
              data={statusOptions}
              value={statusOptions.find((option) => option.id === selectedStatus)}
              onChange={(selected) => {
                setSelectedStatus(selected.id);
                setCurrentPage(1);
              }}
              placeholder="Select Status"
              size="default"
              width="full"
              height="h-8"
              borderRadius="!rounded-[4px]"
              placeholderColor="text-B2CAgray"
              text="text-B2CAgray"
              borderColor="border-borderad"
              color="text-B2CAgray"
              fontsize="text-sm"
            />
          }
          button={
            <SearchInput
              placeholder="Search by ID or Name"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-[0.5rem]] h-8 text-sm text-B2CAgray"
            />
          }
          textColor={true}
        >
          <ReferredTable columns={studentColumns} data={paginatedStudents} />
          <div className="py-5">
            <Paginate currentPage={currentPage} totalPages={totalStudentPages} onPageChange={setCurrentPage} />
          </div>
        </MainCard>
      </div>
      <MainCard
        title="Payment History"
        textColor={true}
        actions={
          <SearchInput
            placeholder="Search by ID or Status"
            value={paymentSearchValue}
            onChange={(e) => setPaymentSearchValue(e.target.value)}
            className="h-8 rounded-[0.5rem] text-sm text-B2CAgray"
          />
        }
      >
        <PaymentTable columns={columns} data={paymentFilteredData} />
      </MainCard>
    </div>
  );
};

export default SingleInfluencer;
