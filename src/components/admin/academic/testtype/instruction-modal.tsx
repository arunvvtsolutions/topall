import { LucideLoader } from '@/components/common/LucideLoader';
import { MainDialog } from '@/components/common/MainDialog';
import LexicalEditor from '@/components/lexical-editor';
import { Button } from '@/components/ui/button';
import { HttpStatus } from '@/types/constants';
import { FormType, TosterMessages } from '@/types/enum';
import { updateTesttypeInstruction } from '@/utils/api/academic';
import React from 'react';
import { toast } from 'sonner';

const InstructionModal = ({ data, isOpen, onClose }: { data: any; isOpen: boolean; onClose: () => void }) => {
  const [instructions, setInstructions] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (data) {
      setInstructions(data?.instructions);
    }
  }, [data]);

  const handleAddInstruction = async () => {
    if (!instructions.trim()) {
      toast.error('Instructions cannot be empty');
      return;
    }
    setLoading(true);
    try {
      const response = await updateTesttypeInstruction(data.id, { instructions });
      if (response.statusCode === HttpStatus.OK) {
        onClose();
        toast.success(TosterMessages.INSTRUCTION_UPDATE_SUCCESS);
      } else {
        throw new Error(response.message || 'Failed to update instructions');
      }
    } catch (error) {
      console.error('Error updating instructions:', error);
      toast.error(TosterMessages.SOMETHING_WENT_WRONG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainDialog isOpen={isOpen} onOpenChange={onClose} size="md" title="Instructions">
      <div className="flex h-full flex-col items-center justify-center">
        <LexicalEditor id="online-instruction" data={instructions} onChange={setInstructions} />
        <div className="mt-4 flex w-full justify-end">
          <Button
            type="submit"
            size="md"
            variant="default"
            color="primary"
            className="gap-1 !px-10"
            data-testid="instruction-submit-button"
            onClick={handleAddInstruction}
            disabled={loading}
          >
            {loading && <LucideLoader />}
            {data?.instructions ? FormType.UPDATE : FormType.ADD}
          </Button>
        </div>
      </div>
    </MainDialog>
  );
};

export default InstructionModal;
