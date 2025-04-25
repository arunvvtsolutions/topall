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
import { Button } from '../ui/button';
import { DialogTitle } from '@/types/enum';

// Define the type for the props
interface PublishConfirmationDialogProps {
  open: boolean;
  isPublishing?: boolean; 
  onClose?: () => void;
  onPublish: () => void; 
  onUnpublish: () => void; 
}

const PublishConfirmationDialog: React.FC<PublishConfirmationDialogProps> = ({
  open,
  isPublishing,
  onClose,
  onPublish,
  onUnpublish
}) => {
  const [isSubmited, setIsSubmited] = useState<boolean>(false);

  // Confirm handler
  const handleConfirm = async () => {
    setIsSubmited(true);

    
    if (isPublishing) {
      await onPublish(); 
    } else {
      await onUnpublish(); 
    }

    setIsSubmited(false); 
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="rounded-lg">
        <AlertDialogHeader className="mb-4">
          <AlertDialogTitle className="mb-2 text-lg font-medium text-B2CAgrayn">
            {isPublishing ? 'Publish Test' : 'Unpublish Test'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm font-normal text-B2Cgray">
            Are you sure you want to {isPublishing ? 'Publish' : 'unpublish'} this Test?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            size="md"
            variant="default"
            color="secondary"
            data-testid="cancel-action-button"
            onClick={onClose}
            className="text-sm font-normal text-B2Cgray"
            disabled={isSubmited}
          >
            Cancel
          </Button>
          <Button
            size="md"
            variant="default"
            color={isPublishing ? 'primary' : 'destructive'}
            className="text-sm font-normal"
            data-testid="confirm-action-button"
            onClick={handleConfirm}
            disabled={isSubmited}
          >
            {isSubmited && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
            {isPublishing ? 'Publish' : 'Unpublish'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PublishConfirmationDialog;
