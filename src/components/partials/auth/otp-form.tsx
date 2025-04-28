'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Link } from '@/i18n/routing';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
// import { useRouter } from '@/components/navigation';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { signIn } from 'next-auth/react';
import { getIpDetails, getOtp, verifyOtp } from '@/utils/api/auth';
import { VerfiyOtpPayload } from '@/types/auth';
import { Errors } from '@/types/enum';
import { getCookie, getUserDevice } from '@/utils';
import { Countrycodes } from './countrycodes';
import { LucideLoader } from '@/components/common/LucideLoader';

const schema = z.object({
  otp: z.string().min(6, 'OTP is required').max(6, 'OTP Cannot be more than 6 digit')
});

export type FormValues = z.infer<typeof schema>;

const OtpVerifyForm = () => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const mobileNumber = getCookie('mobileNumber');

  const initialValues: FormValues = {
    otp: ''
  };

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true);
    try {
      const response = await signIn('credentials', {
        redirect: false,
        phoneNumber: mobileNumber,
        otp: data?.otp!,
        device: getUserDevice()
      });
      if (response?.error) toast.error(typeof response?.error === 'string' ? response?.error : Errors.SOMETHING_WENT_WRONG);
    } catch (error) {
      toast.error(Errors.SOMETHING_WENT_WRONG);
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    const response = await getOtp(mobileNumber!);
    if (response.success) {
      setTimeLeft(30);
    } else toast.error(response.message);
  };

  useEffect(() => {
    if (!mobileNumber) router.push('/auth/login');
  }, [mobileNumber]);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsButtonEnabled(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    // Focus the input field when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-4 2xl:mt-7">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center rounded-md border border-borderad">
                  <Input
                    type="text"
                    size="lg"
                    placeholder="Enter OTP"
                    className="rounded-md border-none text-base font-medium"
                    {...field}
                    ref={inputRef}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      field.onChange(value);
                    }}
                  />
                  <span className="flex h-full basis-2/12 items-center justify-center border-l border-borderad text-sm font-medium">
                    {form.watch('otp').length}/6
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            disabled={timeLeft !== 0}
            variant="default"
            size="sm"
            type="button"
            onClick={resendOtp}
            className="!px-0 text-right text-sm font-medium text-primary lg:text-base"
          >
            {timeLeft ? `Resend Code in 0:${timeLeft > 9 ? timeLeft : `0${timeLeft}`}` : 'Resend Code'}
          </Button>
        </div>
        <Button
          type="submit"
          size="lg"
          fullWidth
          variant="default"
          color="primary"
          className="gap-1 !px-10"
          data-testid="sign-in-btn"
          disabled={isLoading || !form.watch('otp')}
        >
          {isLoading && <LucideLoader />}
          {isLoading ? 'Verifying OTP' : 'Continue'}
        </Button>
      </form>
    </Form>
  );
};
export default OtpVerifyForm;
