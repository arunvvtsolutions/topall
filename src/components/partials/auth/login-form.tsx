'use client';
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Link } from '@/i18n/routing';
import { Icon } from '@/components/ui/icon';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
// import { useRouter } from '@/components/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MobileNumberInput from '@/components/common/mobile-number-input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import CountryCodeDropdown from '../../partials/auth/courtry-dropdown';
import { Separator } from '@/components/ui/separator';
import { getOtp } from '@/utils/api/auth';
import { cookies } from 'next/headers';
import { LucideLoader } from '@/components/common/LucideLoader';

const formSchema = z.object({
  mobileNumber: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits'),
  countryCode: z.string().min(1, 'Country code is required'),
  countryFlag: z.string().min(1, 'Country flag is required')
});

export type FormValues = z.infer<typeof formSchema>;

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialValues: FormValues = {
    countryCode: '91',
    countryFlag: 'IN',
    // userName: '',
    // email: '',
    mobileNumber: ''
    // state: ''
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const phoneNumber = `${data.countryCode}${data.mobileNumber}`;
      const response = await getOtp(phoneNumber);
      if (response.success) {
        document.cookie = `mobileNumber=${phoneNumber}`;
        router.push('/auth/otp-verify');
      } else toast.error(response.message);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Focus the input field when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 space-y-6 2xl:mt-7">
        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <div className="relative flex items-stretch rounded-md border border-borderad">
                    <CountryCodeDropdown watch={form.watch} setValue={form.setValue} />
                    <div className="flex items-center">
                      <Separator orientation="vertical" className="h-6 bg-borderad" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Enter Mobile Number"
                      className="h-full rounded-md border-none text-base font-medium text-B2Cgray"
                      autoComplete="off"
                      {...field}
                      ref={inputRef}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <div>
          <p className="text-center text-sm text-B2CAgrayn lg:text-base">
            By signing up, you agree to the <br />
            <Link href="#" className="px-2 text-primary underline">
              Terms and Conditions
            </Link>
            and
            <Link href="#" className="px-2 text-primary underline">
              Privacy Policy
            </Link>
          </p>
        </div>
        <Button
          type="submit"
          size="lg"
          fullWidth
          variant="default"
          color="primary"
          className="gap-1 !px-10"
          data-testid="sign-in-btn"
          disabled={isLoading || !form.watch('mobileNumber')}
        >
          {isLoading && <LucideLoader />}
          {isLoading ? 'OTP Sent' : 'Get OTP'}
        </Button>
      </form>
    </Form>
  );
};
export default LoginForm;
