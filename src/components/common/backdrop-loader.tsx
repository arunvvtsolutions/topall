import { Loader2 } from 'lucide-react';

interface BackdropLoaderProps {
  isLoading: boolean;
}

export function BackdropLoader({ isLoading }: BackdropLoaderProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <Loader2 className="h-8 w-8 animate-spin text-default" />
    </div>
  );
}
