import React, { useEffect, useState } from 'react';
import ChapterIcon from '../concept-test/chapter-icon';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import StarRating from './star-rating';
import SelectDropdown from '@/components/common/Select';
import { GenericType } from '@/types';
import { ButtonNames } from '@/types/enum';
import { ChapterWIseTests } from '@/types/user';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LucideLoader } from '@/components/common/LucideLoader';

interface ChapterWiseCardProps {
  chapter: ChapterWIseTests;
  levels: GenericType[];
  onChange: (chapterId: number, levelId: number) => Promise<void>;
  isPractice: boolean;
}

const ChapterWiseCard: React.FC<ChapterWiseCardProps> = ({ chapter, levels, onChange, isPractice }) => {
  const [selectedLevel, setSelectedLevel] = useState<GenericType | null>(levels[0]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (chapter.level && levels.length > 0) {
      const selectedLevel = levels.find((level) => level.id === chapter.updatedLevel);
      setSelectedLevel(selectedLevel || levels[0]);
    }
  }, [chapter, levels]);

  const handleStart = async (chapterId: number, levelId: number) => {
    onChange(chapterId, levelId);
  };

  const handleValueChange = (optionId: string) => {
    const selectedOption = levels.find((option) => option.id === Number(optionId));
    setSelectedLevel(selectedOption || null);
  };

  return (
    <div className="!border-[rgba(16, 16, 16, 0.15)] mx-auto w-full max-w-[500px] rounded-[16px] !border-[0.5px] bg-white p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0000800A] md:h-10 md:w-10">
          <ChapterIcon />
        </div>
        <span className="text-[14px] font-medium text-[#222222] md:text-[16px]">{chapter.chapterName}</span>
      </div>
      <div className="mb-6 ml-12 mt-3.5">
        <StarRating level={chapter.level} />
      </div>
      <div className="mt-[16px] flex flex-wrap justify-end gap-[8px]">
        {selectedLevel && (
          <div>
            <Select
              value={selectedLevel.id.toString()}
              onValueChange={handleValueChange}
              onOpenChange={() => setOpen(!open)}
              data-test-id={`${name}`}
              // disabled={disabled}
              aria-label={`${name}-dropdown`}
            >
              <SelectTrigger
                open={open}
                className={`h-9 overflow-hidden border border-primary text-primary [&>span]:truncate`}
                size={'md'}
                primaryIcon
              >
                <span className="flex w-full items-center space-x-2">
                  <span className={`truncate font-medium text-primary`}>
                    <SelectValue placeholder={selectedLevel.name} />
                  </span>
                </span>
              </SelectTrigger>

              <SelectContent className={`w-[200px] max-w-none`}>
                <SelectGroup className="select-drop-down-custom max-h-48 overflow-auto">
                  {levels.length > 0 ? (
                    levels.map((option) => (
                      <SelectItem
                        key={option.id}
                        value={option.id.toString()}
                        className={`flex cursor-pointer items-center whitespace-nowrap py-2 focus:bg-primary/5 focus:text-primary`}
                      >
                        <span className="flex w-full items-center justify-between gap-4">
                          <span className={`flex-1 truncate`}>{option.name}</span>
                          {option.icon && <Icon icon={option.icon} className="text-lg text-primary" />}
                        </span>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectLabel>{'No Levels '}</SelectLabel>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        <Button
          onClick={() => handleStart(chapter.chapterId, selectedLevel?.id || 0)}
          color="success"
          className="flex h-9 items-center justify-between gap-2 rounded-lg font-medium"
          disabled={isPractice}
        >
          {isPractice ? 'Starting..' : ButtonNames.PRACTICE}

          <Icon icon="oui:arrow-right" className="font-normal text-white" />
        </Button>
      </div>
    </div>
  );
};

export default ChapterWiseCard;
