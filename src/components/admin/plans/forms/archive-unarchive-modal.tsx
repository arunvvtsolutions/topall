import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ArchiveUnarchiveModal = ({
  open,
  message,
  onClose,
  onConfirm
}: {
  open: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) => {
  const [isSubmited, setIsSubmited] = useState<boolean>(false);

  // Confirm handler
  const handleConfirm = async () => {
    setIsSubmited(true);
    await onConfirm();
    setIsSubmited(false);
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="rounded-lg">
        <AlertDialogHeader className="mb-4">
          <AlertDialogTitle className="mb-2">{''}</AlertDialogTitle>
          <AlertDialogDescription className="text-md text-B2Cgray">{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            size="md"
            variant="default"
            color="secondary"
            data-testid="cancel-delete-button"
            onClick={onClose}
            disabled={isSubmited}
          >
            Cancel
          </Button>
          <Button
            size="md"
            variant="default"
            color="primary"
            data-testid="delete-confirm-button"
            onClick={handleConfirm}
            disabled={isSubmited}
          >
            {isSubmited && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ArchiveUnarchiveModal;
