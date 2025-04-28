import toast from 'react-hot-toast';

const defaultToastOptions = {
  duration: 4000,
  position: 'top-right' as const
};

// Success message toaster
export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: defaultToastOptions.position,
    duration: defaultToastOptions.duration
  });
};

// Error message toaster
export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: defaultToastOptions.position,
    duration: defaultToastOptions.duration
  });
};
