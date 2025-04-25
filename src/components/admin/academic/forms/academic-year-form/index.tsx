import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AcademicFormValues, AcademicYearSchema } from '@/schemas/admin/academic/academic-year-schema';
import { FormFields, FormType, TosterMessages } from '@/types/enum';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { MainDialog } from '@/components/common/MainDialog';
import SelectDropdown from '@/components/common/Select';
import DateRangePicker from '@/components/date-range-picker';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from '@/store';
import { getYearList } from '@/store/slice/admin/academic';
import { AcademicYearList, GenericType } from '@/types';
import { createYearList, updateYearListById } from '@/utils/api/academic';
import { format, parse } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface StandardModalProps {
  title: string;
  open: boolean;
  type: any;
  initialData?: AcademicYearList | null;
  onClose: () => void;
  stream?: GenericType[];
  standard?: GenericType[];
  clearDropdown?: () => void;
}

const AcademicYearFormModal: React.FC<StandardModalProps> = ({
  title,
  open,
  type = FormType.EDIT,
  initialData,
  onClose,
  stream,
  standard,
  clearDropdown
}) => {
  const dispatch = useDispatch();
  const { yearList } = useSelector((state) => state.academic);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedStream, setSelectedStream] = useState<GenericType>();
  const [selectedStandard, setSelectedStandard] = useState<GenericType>();

  const action = initialData ? FormType.UPDATE : FormType.ADD;

  // Utility function to safely parse the date from API response
  const parseDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      return parse(dateStr.trim(), 'do MMMM', new Date());
    } catch {
      return null;
    }
  };
  const defaultValues: any = initialData
    ? {
        ...initialData,
        stream: initialData.streams?.id || null,
        standard: initialData.standards?.id || null,
        startDate: parseDate(initialData.startDate),
        endDate: parseDate(initialData.endDate)
      }
    : {
        stream: null,
        standard: null,
        startDate: null,
        endDate: null
      };

  // useForm
  const form = useForm<AcademicFormValues>({
    resolver: zodResolver(AcademicYearSchema),
    defaultValues
  });

  // Handle Form Submit
  const onSubmit = async (data: any) => {
  
    const safeData = {
      ...data,
      startDate: data.startDate || null,
      endDate: data.endDate || null
    };
  
    try {
      setLoading(true);
      await dispatch(getYearList());
  
      const formattedStartDate = safeData.startDate
        ? format(new Date(safeData.startDate), 'do MMMM')
        : null;
  
      const formattedEndDate = safeData.endDate
        ? format(new Date(safeData.endDate), 'do MMMM')
        : null;
  
      // Normalize user input for comparison
      const formattedData = {
        streamId: data.stream,
        standardId: data.standard || null,
        startDate: formattedStartDate,
        endDate: formattedEndDate
      };

      // Check for duplicates ONLY during creation
      if (!initialData?.id) {
        const isDuplicate = yearList.some((record) => {
          return (
            record.streams.id === formattedData.streamId &&
            (record.standards?.id || null) === formattedData.standardId &&
            record.startDate === formattedData.startDate &&
            record.endDate === formattedData.endDate
          );
        });
        if (isDuplicate) {
          console.error('Duplicate entry detected.');
          toast.error('This academic year entry already exists. Please modify your selection.');
          return;
        }
      }

      // Prepare API payload
      const payload = {
        streamId: data.stream,
        standard: data.standard || null,
        startDate: formattedStartDate,
        endDate: formattedEndDate
      };

      if (initialData?.id) {
        // **Update existing record**
        await updateYearListById(initialData.id, payload);
        toast.success('Academic Year Updated Successfully!');
      } else {
          await createYearList(payload);
          const response = await createYearList(payload);
          if (response?.statusCode === 409 ) {
            toast.error(response?.message);
            return;
          }
          toast.success('Academic Year Created Successfully!');
      }

      dispatch(getYearList()); 
    } catch (error: any) {
      toast.error(TosterMessages.ADMIN_COMMON_ERROR);
    } finally {
      setLoading(false);
      onClose();
      clearDropdown && clearDropdown();
    }
  };

  const handleSelectStream = (item: GenericType) => {
    form.setValue('stream', item.id);
    setSelectedStream(item);
  };

  const handleSelectStandard = (item: GenericType) => {
    form.setValue('standard', item.id);
    setSelectedStandard(item);
  };

  useEffect(() => {
    if (initialData) {
      const viewStream = stream?.find((s) => s.id === initialData.streams?.id) || undefined;
      const viewStandard = standard?.find((s) => s.id === initialData.standards?.id) || undefined;

      setSelectedStream(viewStream);
      setSelectedStandard(viewStandard);
    }
  }, [initialData, stream, standard]);

  return (
    <MainDialog title={title} isOpen={open} onOpenChange={onClose} size="default">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="stream"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <FormLabel className="text-sm font-semibold !text-[#4B4B4B]">{FormFields.STREAM}</FormLabel>
                  <FormControl>
                    <SelectDropdown
                      name="stream"
                      onChange={(item) => {
                        handleSelectStream(item);
                        if (item.name === 'CBSE') {
                          setSelectedStandard(undefined);
                        }
                      }}
                      value={selectedStream}
                      data={stream || []}
                      placeholder="Select Stream"
                      width="w-full"
                      text="text-[#4B4B4B]"
                      size="md"
                      disabled={loading || type === FormType.VIEW || type === FormType.EDIT}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="standard"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <FormLabel className="text-sm font-semibold !text-[#4B4B4B]">{FormFields.STANDARD}</FormLabel>
                  <FormControl>
                    <SelectDropdown
                      name="standard"
                      onChange={handleSelectStandard}
                      value={selectedStandard}
                      data={standard || []}
                      placeholder="Select Standard"
                      width="w-full"
                      text="text-[#4B4B4B]"
                      size="md"
                      disabled={!selectedStream || selectedStream.name !== 'CBSE' || loading || type === FormType.VIEW}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <FormLabel className="text-sm font-semibold !text-[#4B4B4B]">{FormFields.START_DATE}</FormLabel>
                  <FormControl>
                    <DateRangePicker
                      dateFormat="LLL, y"
                      placeHolder="Select Start Date"
                      disabled={type === FormType.VIEW}
                      date={form.watch('startDate') ?? null} // Ensure explicit null
                      setDate={(date) => form.setValue('startDate', date ?? null)}
                      dateMode="single"
                      iconPosition="right"
                      className=""
                      buttonClassName="border p-0 rounded-[8px] h-[40px] flex justify-between items-center w-full !px-[.75rem]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <FormLabel className="text-sm font-semibold !text-[#4B4B4B]">{FormFields.END_DATE}</FormLabel>
                  <FormControl>
                    <DateRangePicker
                      dateFormat="LLL, y"
                      placeHolder="Select End Date"
                      disabled={type === FormType.VIEW}
                      date={form.watch('endDate') || null}
                      setDate={(date) => {
                        form.setValue('endDate', date || null);
                      }}
                      dateMode="single"
                      iconPosition="right"
                      className=""
                      buttonClassName="border p-0 rounded-[8px] h-[40px] flex justify-between items-center w-full !px-[.75rem]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {type !== FormType.VIEW && (
            <div className="mt-3 flex justify-end">
              <Button
                disabled={!!fileError || loading}
                type="submit"
                size="default"
                variant="default"
                color="primary"
                data-testid="subject-btn"
                className="h-auto py-2"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {action}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </MainDialog>
  );
};

export default AcademicYearFormModal;
