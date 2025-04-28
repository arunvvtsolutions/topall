import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Icon } from '@/components/ui/icon';
import { Label } from '../ui/label';
import { z } from 'zod';
import { Button } from '../ui/button';
import { DialogTitle, FormFields, FormType } from '@/types/enum';

const passwordSchema = z.string().min(1, { message: 'Password is required' });

const PaswordConfirmationModal = ({
  open,
  onClose,
  onConfirm
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}) => {
  const [isSubmited, setIsSubmited] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Confirm handler
  const handleConfirm = async () => {
    setIsSubmited(true);
    try {
      passwordSchema.parse(password);
      setError(null);
      // API call to verify the password

      if (true) {
        onConfirm(password);
        setIsSubmited(false);
      }
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || 'An unknown error occurred');
      }
      setIsSubmited(false);
    } finally {
      setPassword('');
    }
  };

  const handleClose = () => {
    setPassword('');
    setShowPassword(false);
    setError(null);
    onClose();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="rounded-lg">
        <AlertDialogHeader className="mb-1">
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="font-medium">{DialogTitle.PASSWORD}</AlertDialogTitle>
            <button disabled={isSubmited} onClick={handleClose}>
              <Icon className="h-[1.7em] w-[1.7em]" icon="heroicons:x-circle" style={{ strokeWidth: 1, color: 'black' }} />
            </button>
          </div>
        </AlertDialogHeader>
        <div className="grid w-full items-center">
          <Label className="text-md mb-3 text-sm font-light" htmlFor="password">
            {FormFields.ENTER_PASS}
          </Label>
          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              className="w-full rounded-md border-[1px] border-border py-2 pl-3 pr-10 text-gray-800 outline-none focus:border-border"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform text-2xl"
            >
              {showPassword ? (
                <Icon icon="heroicons:eye-16-solid" style={{ color: '#4B4B4B' }} />
              ) : (
                <Icon icon="heroicons:eye-slash-16-solid" style={{ color: '#4B4B4B' }} />
              )}
            </button>
          </div>
          {error && <div className="mt-1 text-xs text-destructive">{error}</div>}
        </div>
        <AlertDialogFooter className="py-0">
          <Button
            size="md"
            variant="default"
            color="primary"
            data-testid="password-confirm-button"
            disabled={!password || isSubmited}
            onClick={handleConfirm}
          >
            {FormType.SUBMIT}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PaswordConfirmationModal;
