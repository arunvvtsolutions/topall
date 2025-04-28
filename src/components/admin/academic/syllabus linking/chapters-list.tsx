import React, { memo } from 'react';
import { SyllabusChapters } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { LucideLoader } from '@/components/common/LucideLoader';

interface ChapterListProps {
  chapters: SyllabusChapters[];
  isChapterSelected: (chapterId: number) => boolean;
  toggleChapter: (chapterId: number, checked: boolean) => void;
  toggleTopic: (chapterId: number, topicId: number) => void;
  clearChapter: (chapterId: number) => void;
  isLoading: boolean;
}

const ChapterList = ({ isLoading, chapters, isChapterSelected, toggleChapter, toggleTopic, clearChapter }: ChapterListProps) => {
  return (
    <ScrollArea className="h-[500px] px-2.5">
      {isLoading ? (
        <div className="flex justify-center">
          <LucideLoader />
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {chapters.map((chapter) => {
            const allTopicsSelected = chapter.topics.every((topic) => topic.checked);
            const blockedChapter = chapter.topics.every((topic) => topic.blocked);
            const someTopicsSelected = chapter.topics.some((topic) => topic.checked);
            return (
              <AccordionItem key={chapter.chapterId} value={`item-${chapter.chapterId.toString()}`}>
                <AccordionTrigger>
                  <div
                    className={`flex w-full items-center justify-between ${blockedChapter ? 'pointer-events-none cursor-not-allowed opacity-50' : 'pointer-events-auto opacity-100'}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`chapter-${chapter.chapterId}`}
                        checked={isChapterSelected(chapter.chapterId)}
                        onCheckedChange={(checked) => toggleChapter(chapter.chapterId, !!checked)}
                        color="primary"
                      />
                      <label htmlFor={`chapter-label-${chapter.chapterId}`} className="text-sm text-secondary-foreground">
                        {chapter.chapterName}
                      </label>
                    </div>

                    {someTopicsSelected && (
                      <div className="hidden items-center space-x-2 md:flex">
                        <span className="text-sm text-primary">
                          {allTopicsSelected ? 'Fully Selected' : 'Partially Selected'}
                        </span>
                        <Button
                          color="secondary"
                          className="gap-1 bg-transparent"
                          data-testid="chapter-clear-button"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearChapter(chapter.chapterId);
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent style={{ background: '#FBFBFD', borderRadius: 'inherit' }}>
                  <div className="space-y-2">
                    {chapter.topics.map((topic) => (
                      <div
                        key={topic.topicId}
                        className={`flex items-center space-x-2 ${topic.blocked ? 'pointer-events-none cursor-not-allowed opacity-50' : 'pointer-events-auto opacity-100'}`}
                      >
                        <Checkbox
                          id={`topic-${topic.topicId}`}
                          checked={topic.checked}
                          disabled={topic.blocked}
                          onCheckedChange={() => toggleTopic(chapter.chapterId, topic.topicId)}
                          color="primary"
                        />
                        <label htmlFor={`topic-label-${topic.topicId}`} className="text-sm text-secondary-foreground">
                          {topic.topic}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </ScrollArea>
  );
};

export default memo(ChapterList);
