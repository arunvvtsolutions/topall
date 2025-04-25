'use client';
import MainCard from '@/components/common/MainCard';
import SelectDropdown from '@/components/common/Select';
import SyllabusTable from '@/components/admin/academic/syllabus linking/syllabuslinking-table';
import ChaptersTopicsModal from './chapter-topics-modal';
import { useEffect, useState } from 'react';
import { GenericType } from '@/types';
import { useDispatch, useSelector } from '@/store';
import { getStandardSelectors } from '@/store/slice/admin/selectors';
import { filterSyllabusLink, getSingleSyllabus, getStandards, getSyllabusLink } from '@/store/slice/admin/academic';
import PaswordConfirmationModal from '@/components/common/password-confirmation-modal';
import SyllabusAccordion from './accordion/SyllabusAccordion';
import { profile } from '@/utils/mock-password';
import md5 from 'md5';
import { toast } from 'sonner';
import { TosterMessages } from '@/types/enum';

export type SyllabusProps = {
  id: number;
  sequence: number;
  is_active: boolean;
  qbank_subject_id: number;
  streams: GenericType;
  standard: GenericType;
  subjects: GenericType;
};

export default function SyllabusCard() {
  const dispatch = useDispatch();
  const { streams } = useSelector((state) => state.selectors);
  const { syllabusLink, standards, syllabus } = useSelector((state) => state.academic);

  const [dragger, setDragger] = useState(true);
  const [streamId, setStreamId] = useState<number>(0);
  const [showSyllabus, setShowSyllabus] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [standardData, setStandardData] = useState<GenericType[]>([{ id: 0, name: 'SELECT STANDARD' }]);
  const [selectedStream, setSelectedStream] = useState<GenericType>({ id: 0, name: 'SELECT STREAM' });
  const [selectedStandard, setSelectedStandard] = useState<GenericType>({ id: 0, name: 'SELECT STANDARD' });
  const [singleSyllabus, setSingleSyllabus] = useState<any | null>(null);
  const [syllabusForAPI, setSyllabusForAPI] = useState<any>({});
  const [showChaptersModal, setShowChaptersModal] = useState<boolean>(false);
  const [selectedSyllabus, seSelectedSyllabus] = useState<SyllabusProps | null>(null);

  const columns = [
    { header: 'S.No', accessor: 's.no' },
    { header: 'Subject Name', accessor: 'Subject Name' },
    { header: 'Stream', accessor: 'Stream' },
    { header: 'Standard', accessor: 'Standard' },
    { header: 'Chapter And Topic', accessor: 'Chapter And Topic ' },
    { header: 'Status', accessor: 'Status' }
  ];

  useEffect(() => {
    dispatch(getSyllabusLink());
    dispatch(getStandards());
  }, []);

  // Stream Change Handler
  const streamChangeHandler = async (str: GenericType) => {
    str.id === 0 ? setDragger(true) : setDragger(false);
    setSelectedStream(str);
    setStandardData([
      { id: 0, name: 'Select Standard' },
      ...standards.filter((std: any) => std.streams.id === str.id).map((std: any) => ({ id: std.id, name: std.name }))
    ]);
    setSelectedStandard({ id: 0, name: 'Select Standard' });
    setStreamId(str.id);
    await dispatch(filterSyllabusLink(str.id, 0));
  };

  // Standard Change Handler
  const standardChangeHandler = async (std: GenericType) => {
    setSelectedStandard(std);
    await dispatch(filterSyllabusLink(streamId, std.id));
  };

  // View Syllabus Handler
  const showSyllabusHandler = async (id: number) => {
    const syllabuss = syllabusLink.syllabusData.find((syll: any) => syll.id === id);
    setSyllabusForAPI(syllabuss);
    await dispatch(getSingleSyllabus(syllabuss?.subjects.id, syllabuss?.standard.id, syllabuss?.qbank_subject_id));
    setShowSyllabus(true);
  };

  useEffect(() => {
    setSingleSyllabus(syllabus);
  }, [syllabus]);

  // const linkSyllabusHandler = (id: number) => {
  //   setShowPassword(true);
  // };

  const passwordConfirmHandler = async (pass: string) => {
    setShowPassword(false);
    try {
      if (profile.user.publish_password == md5(pass)) {
        setShowChaptersModal(true);
      } else {
        toast.error(TosterMessages.ADMIN_PASSWORD_ERROR);
        setShowPassword(false);
      }
    } catch (error) {
      toast.error(TosterMessages.ADMIN_SUB_DELETE_FAIL);
      setShowPassword(false);
    }
  };

  const handleSyllabusClick = (syllabus: SyllabusProps) => {
    seSelectedSyllabus(syllabus);
    setShowPassword(true);
  };

  useEffect(() => {
    if (!syllabusLink.filtered) {
      setSelectedStandard({ id: 0, name: 'Select Standard' });
      setStandardData([{ id: 0, name: 'Select Standard' }]);
      setSelectedStream({ id: 0, name: 'Select Stream' });
    }
  }, [syllabusLink]);

  return (
    <>
      <MainCard
        title="Syllabus Linking"
        dataTestId="Syllabus Linking"
        actions={
          <SelectDropdown
            data={[{ id: 0, name: 'Select Stream' }, ...streams]}
            value={selectedStream}
            onChange={streamChangeHandler}
            placeholder="Select Stream"
            name={'stream'}
            size="default"
             width="w-full"
          />
        }
        button={
          <SelectDropdown
            data={standardData}
            value={selectedStandard}
            onChange={standardChangeHandler}
            placeholder="Select Standard"
            name={'standard'}
            size="default"
   width='w-full'
          />
        }
      >
        <SyllabusTable
          onShow={showSyllabusHandler}
          data={syllabusLink.syllabusData}
          columns={columns}
          draggable={dragger}
          onLink={handleSyllabusClick}
        />
      </MainCard>

      {/* chapters linking modal */}
      {showChaptersModal && (
        <ChaptersTopicsModal
          isOpen={showChaptersModal}
          onClose={() => setShowChaptersModal(false)}
          selectedSyllabus={selectedSyllabus}
        />
      )}

      {/* Password modal */}
      {showPassword && (
        <PaswordConfirmationModal open={showPassword} onClose={() => setShowPassword(false)} onConfirm={passwordConfirmHandler} />
      )}

      {/* syllabus modal */}
      {showSyllabus && (
        <SyllabusAccordion
          syllabusForAPI={syllabusForAPI}
          open={showSyllabus}
          onClose={() => setShowSyllabus(false)}
          syllabusData={singleSyllabus}
          title="CHAPTER AND TOPIC"
        />
      )}
    </>
  );
}
