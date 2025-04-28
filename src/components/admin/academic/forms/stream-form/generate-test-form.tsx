import React, { useEffect } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SlotSelector } from './slot-selector';
import { DialogTitle, FormFields } from '@/types/enum';
import { FloatingLabelInput } from '@/components/common/floating-label-input';

const GenerateTestForm = ({ form, loading, isView }: { form: any; loading: boolean; isView: boolean }) => {
  return (
    <div className={`flex size-full flex-col gap-2 pb-4`}>
      <div className="flex w-full flex-col">
        <FormField
          control={form.control}
          name="generateTest.timeSlot"
          render={({ field }) => {
            return (
              <FormItem className="mb-3">
                <FormLabel className="text-sm font-semibold text-B2CAgray">{FormFields.TIME_SLOT}</FormLabel>
                <FormControl>
                  <SlotSelector
                    value={Array.isArray(field.value) ? field.value : []}
                    onChange={(newValue) => field.onChange(newValue)}
                    label="Mins"
                    disabledInput={isView}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="generateTest.questionSlot"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-B2CAgray">{FormFields.QUES_SLOT}</FormLabel>
              <FormControl>
                <SlotSelector value={field.value} onChange={field.onChange} label="Ques" disabledInput={isView} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="mt-3 flex flex-col space-y-2">
        <div className="flex w-full">
          <h2 className="text-lg font-medium text-B2CAgray">{DialogTitle.MARKS}</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <FormField
            control={form.control}
            name="generateTest.correctMarks"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    label=""
                    floatingLabel="Correct"
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      field.onChange(value);
                    }}
                    // autoComplete="off"
                    borderColor="border-[#00A86B] text-[#00A86B] text-sm"
                    placeholder=""
                    disabled={loading || isView}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="generateTest.wrongMarks"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingLabelInput
                    label=""
                    floatingLabel="Wrong"
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      field.onChange(value);
                    }}
                    // autoComplete="off"
                    disabled={loading || isView}
                    borderColor="border-[#FF4747] text-[#FF4747] text-sm"
                    placeholder=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="generateTest.leftMarks"
            render={({ field }) => (
              <FormItem className="text-B2CAgray">
                <FormControl>
                  <FloatingLabelInput
                    label=""
                    floatingLabel="Left"
                    // autoComplete="off"
                    value={field.value}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      field.onChange(value);
                    }}
                    disabled={loading || isView}
                    borderColor="border-[#FFA126] text-[#FFA126] text-sm"
                    placeholder=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default GenerateTestForm;
