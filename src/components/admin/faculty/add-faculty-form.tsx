'use client';
import { MainDialog } from '@/components/common/MainDialog';
import SelectDropdown from '@/components/common/Select';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { FacultyFormValues, facultySchema } from '@/schemas/admin/faculty/facultySchema';
import { DialogTitle, FacultyTitle, FormType, TosterMessages } from '@/types/enum';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CountryCodeDropdown from '../../partials/auth/courtry-dropdown';
import FileUpload from './file-upload';
import { getStreamById, imageUpload } from '@/utils/api/academic';
import { toast } from 'sonner';
import { createFaculty, getAllFaculty, updateFaculty } from '@/utils/api/faculty';
import { HttpStatus } from '@/types/constants';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@/store';
import { getStreams } from '@/store/slice/admin/academic';
import { MultiSelect } from '@/components/common/MultiSelect';

interface AddFacultyFormProps {
  isOpen: boolean;
  onClose: () => void;
  type?: string;
  initialData?: any;
  refreshFaculty: () => Promise<void>;
}

const AddFacultyForm: React.FC<AddFacultyFormProps> = ({
  isOpen,
  onClose,
  type = FormType.EDIT,
  initialData,
  refreshFaculty
}) => {
  const dispatch = useDispatch();
  const { streams } = useSelector((state) => state.selectors);
  const [selectedStreamIds, setSelectedStreamIds] = useState<number[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<{ id: number; name: string } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileDeleted, setFileDeleted] = useState(false);

  const defaultValues: any = initialData
    ? {
        facultyName: initialData.name,
        mobileNumber: initialData.mobile,
        stream: initialData.streams.map((stream: { id: number }) => stream.id),
        subjectAuthorised: initialData.subject.id,
        expertFaculty: initialData.isExpert,
        profilePicture: initialData.imageFile,
        countryCode: '91'
        // countryFlag: 'IN',
      }
    : {
        facultyName: '',
        mobileNumber: '',
        stream: [],
        subjectAuthorised: {},
        expertFaculty: false,
        profilePicture: '',
        countryCode: '91'
        // countryFlag: 'IN',
      };
  const form = useForm<FacultyFormValues>({
    resolver: zodResolver(facultySchema),
    defaultValues
  });

  useEffect(() => {
    dispatch(getStreams());
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedStreamIds.length) {
        setSubjects([]);
        return;
      }

      try {
        const subjectResponses = await Promise.all(
          selectedStreamIds.map(async (id) => {
            const subjectData = await getStreamById(id);
            return subjectData?.stream_subjects || [];
          })
        );

        const allSubjects = subjectResponses.flat();

        // Remove duplicates
        const uniqueSubjects = Array.from(new Set(allSubjects.map((sub) => JSON.stringify(sub)))).map((sub) => JSON.parse(sub));

        setSubjects(uniqueSubjects);

        if (initialData?.subject) {
          setSelectedSubject(initialData.subject);
          form.setValue('subjectAuthorised', initialData.subject.id.toString());
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, [selectedStreamIds]);

  useEffect(() => {
    if (initialData?.imageFile) {
      setFile(null);
      form.setValue('profilePicture', initialData.imageFile);
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData?.streams) {
      const streamIds = initialData.streams.map((stream: any) => stream.id);
      setSelectedStreamIds(streamIds);
    }
  }, [initialData]);

  const onSubmit = async (data: FacultyFormValues) => {
    setLoading(true);
    try {
      let imagePath = initialData?.imageFile || '';

      if (file) {
        //  Upload if new file selected
        const formData = new FormData();
        formData.append('file', file);
        const response = await imageUpload(formData);
        if (response?.data?.path) {
          imagePath = response.data.path;
        } else {
          toast.error(TosterMessages.ADMIN_IMG_UPLAOD_FAIL);
          return;
        }
      } else if (fileDeleted) {
        imagePath = '';
      }
      const phoneNumber = `${data.countryCode}${data.mobileNumber}`; 
      // Construct payload
      const payload = {
        name: data.facultyName,
        mobile: phoneNumber,
        authorizedStreams: Array.isArray(data.stream) ? data.stream : [],
        subjectId: data.subjectAuthorised || '',
        isExpert: data.expertFaculty,
        imageFile: imagePath || ''
      };

      if (initialData) {
        // Update API call
        const updateRes = await updateFaculty(initialData.id, payload);
        if (updateRes?.statusCode === HttpStatus.CONFLICT) {
          toast.error(updateRes?.message || 'Failed to update faculty');
          return;
        }
        toast.success(TosterMessages.ADMIN_FACULTY_UPDATE_SUCCESS);
      } else {
        // Create API call
        const addRes = await createFaculty(payload);
        if (addRes?.statusCode === HttpStatus.CONFLICT) {
          toast.error(addRes?.message || 'Failed to add faculty');
          return;
        }
        toast.success(TosterMessages.ADMIN_FACULTY_ADD_SUCCESS);
      }
      await refreshFaculty();
      form.reset();
      onClose();
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(TosterMessages.ADMIN_SUB_UPDATE_FAIL);
    } finally {
      setLoading(false);
    }
  };

  const streamOptions = streams.map(({ id, name }) => ({ id, name }));
  const subjectOptions = subjects.map(({ subject_id, subjectName }) => ({
    id: subject_id,
    name: subjectName
  }));

  return (
    <MainDialog
      title={initialData ? 'Edit Faculty' : FacultyTitle.ADD_FACULTY}
      isOpen={isOpen}
      onOpenChange={onClose}
      size="default"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Profile Picture Upload */}
          <FormField
            control={form.control}
            name="profilePicture"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-2 text-sm font-semibold text-B2CAgray">Profile Image</FormLabel>
                <FormControl>
                  <FileUpload
                    onFileSelect={(selectedFile) => {
                      setFile(selectedFile);
                      field.onChange(selectedFile);
                    }}
                    initialImage={initialData ? initialData.imageFile : ''}
                    onDelete={() => {
                      setFileDeleted(true);
                      setFile(null);
                      field.onChange(null);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Faculty Name */}
          <div className="mt-4">
            <FormField
              control={form.control}
              name="facultyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2 text-sm font-semibold text-B2CAgray">
                    {FacultyTitle.FACULTY_NAME}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter Faculty Name"
                      className="h-10 rounded-[4px] border border-borderad text-sm text-[#4B4B4B]"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mb-4 mt-4 flex flex-col items-center justify-between gap-2 md:flex-row">
            <div className="w-full">
              {/* Mobile Number */}
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 text-sm font-semibold text-B2CAgray">
                      {FacultyTitle.MOBILE_NUMBER}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex h-10 items-center rounded-[4px] border border-borderad">
                        {/* Country Code Dropdown */}
                        <CountryCodeDropdown watch={form.watch} setValue={form.setValue} />
                        {/* Separator */}
                        <Separator orientation="vertical" className="h-6 bg-borderad" />
                        {/* Input Field */}
                        <Input
                          type="text"
                          placeholder="Enter Mobile Number"
                          className="h-full flex-1 rounded-md border-none px-3 text-xs font-normal text-B2Cgray"
                          autoComplete="off"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            field.onChange(value);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              {/* Stream Dropdown */}
              <FormField
                control={form.control}
                name="stream"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 text-sm font-semibold text-B2CAgray">{DialogTitle.STREAM}</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={streamOptions}
                        onValueChange={(selected) => {
                          field.onChange(selected);
                          setSelectedStreamIds(selected);
                        }}
                        // defaultValue={selectedStreamIds}
                        defaultValue={field.value || []}
                        placeholder="Select Stream"
                        variant="default"
                        color="secondary"
                        maxCount={3}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="mb-4 w-full">
            {/* Subject Authorised Dropdown */}
            <FormField
              control={form.control}
              name="subjectAuthorised"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2 text-sm font-semibold text-B2CAgray">{FacultyTitle.SUBJECT_AUTHORISED}</FormLabel>
                  <FormControl>
                    <SelectDropdown
                      name="subjectAuthorised"
                      data={subjectOptions}
                      value={subjectOptions.find((option) => option.id.toString() === field.value) || null}
                      onChange={(selected) => {
                        if (selected?.id) {
                          field.onChange(selected.id.toString());
                        } else {
                          field.onChange('');
                        }
                      }}
                      placeholder="Select Subject"
                      size="default"
                      width="full"
                      height="h-10"
                      borderRadius="!rounded-[4px]"
                      placeholderColor="text-B2CAgray"
                      text="text-B2CAgray"
                      borderColor="border-borderad"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="expertFaculty"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-Active" />
                </FormControl>
                <FormLabel className="!m-0 text-sm font-medium text-B2CAgray">{FacultyTitle.EXPERT_FACULTY}</FormLabel>
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              // disabled={loading}
              size="default"
              variant="default"
              color="primary"
              data-testid="testtype-submit-btn"
              className="h-auto py-2"
            >
              {/* {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} */}
              {type === FormType.EDIT ? FormType.UPDATE : FormType.ADD}
              {/* {FormType.ADD} */}
            </Button>
          </div>
        </form>
      </Form>
    </MainDialog>
  );
};

export default AddFacultyForm;
