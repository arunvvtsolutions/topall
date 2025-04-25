import { MainDialog } from '@/components/common/MainDialog';
import SelectDropdown from '@/components/common/Select';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CountryCodeDropdown from '../../partials/auth/courtry-dropdown';
import { Separator } from '@/components/ui/separator';
import { FacultyTitle, FormFields, InfluencerTitles } from '@/types/enum';

const influencerSchema = z.object({
  name: z.string().min(1, 'Influencer Name is required'),
  email: z.string().email('Invalid email address'),
  mobileNumber: z.string().min(10, 'Invalid mobile number').max(10, 'Invalid mobile number'),
  state: z.string().min(1, 'State is required'),
  referralCode: z.string().min(1, 'Referral Code is required'),
  socialMedia: z.string().min(1, 'Social Media handle is required'),
  startDate: z.string().min(1, 'Start Date is required'),
  endDate: z.string().min(1, 'End Date is required')
});

const stateOptions = [
  { id: 0, name: 'Maharashtra' },
  { id: 1, name: 'Karnataka' },
  { id: 2, name: 'Delhi' },
  { id: 3, name: 'Tamil Nadu' },
  { id: 4, name: 'West Bengal' }
];

const socialMediaOptions = [
  { id: 0, name: 'YouTube' },
  { id: 1, name: 'Instagram' },
  { id: 2, name: 'Twitter' },
  { id: 3, name: 'Facebook' },
  { id: 4, name: 'TikTok' }
];

const AddInfluencerForm = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const form = useForm({
    resolver: zodResolver(influencerSchema),
    defaultValues: {
      name: '',
      email: '',
      mobileNumber: '',
      state: '',
      referralCode: '',
      socialMedia: '',
      startDate: '',
      endDate: '',
      countryCode: '91',
      countryFlag: 'IN'
    }
  });

  const onSubmit = async (data: any) => {
    console.log('Submitted Data:', data);
  };

  return (
    <MainDialog title={'ADD INFLUENCER'} isOpen={isOpen} onOpenChange={onClose} size="default">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Influencer Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2 text-sm font-semibold text-B2CAgray">
                    {InfluencerTitles.INFLUENCER_NAME} <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter Influencer Name"
                      className="h-10 border-borderad text-xs font-medium text-B2CAgray placeholder-B2CAgray"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email ID */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2 text-sm font-semibold text-B2CAgray">
                    {FormFields.EMAIL_ID} <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      placeholder="Enter Email ID"
                      className="h-10 border-borderad text-xs font-medium text-B2CAgray placeholder-B2CAgray"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mobile Number */}
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2 text-sm font-semibold text-B2CAgray">{FacultyTitle.MOBILE_NUMBER} </FormLabel>
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

            {/* State */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2 text-sm font-semibold text-B2CAgray">{FormFields.STATE}</FormLabel>
                  <FormControl>
                    <SelectDropdown
                      name="state"
                      data={stateOptions}
                      value={field.value}
                      onChange={(selected) => field.onChange(selected.name)}
                      placeholder="Select State"
                      size="default"
                      width="full"
                      height="h-10"
                      borderRadius="!rounded-[4px]"
                      placeholderColor="text-B2CAgray"
                      text="!text-B2CAgray"
                      borderColor="border-borderad"
                      // color="text-B2CAgray"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Referral Code */}
            <FormField
              control={form.control}
              name="referralCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2 text-sm font-semibold text-B2CAgray">
                    {InfluencerTitles.CREATE_REFERRAL_CODE}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter Referral code"
                      className="h-10 border-borderad text-xs font-medium text-B2CAgray placeholder-B2CAgray"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Social Media */}
            <FormField
              control={form.control}
              name="socialMedia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2 text-sm font-semibold text-B2CAgray">{InfluencerTitles.SOCIAL_MEDIA} </FormLabel>
                  <FormControl>
                    <SelectDropdown
                      name="socialMedia"
                      data={socialMediaOptions}
                      value={field.value}
                      onChange={(selected) => field.onChange(selected.name)}
                      placeholder="Select Social Media"
                      size="default"
                      width="full"
                      height="h-10"
                      borderRadius="!rounded-[4px]"
                      placeholderColor="text-B2CAgray"
                      text="!text-B2CAgray"
                      borderColor="border-borderad"
                      // color="text-B2CAgray"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Date */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormLabel className="mb-2 text-sm font-semibold text-B2CAgray">
                      {FormFields.START_DATE} <span className="text-red-500">*</span>
                    </FormLabel>
                  </FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      {!field.value && (
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-B2CAgray">
                          {InfluencerTitles.SELECT_START_DATE}
                        </span>
                      )}
                      <Input
                        type="date"
                        id="startDate"
                        {...field}
                        value={field.value || ''}
                        className={`h-10 w-full rounded-sm border border-border pr-12 text-sm font-medium text-B2CAgrayn ${
                          !field.value ? 'text-transparent' : 'text-gray-900'
                        } pointer-events-none md:text-base [&::-webkit-calendar-picker-indicator]:hidden`}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      <img
                        src="/images/calendar.svg"
                        alt="Calendar Icon"
                        className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 cursor-pointer"
                        onClick={() => {
                          const input = document.getElementById('startDate') as HTMLInputElement;
                          input?.showPicker();
                        }}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <FormLabel className="mb-2 text-sm font-semibold text-B2CAgray">{FormFields.END_DATE}</FormLabel>
                  </FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      {!field.value && (
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-B2CAgray">
                          {InfluencerTitles.SELECT_END_DATE}
                        </span>
                      )}
                      <Input
                        type="date"
                        id="endDate"
                        {...field}
                        value={field.value || ''}
                        className={`h-10 w-full rounded-sm border border-border pr-12 text-sm font-medium text-B2CAgrayn ${
                          !field.value ? 'text-transparent' : 'text-gray-900'
                        } pointer-events-none md:text-base [&::-webkit-calendar-picker-indicator]:hidden`}
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
              {/* {type === FormType.EDIT ? FormType.UPDATE : FormType.ADD} */}
              {InfluencerTitles.ADD_INFLUENCER}
            </Button>
          </div>
        </form>
      </Form>
    </MainDialog>
  );
};

export default AddInfluencerForm;
