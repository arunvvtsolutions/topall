import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { showSuccessToast } from '@/app/utils/toast-utils';
// import Button from './common/Button';
// import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { DialogTitle } from '@/types/enum';
import { Button } from '@/components/ui/button';

const InactiveConfirmationDialog = ({
  open,
  message,
  onClose,
  onConfirm,
  isActive
}: {
  open: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isActive: string;
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
          <AlertDialogTitle className="mb-2">{isActive ==='inactive' ? 'Active':'Inactive'}</AlertDialogTitle>
          <AlertDialogDescription className="text-md text-B2Cgray">{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* <Button
            onClick={onClose}
            className="h-auto rounded-lg border border-border px-6 py-2 text-B2Cgray hover:text-B2Cgray"
            ariaLabel="delete cancel button"
            dataTestId="delete-cancel-button"
            text={`Cancel`}
            disabled={isSubmited}
            /> */}
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
            {isActive ==='inactive' ? 'Active':'Inactive'}
          </Button>
          {/* <Button
            onClick={handleConfirm}
            className={`${isSubmited ? 'pointer-events-none' : ''} h-auto rounded-lg bg-destructive px-6 py-2 text-sm text-white hover:bg-destructive`}
            ariaLabel="delete confirm button"
            dataTestId="delete-confirm-button"
            text={DialogTitle.DELETE}
            startIcon={isSubmited && <Loader2 className="h-4 w-4 animate-spin" />}
          /> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default InactiveConfirmationDialog;
