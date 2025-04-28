'use client';
import React from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
// import { Link } from '@/i18n/routing';

interface FormValues {
  test: {
    firstName: string;
    lastName: string;
    phone: string;
  }[];
}

const Repeater = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control
  } = useForm<FormValues>({
    defaultValues: {
      test: [{ firstName: 'Bill', lastName: 'Luo', phone: '123456' }]
    }
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data);

  console.log(watch('test'));

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'test'
  });

  return (
    <div>
      <div className="-mx-6 bg-default-50 px-6 py-6">
        <div className="mb-6 text-xs font-medium uppercase text-default-600">Items info-500</div>

        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((item, index) => (
              <div
                className="mb-5 grid grid-cols-1 gap-5 last:mb-0 md:grid-cols-2 lg:grid-cols-3"
                key={item.id}
              >
                <div className="space-y-2">
                  <Label htmlFor={`firstName-${index}`}>First Name</Label>
                  <Input
                    type="text"
                    id={`firstName-${index}`}
                    placeholder="First Name"
                    {...register(`test.${index}.firstName`, { required: true })}
                  />
                  {errors.test?.[index]?.firstName && <span>This field is required</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`lastName-${index}`}>Last Name</Label>
                  <Input
                    type="text"
                    id={`lastName-${index}`}
                    placeholder="Last Name"
                    {...register(`test.${index}.lastName`, { required: true })}
                  />
                  {errors.test?.[index]?.lastName && <span>This field is required</span>}
                </div>

                <div className="flex items-end justify-between space-x-5">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`phone-${index}`}>Phone</Label>
                    <Input
                      type="text"
                      id={`phone-${index}`}
                      placeholder="Phone"
                      {...register(`test.${index}.phone`, { required: true })}
                    />
                    {errors.test?.[index]?.phone && <span>This field is required</span>}
                  </div>
                  {index > 0 && (
                    <div className="relative flex-none">
                      <button
                        onClick={() => remove(index)}
                        type="button"
                        className="bg-danger-500 border-danger-500 inline-flex h-10 w-10 items-center justify-center rounded border text-lg text-white"
                      >
                        <Icon icon="heroicons-outline:trash" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </form>
          <div className="mt-4">
            <Link
              href="#"
              className="flex items-center gap-2 p-0 text-sm font-medium text-default-800"
              onClick={() => append({ firstName: '', lastName: '', phone: '' })}
            >
              <Icon icon="heroicons-outline:plus" className="h-4 w-4" /> Add New
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Repeater;
