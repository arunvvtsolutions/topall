import React, { useEffect, useState } from 'react';
import { MainDialog } from '@/components/common/MainDialog';
import SelectDropdown from '@/components/common/Select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GenericType } from '@/types';
import { ButtonNames, DialogTitle, FormType } from '@/types/enum';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface CreateFolderProps {
  open: boolean;
  onClose: () => void;
  label: string;
  data?: any;
  iconName: string;
  type: FormType | null;
  initialData?: any;
}

const CreateFolder: React.FC<CreateFolderProps> = ({ open, onClose, label, data, iconName, type, initialData }) => {
  const [selectedStream, setSelectedStream] = useState<GenericType | null>(null);
  const [folderName, setFolderName] = useState<string>('');
  console.log('folderName', folderName);

  const value = type === FormType.ADD ? DialogTitle.CREATE_FOLDER : DialogTitle.UPDATE_FOLDER;
  const title = type === FormType.ADD ? ButtonNames.CREATE_FOLDER : ButtonNames.UPDATE_FOLDER;
  const toastMsgSuccess = type === FormType.ADD ? 'Folder created successfully' : 'Folder updated successfully';

  const handleCreateFolder = () => {
    if (data && selectedStream === null) {
      toast.info('Please select a stream');
      return;
    }
    if (!data && folderName === '') {
      toast.info('Please enter a folder name');
      return;
    }
    toast.success(toastMsgSuccess);
    onClose();
  };

  const handleStreamChange = (stream: GenericType) => {
    setSelectedStream(stream);
  };

  useEffect(() => {
    if (initialData) {
      if (data) {
        setSelectedStream(initialData);
      }
      if (!data) {
        setFolderName(initialData);
      }
    }
  }, []);

  return (
    <MainDialog isOpen={open} title={title} iconName={iconName} icon={true} onOpenChange={onClose}>
      <div>
        <Label className="mb-3 block text-sm font-semibold text-[#4B4B4B]">{label}</Label>
        {data ? (
          <SelectDropdown
            width="w-full"
            size="md"
            data={data}
            name="stream"
            onChange={handleStreamChange}
            placeholder="Select Stream"
            value={selectedStream}
            placeholderColor="text-[#4B4B4B]"
            placeholderSize="text-xs"
            primaryIcon={false}
          />
        ) : (
          <Input
            placeholder="Enter Folder Name"
            className="text-xs font-normal text-primary placeholder:text-xs placeholder:font-normal placeholder:text-[#4B4B4B]"
            onChange={(e) => setFolderName(e.target.value)}
          />
        )}
      </div>
      <div className="flex flex-col">
        <div className="!mt-5 flex justify-end">
          <Button
            onClick={handleCreateFolder}
            type="submit"
            variant="default"
            color="primary"
            size="md"
            className="rounded-lg text-sm font-normal"
          >
            {type === FormType.ADD && <Plus className="mr-2 h-4 w-4" />}
            {value}
          </Button>
        </div>
      </div>
    </MainDialog>
  );
};

export default CreateFolder;
