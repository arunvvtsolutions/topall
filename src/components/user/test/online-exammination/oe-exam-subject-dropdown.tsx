'use client';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { memo, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { GenericType } from '@/types';
import { useDispatch, useSelector } from '@/store';
import { setSelectedSubjects } from '@/store/slice/onlineExamSlice';

interface OESubjectAccordionProps {
  options: GenericType[];
  className?: string;
  examination?: boolean;
  optionClass?: string;
  handleClearOption: () => void;
}

const OESubjectDropdown: React.FC<OESubjectAccordionProps> = ({
  options,
  className,
  examination,
  optionClass,
  handleClearOption
}) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const selectedSubject = useSelector((state) => state.onlineExamination.selectedSubject);
  const currentSection = useSelector((state) => state.onlineExamination.currentSection);
  const sectionData = useSelector((state) => state.onlineExamination.sectionsData);

  useEffect(() => {
    if (currentSection) {
      const selected = sectionData.find((option: any) => option.sectionId === Number(currentSection));
      if (!selected) return;
      dispatch(setSelectedSubjects({ id: selected.subjectId, name: selected.subjectName }));
    }
  }, [currentSection, sectionData]);

  const handleChangeSubject = useCallback((id: string) => {
    const selected = options.find((option: any) => option.id === Number(id));
    if (!selected) return;
    dispatch(setSelectedSubjects(selected));
    handleClearOption();
  }, []);

  return (
    <Select onOpenChange={setOpen} onValueChange={handleChangeSubject} defaultValue={String(selectedSubject?.id)}>
      <SelectTrigger open={open} examination={examination} className={clsx(className)}>
        <SelectValue className="text-white">{selectedSubject?.name}</SelectValue>
      </SelectTrigger>

      <SelectContent className="rounded-md border border-gray-200">
        <SelectGroup className="select-drop-down-custom max-h-48 overflow-auto">
          {options.map((option) => (
            <SelectItem
              disabledTick
              key={option.id}
              value={String(option.id)}
              className={clsx('text-base text-[#000080] hover:bg-gray-50 focus:bg-gray-50 focus:text-[#000080]', optionClass)}
            >
              {option.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default memo(OESubjectDropdown);
