import { MainDialog } from '@/components/common/MainDialog';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/common/MultiSelect';
import { toast } from 'sonner';
import { ButtonNames, FormFields, FormType, IPackagePlan, TosterMessages } from '@/types/enum';
import { FormValues, packagePlanSchema } from '../schemas';
import { useSelector } from '@/store';
import { GenericType } from '@/types';
import { createPackage, updatePackagePlan } from '@/utils/api/packages';
import { HttpStatus } from '@/types/constants';

interface PackagePlanModalProps {
  onClose: () => void;
  open: boolean;
  type: FormType | null;
  streamId: number;
  initialData?: IPackagePlan | null;
}

const PackagePlanModal: React.FC<PackagePlanModalProps> = ({ onClose, open, type, streamId, initialData }) => {
  const { standards } = useSelector((state) => state.academic);
  const [standardData, setStandardData] = useState<GenericType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const buttonName = type === FormType.EDIT ? ButtonNames.UPDATE : ButtonNames.ADD;
  const title = type === FormType.EDIT ? 'EDIT PACKAGE PLAN' : 'ADD PACKAGE PLAN';

  const defaultValues = initialData
    ? {
        name: initialData.title,
        standardList: initialData.standardList.map((item) => item.id),
        description: initialData.description
      }
    : {
        name: '',
        standardList: [],
        description: ''
      };

  const form = useForm<FormValues>({
    resolver: zodResolver(packagePlanSchema),
    defaultValues
  });

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    setLoading(true);

    if (initialData) {
      try {
        const { name = '', description = '' } = data;
        const response = await updatePackagePlan(initialData.id, { name, description });
        if (response.statusCode === HttpStatus.OK) {
          toast.success(TosterMessages.PLAN_UPDATE_SUCCESS);
        } else {
          toast.error(TosterMessages.PLAN_UPDATE_FAIL);
        }
      } catch (error) {
        console.log('error', error);
        toast.error(TosterMessages.PLAN_UPDATE_FAIL);
      } finally {
        setLoading(false);
        onClose();
        return;
      }
    } else {
      try {
        const response = await createPackage({ ...data, streamId });
        if (response.statusCode === HttpStatus.OK) {
          toast.success(TosterMessages.PLAN_CREATE_SUCCESS);
        } else {
          toast.error(TosterMessages.PLAN_CREATE_FAIL);
        }
      } catch (error) {
        console.log('error', error);
        toast.error(TosterMessages.PLAN_CREATE_FAIL);
      } finally {
        setLoading(false);
        onClose();
        return;
      }
    }
  };

  useEffect(() => {
    const filteredStandards = standards
      .filter((standard: any) => standard.streams.id === streamId)
      .map((standard) => ({ id: standard.id, name: standard.name }));
    console.log('filteredStandards', filteredStandards);
    setStandardData(filteredStandards);
  }, [standards, streamId]);

  return (
    <MainDialog isOpen={open} onOpenChange={onClose} title={title} icon={false}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel className="text-sm font-semibold text-B2CAgray">
                    {FormFields.PLAN_NAME} <span className="text-[#FF4747]">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Plan Name"
                      className="rounded-sm text-sm font-normal text-primary placeholder:text-xs placeholder:text-[#4B4B4B]"
                      size="md"
                      data-test-id="subject-input"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="standardList"
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel className="text-sm font-semibold text-B2CAgray">
                    {FormFields.STD_UP} <span className="text-[#FF4747]">*</span>
                  </FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={standardData}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      placeholder="Select Standard"
                      placeholderClassName="text-xs text-[#4B4B4B]"
                      color="secondary"
                      variant="default"
                      maxCount={1}
                      disabled={!!initialData}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="text-sm font-semibold text-B2CAgray">{FormFields.DESC_UP}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter Description"
                    color="secondary"
                    className="rounded-sm text-sm font-normal text-primary placeholder:text-xs placeholder:text-[#4B4B4B]"
                    data-test-id="subject-description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end">
            <Button
              type="submit"
              variant="default"
              size="default"
              data-testid="plan-add-btn"
              color="primary"
              className="h-auto rounded-lg py-2"
              disabled={loading}
            >
              {buttonName}
            </Button>
          </div>
        </form>
      </Form>
    </MainDialog>
  );
};

export default PackagePlanModal;
