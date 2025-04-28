import { MainDialog } from '@/components/common/MainDialog';
import SelectDropdown from '@/components/common/Select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SubscriptionFormValues, subscriptionSchema } from '@/schemas/admin/subscription/subscription';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Title from './form-title';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { FormType } from '@/types/enum';

const mockData = {
  academicYears: [
    { id: 0, name: '2023-24' },
    { id: 1, name: '2024-25' }
  ],
  stream: [
    { id: 0, name: 'JEE' },
    { id: 1, name: 'NEET' }
  ],
  standard: [
    { id: 0, name: 'Sec A' },
    { id: 1, name: 'Sec B' }
  ],
  packageTypes: [
    { id: 0, name: 'Basic' },
    { id: 1, name: 'Premium' }
  ]
};

const units = [
  { id: 'days', name: 'Days', max: 365 },
  { id: 'months', name: 'Months', max: 12 },
  { id: 'years', name: 'Years', max: 3 }
];
const AddSubscription = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [academicYear, setAcademicYear] = useState<{ id: number; name: string } | null>(null);
  const [stream, setStream] = useState<{ id: number; name: string } | null>(null);
  const [standard, setStandard] = useState<{ id: number; name: string } | null>(null);
  const [packageType, setPackageType] = useState<{ id: number; name: string } | null>(null);
  const [selectedDiscount, setSelectedDiscount] = useState({ id: 1, name: '₹' });
  const [selectedGSTOption, setSelectedGSTOption] = useState({ id: 1, name: 'Include GST' });
  const [selectedUnit, setSelectedUnit] = useState({ id: 1, name: 'Days' });

  const defaultValues: SubscriptionFormValues = {
    academicYear: '',
    templateName: '',
    exam: '',
    targetYear: '',
    packageType: '',
    actualPrice: '',
    discountedPrice: '',
    noOfDays: '',
    endDate: '',
    stream: '',
    standard: ''
  };

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues
  });

  const handleModalClose = () => {
    // Add logic to close the modal
  };

  const handleAcademicYear = (selectedOption: any) => {
    setAcademicYear(selectedOption.name);
    form.setValue('academicYear', selectedOption.name);
  };

  const handlePackageType = (selectedOption: { id: number; name: string }) => {
    setPackageType(selectedOption);
    form.setValue('packageType', selectedOption.name);
  };

  const handleStreamChange = (selectedOption: { id: number; name: string }) => {
    setStream(selectedOption);
    form.setValue('exam', selectedOption.name);
  };

  const handleStandardChange = (selectedOption: { id: number; name: string }) => {
    setStandard(selectedOption);
    form.setValue('targetYear', selectedOption.name);
  };

  const onSubmit = async (data: SubscriptionFormValues) => {
    console.log('Submitted Data:', data);
    form.reset();
    onClose();
  };

  return (
    <div>
      <MainDialog title="ADD SUBSCRIPTION" isOpen={isOpen} onOpenChange={onClose} size="default">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4 flex flex-col items-center justify-between gap-2 md:flex-row">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="academicYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Title title="Academic Year" />
                      </FormLabel>
                      <FormControl>
                        <SelectDropdown
                          data={mockData.academicYears}
                          value={academicYear}
                          onChange={(val: { id: number; name: string }) => {
                            setAcademicYear(val);
                            field.onChange(val.name);
                          }}
                          placeholder="Select Academic Year"
                          name="academicYear"
                          size="default"
                          width="full"
                          height="h-10"
                          borderRadius="!rounded-[4px]"
                          placeholderColor="text-[#4B4B4B]"
                          text="text-[#4B4B4B]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="templateName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Title title="Subscription Name" />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter Subscription Name" className="text-xs font-medium text-[#4B4B4B]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mb-4 flex flex-col items-center justify-between gap-2 md:flex-row">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="stream"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Title title="Stream" />
                      </FormLabel>
                      <FormControl>
                        <SelectDropdown
                          data={mockData.stream}
                          value={stream}
                          onChange={(val: { id: number; name: string }) => {
                            setStream(val);
                            field.onChange(val.name);
                          }}
                          placeholder="Select Stream"
                          name="stream"
                          size="default"
                          width="full"
                          height="h-10"
                          borderRadius="!rounded-[4px]"
                          placeholderColor="text-[#4B4B4B]"
                          text="text-[#4B4B4B]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="standard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Title title="Standard" />
                      </FormLabel>
                      <FormControl>
                        <SelectDropdown
                          data={mockData.standard}
                          value={standard}
                          onChange={(val: { id: number; name: string }) => {
                            setStandard(val);
                            field.onChange(val.name);
                          }}
                          placeholder="Select Standard"
                          name="standard"
                          size="default"
                          width="full"
                          height="h-10"
                          borderRadius="!rounded-[4px]"
                          placeholderColor="text-[#4B4B4B]"
                          text="text-[#4B4B4B]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mb-4 w-full">
              <FormField
                control={form.control}
                name="packageType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Title title="Package Plan" />
                    </FormLabel>
                    <FormControl>
                      <SelectDropdown
                        data={mockData.packageTypes}
                        value={packageType}
                        onChange={(val: { id: number; name: string }) => {
                          setPackageType(val);
                          field.onChange(val.name);
                        }}
                        placeholder="Select Package Plan"
                        name="packageType"
                        size="default"
                        width="full"
                        height="h-10"
                        borderRadius="!rounded-[4px]"
                        placeholderColor="text-[#4B4B4B]"
                        text="text-[#4B4B4B]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-4 flex flex-col items-center justify-between gap-2 md:flex-row">
              {/* Actual Price */}
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="actualPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Title title="Actual Price" />
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex h-10 w-full items-center overflow-hidden rounded-sm border border-border px-2 md:px-3">
                          <span className="text-lg text-gray-500">
                            <Icon icon="material-symbols:currency-rupee" />
                          </span>

                          <Input
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              field.onChange(value);
                            }}
                            className="w-full border-none bg-transparent pl-2 pr-32"
                            placeholder=""
                          />

                          {/* Dropdown on the Right */}
                          <div className="absolute right-0">
                            <SelectDropdown
                              data={[
                                { id: 1, name: 'Include GST' },
                                { id: 2, name: 'Exclude GST' }
                              ]}
                              value={selectedGSTOption}
                              onChange={setSelectedGSTOption}
                              name="gstType"
                              size="sm"
                              width="w-32"
                              height="h-10"
                              borderRadius="!rounded-[4px]"
                              placeholderColor="text-[#4B4B4B]"
                              text="text-[#4B4B4B]"
                              borderColor="border-[#222222]"
                              color="text-[#4B4B4B]"
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Discounted Price */}
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="discountedPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Title title="Discounted Price" />
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex h-10 w-full items-center overflow-hidden rounded-sm border border-border px-2 md:px-3">
                          {/* Dropdown on the Left */}
                          <div className="absolute left-0">
                            <SelectDropdown
                              data={[
                                { id: 1, name: '₹' },
                                { id: 2, name: '%' }
                              ]}
                              value={selectedDiscount}
                              onChange={setSelectedDiscount}
                              name="discountType"
                              size="sm"
                              width="w-20"
                              height="h-10"
                              borderRadius="!rounded-[4px]"
                              placeholderColor="text-[#4B4B4B]"
                              text="text-[#4B4B4B]"
                              borderColor="border-[#222222]"
                              color="text-[#4B4B4B]"
                            />
                          </div>

                          {/* Input field with left padding to accommodate dropdown */}
                          <Input
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              field.onChange(value);
                            }}
                            className="w-full border-none bg-transparent pl-24"
                            placeholder=""
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mb-4 flex flex-col items-center justify-between gap-2 md:flex-row">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="noOfDays"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>
                        <Title title="No of Days" />
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex h-10 w-full items-center rounded-sm border border-border px-2 md:px-3">
                          {/* Dropdown on the Left */}
                          <div className="absolute left-2 -ml-2">
                            <SelectDropdown
                              data={[
                                { id: 1, name: 'Days' },
                                { id: 2, name: 'Months' },
                                { id: 3, name: 'Years' }
                              ]}
                              value={selectedUnit}
                              onChange={setSelectedUnit}
                              name="durationType"
                              size="sm"
                              width="w-24"
                              height="h-10"
                              borderRadius="!rounded-[4px]"
                              placeholderColor="text-[#4B4B4B]"
                              text="text-[#4B4B4B]"
                              borderColor="border-[#222222]"
                              placeholder="Select Period"
                              color="text-[#4B4B4B]"
                            />
                          </div>
                          <Input
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              field.onChange(value);
                            }}
                            className="ml-24 w-full border-none bg-transparent !pl-2"
                            placeholder=""
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Title title="End Date" />
                      </FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          {!field.value && (
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#4B4B4B]">
                              Select End Date
                            </span>
                          )}
                          <Input
                            type="date"
                            id="endDate"
                            {...field}
                            value={field.value || ''}
                            onFocus={(e) => e.target.showPicker()}
                            className={`h-10 w-full rounded-sm border border-border pr-12 text-sm font-medium text-B2CAgrayn ${
                              !field.value ? 'text-transparent' : 'text-gray-900'
                            } md:text-base [&::-webkit-calendar-picker-indicator]:hidden`}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                          <img
                            src="/images/calendar.svg"
                            alt="Calendar Icon"
                            className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 cursor-pointer"
                            onClick={() => {
                              const input = document.getElementById('endDate') as HTMLInputElement;
                              input?.showPicker();
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

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
                {/* {type === FormType.EDIT ? FormType.UPDATE : FormType.ADD} */}
                {FormType.ADD}
              </Button>
            </div>
          </form>
        </Form>
      </MainDialog>
    </div>
  );
};

export default AddSubscription;
