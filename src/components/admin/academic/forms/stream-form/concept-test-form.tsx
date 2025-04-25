import { FloatingLabelInput } from '@/components/common/floating-label-input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormFields } from '@/types/enum';
import React from 'react';

const ConceptTestForm = ({
  form,
  loading,
  isView,
  isShowForm
}: {
  form: any;
  loading: boolean;
  isView: boolean;
  isShowForm: boolean;
}) => {
  return (
    <div className={isView ? 'pointer-events-none' : 'pointer-events-auto'}>
      <div
        className={`${isShowForm ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-60'} grid-cols mt-4 grid w-full gap-2 md:grid-cols-2`}
      >
        <FormField
          control={form.control}
          name="conceptWiseTest.topicWiseTotalQuestion"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel className="text-sm font-semibold text-B2CAgray">{FormFields.QUESTION_COUNT}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter Question Count"
                  color="secondary"
                  className="text-primary"
                  size="md"
                  data-test-id="total-time-input"
                  autoComplete="off"
                  value={field.value}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    field.onChange(value);
                  }}
                  disabled={loading}
                  // {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="conceptWiseTest.topicWiseTimePerQuestion"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel className="text-sm font-semibold text-B2CAgray">{FormFields.TIME_PER_QUESTION}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter Time Per Question"
                  color="secondary"
                  className="text-primary"
                  size="md"
                  data-test-id="total-marks-input"
                  autoComplete="off"
                  value={field.value}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    field.onChange(value);
                  }}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ConceptTestForm;
