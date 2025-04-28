import { useSortable } from '@dnd-kit/sortable';
import { CSSProperties } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@/components/ui/icon';

interface TopicProps {
  topicId: number;
  topic: string;
}

const TopicAccordion: React.FC<TopicProps> = ({ topicId, topic }) => {
  const { isDragging, attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: topicId });

  // Style to handle dragging effect
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative'
  };

  return (
    <div key={topicId} className="flex items-center py-2 text-[#4B4B4B] ml-6" ref={setNodeRef} style={style}>
      <div className="flex items-center justify-between">
        {/* Drag Handle */}
        <div {...attributes} {...listeners} className="cursor-grab p-2 text-primary" title="Drag to reorder">
          <Icon icon={'material-symbols:drag-indicator'} className="text-2xl" />
        </div>

        {/* Accordion Trigger */}
        <div className="!text-transform-none ml-2 w-full flex-1 !normal-case">{topic}</div>
      </div>
    </div>
  );
};

export default TopicAccordion;
