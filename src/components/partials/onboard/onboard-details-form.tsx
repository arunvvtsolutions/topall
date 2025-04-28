'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import SelectDropdown from '@/components/common/Select';
import TargetYearAndScores from './target-year-scores';
import { onboardFormSchema, OnboardFormValues } from '@/schemas/onboard/onboard-schema';
import { ProfilePayload } from '@/types/user';
import { useSession } from 'next-auth/react';
import { Errors, StausCode } from '@/types/enum';
import { getStandards, getStates, getStreams, updateOnboard, verifyReferralCode } from '@/utils/api/user/on-board';
import { useDispatch, useSelector } from '@/store';
import { HttpStatusCode } from 'axios';
import { Standard, Streams } from '@/types';
import { Check } from 'lucide-react';
import { LucideLoader } from '@/components/common/LucideLoader';

interface StateProps {
  id: number;
  name: string;
}

const OnBoardDetailsForm = () => {
  const router = useRouter();
  const { data, update } = useSession();
  const [stateData, setStateData] = useState<StateProps[]>([]);
  const [referralFailed, setReferralStatus] = useState(true);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [streams, setStreams] = useState<Streams[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStreamId, setSelectedStreamId] = useState<number | null>(null);

  if (data?.user?.onboardStatus) router.push('/dashboard');

  const isUserFromIndia = data?.user?.loginCountry === 'India';

  const initialValues: OnboardFormValues = {
    name: '',
    state: null,
    referralCode: '',
    streamId: '',
    standardId: '',
    targets: [],
    currentExam: []
  };

  // validation
  const targetYearScores = z.object({
    id: z.number(),
    name: z.string(),
    targetYear: z.number({ message: 'Target Year is required' }).min(1, 'Target Year is required'),
    targetScore: z
      .string()
      .min(1, 'Target Score is required')
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Target Score must be a number greater than 0'
      })
  });

  const stateValidation = isUserFromIndia
    ? z.number({ message: 'State is Required' }).min(1, 'State is required')
    : z
        .number()
        .nullable()
        .refine((val) => val === null || val >= 1, {
          message: 'State is required'
        });

  const onboardFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    state: stateValidation,
    referralCode: z.string(),
    streamId: z.string({ message: 'Stream is required' }).min(1, 'Stream is required'),
    standardId: z.string({ message: 'Standard is required' }).min(1, 'Standard is required'),
    targets: z.array(targetYearScores),
    currentExam: z.array(z.object({ streamId: z.number(), standardId: z.number(), maxScore: z.number() }))
  });

  type OnboardFormValues = z.infer<typeof onboardFormSchema>;

  type targetYearScores = z.infer<typeof targetYearScores>;

  const form = useForm({
    resolver: zodResolver(onboardFormSchema),
    defaultValues: initialValues
  });

  // Helper function to check if a stream is selected
  const isStreamSelected = (streamId: number) => {
    // return form.watch('currentExam').some((item) => item.streamId === streamId);
    return selectedStreamId === streamId;
  };

  //onSubmit form
  const onSubmit = async (formData: OnboardFormValues) => {
    setIsLoading(true);
    if (!data) {
      toast.error(Errors.SOMETHING_WENT_WRONG);
      return;
    }
    let errorMessage = '';
    const errorChecking = formData.targets.some((t) => {
      const stream = streams.find((s) => s.id === t.id);
      if (stream && Number(stream.total_score) < Number(t.targetScore)) {
        errorMessage = `Total score for ${stream.name} cannot be more than ${stream.total_score}`;
        return true;
      } else false;
    });

    if (errorChecking) {
      toast.error(errorMessage);
      return;
    }

    const payload: ProfilePayload = {
      studentId: data?.user.id || 0,
      stateId: formData.state || 0,
      currentExam: formData.currentExam || [],
      name: formData.name,
      target: formData.targets.map((t) => ({ ...t, targetYear: String(t.targetYear) })),
      referalCode: formData.referralCode,
      referLevel: data?.user.referLevel || 0,
      profileImage: '',
      gender: '',
      dob: '',
      address: '',
      city: 0,
      zipcode: '',
      best: [],
      email: ''
    };

    try {
      const result = await updateOnboard(payload);
      if (result.statusCode === HttpStatusCode.Ok) {
        toast.success('Welcome to Topall');
        update({ userName: formData.name, onboardStatus: 1 });
        router.push('/dashboard');
      } else toast.error(result.message);
    } catch (error) {
      toast.error(Errors.SOMETHING_WENT_WRONG);
    } finally {
      setIsLoading(false);
    }
  };

  //verify referral
  const handleVerifyReferral = async () => {
    const res = await verifyReferralCode(form.getValues('referralCode'));
    if (!res.isVerify) {
      toast.error(Errors.NOT_A_VALID_REFERRAL);
      setReferralStatus(false);
    } else {
      toast.success('Referral Code is Valid');
      setReferralStatus(true);
    }
  };

  //toggleStream
  // Fixed toggleStream function to prevent duplicates
  const toggleStream = (streamId: number, streamName: string) => {
    const currentTargets = form.getValues('targets') || [];
    form.setValue('streamId', String(streamId));
    form.setError('streamId', {});
    if (selectedStreamId === streamId) {
      const updatedTargets = currentTargets.filter((target) => target.id !== streamId && target.id);
      const updatedExam = form.getValues('currentExam').filter((item) => item.streamId !== streamId);
      form.setValue('currentExam', updatedExam);
      form.setValue('targets', updatedTargets);
      if (updatedTargets.length === 0) {
        form.setValue('streamId', '');
        form.setError('streamId', { message: 'Standard is required', types: { required: true } });
        form.watch();
      }
      setSelectedStreamId(null);
    } else {
      const streamExists = currentTargets.some((target) => target.id === streamId);

      if (!streamExists) {
        // Only add if it doesn't exist
        const newTarget = {
          id: streamId,
          name: streamName,
          targetYear: 0,
          targetScore: ''
        };
        // Update targets without duplicates
        form.setValue('targets', [...currentTargets, newTarget]);
      }
      setSelectedStreamId(streamId);
    }
  };

  //toggle standard
  const toggleStandard = (standardId: number) => {
    if (selectedStreamId) {
      form.setValue('standardId', String(standardId));
      form.setError('standardId', {});
      const currentExam = form.getValues('currentExam') || [];
      const streamEntryIndex = currentExam.findIndex((item) => item.streamId === selectedStreamId);
      const currentTargets = form.getValues('targets') || [];
      if (streamEntryIndex !== -1) {
        // If the same standard is clicked again, remove the object
        if (currentExam[streamEntryIndex].standardId === standardId) {
          form.setValue('standardId', '');
          form.setError('standardId', { message: 'Standard is required', types: { required: true } });
          const updatedTargets = currentTargets.filter((target) => target.id !== selectedStreamId && target.id);
          form.setValue('targets', updatedTargets);
          form.setValue(
            'currentExam',
            currentExam
              .filter((_, idx) => idx !== streamEntryIndex)
              .map((exam) => {
                return {
                  ...exam,
                  maxScore: streams.find((stream) => stream.id === exam.streamId)?.total_score || 0
                };
              }) // Remove the entry
          );
        } else {
          // Update the existing stream entry with the new standard
          const streamMaxScore = streams.find((stream) => stream.id === selectedStreamId)?.total_score || 0;
          const updatedExam = [...currentExam];
          updatedExam[streamEntryIndex] = { streamId: selectedStreamId, standardId, maxScore: streamMaxScore };
          form.setValue('currentExam', updatedExam);
        }
      } else {
        const streamMaxScore = streams.find((stream) => stream.id === selectedStreamId)?.total_score || 0;
        // Add new entry if no existing stream entry
        if (currentExam.length === 0) {
          form.setValue('currentExam', [{ streamId: selectedStreamId, standardId, maxScore: streamMaxScore }]);
        } else {
          form.setValue('currentExam', [...currentExam, { streamId: selectedStreamId, standardId, maxScore: streamMaxScore }]);
        }
      }
    }
  };

  // Filter standards based on selected stream
  const filteredStandards = useMemo(() => {
    if (!selectedStreamId) return [];
    return standards.filter((s) => s.streams.id === selectedStreamId);
  }, [selectedStreamId, standards]);

  useEffect(() => {
    const getData = async () => {
      try {
        const [standardData, streamData, states] = await Promise.all([getStandards(), getStreams(), getStates()]);
        setStateData(states);
        setStreams(streamData);
        setStandards(standardData);
      } catch (error) {
        console.log(error);
        toast.error(Errors.SOMETHING_WENT_WRONG);
      }
    };
    getData();
  }, []);

  // filter CBSE
  const filteredStream: any[] = useMemo(() => {
    return streams.filter((stream) => !stream.name.toLowerCase().includes('cbse'));
  }, [streams, form.getValues('currentExam')]);

  useEffect(() => {
    const referralCode = localStorage.getItem('referralCode');
    if (referralCode) {
      form.setValue('referralCode', referralCode);
      localStorage.removeItem('referralCode');
    }
  }, [form.setValue]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col justify-between">
        <div className="space-y-6">
          {/* Personal Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-base font-medium text-B2CAgrayn lg:text-xl">
              <Icon icon="solar:clipboard-text-linear" className="font-medium" />
              <h1 className="text-inherit">Personal Details</h1>
            </div>
            <Separator />
            <div className="grid-cols grid gap-4 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          size="md"
                          placeholder="Enter Full Name"
                          className="rounded-md text-sm font-medium text-B2Cgray lg:text-base"
                          autoComplete="off"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {isUserFromIndia && (
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <SelectDropdown
                            name="state-selector"
                            onChange={(item) => field.onChange(item.id)}
                            value={stateData.find((item) => item.id === field.value) || null}
                            data={[{ id: 0, name: 'Select State' }, ...stateData]}
                            placeholder="Select State"
                            width="w-full"
                            text="text-B2Cgray"
                            size="md"
                            disabled={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )}
            </div>
          </div>
          {/* Referral Code */}
          <div className="space-y-4">
            <div className="item-center flex justify-between">
              <div className="flex items-center gap-2 text-base font-medium text-B2CAgrayn lg:text-xl">
                <Icon icon="ion:gift-outline" className="font-medium" />
                <h1 className="text-inherit">Referral Code</h1>
              </div>
              <div className="flex items-center">
                <Icon icon="octicon:question-24" className="font-medium" />
              </div>
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="referralCode"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center rounded-md border border-dashed border-primary">
                        <Input
                          type="text"
                          size="lg"
                          placeholder="Enter Referral Code"
                          className="h-full rounded-md border-none text-sm font-normal text-primary placeholder:text-primary lg:text-base"
                          autoComplete="off"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            !e.target.value ? setReferralStatus(true) : setReferralStatus(false);
                          }}
                        />
                        <Button
                          disabled={!form.getValues('referralCode')}
                          type="button"
                          className="text-sm lg:text-base"
                          onClick={handleVerifyReferral}
                        >
                          Apply
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          {/* Academics */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-base font-medium text-B2CAgrayn lg:text-xl">
              <Icon icon="mage:book-text" className="font-medium" />
              <h1 className="text-inherit">Academics</h1>
            </div>
            <Separator />

            <div className="space-y-4">
              <p className="text-sm text-B2Cgray lg:text-base">Tell us what you want to pursue?</p>
              <FormField
                control={form.control}
                name="currentExam"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormControl>
                      <div className="flex flex-wrap gap-4">
                        {streams.map((stream) => (
                          <Button
                            key={stream.id}
                            type="button"
                            size="md"
                            rounded="full"
                            variant="default"
                            className={cn(
                              'px-4 text-default lg:!px-6',
                              isStreamSelected(stream.id)
                                ? 'bg-primary hover:bg-primary/90 hover:ring-primary'
                                : 'bg-secondaryBtn text-B2Cgray hover:bg-secondaryBtn/90 hover:ring-B2Cgray'
                            )}
                            onClick={() => toggleStream(stream.id, stream.name)}
                          >
                            {stream.name}
                            {/* {selectedStandardId && <Check size={16} className="ml-1 text-white" />} */}

                            {form.watch('currentExam').some((item) => item.streamId === stream.id) && (
                              <Check
                                size={16}
                                className={`ml-1 ${isStreamSelected(stream.id) ? 'text-white' : 'text-B2Cgray'}`}
                              />
                            )}
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                    {form.formState?.errors?.streamId && (
                      <p className="text-sm font-medium text-destructive">{form.formState?.errors?.streamId.message}</p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            {selectedStreamId && (
              <div className="space-y-4">
                <p className="text-sm text-B2Cgray lg:text-base">Which class are you studying in?</p>
                <FormField
                  control={form.control}
                  name="currentExam"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormControl>
                        <div className="flex flex-wrap gap-4">
                          {filteredStandards.length ? (
                            filteredStandards.map((std) => {
                              return (
                                <Button
                                  key={std.id}
                                  type="button"
                                  size="md"
                                  rounded="full"
                                  variant="default"
                                  className={cn(
                                    'font-semibold text-default',
                                    form.watch('currentExam').some((item) => item.standardId === std.id)
                                      ? 'bg-primary hover:bg-primary/90 hover:ring-primary'
                                      : 'bg-secondaryBtn text-B2Cgray hover:bg-secondaryBtn/90 hover:ring-B2Cgray'
                                  )}
                                  onClick={() => toggleStandard(std.id)}
                                >
                                  {std.name}
                                </Button>
                              );
                            })
                          ) : (
                            <div className="my-2 w-full">
                              <p className="text-start text-[14px] font-semibold">No Data found</p>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      {form.formState?.errors?.standardId && (
                        <p className="text-sm font-medium text-destructive">{form.formState?.errors?.standardId.message}</p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Set your Targets*/}
          {form.getValues('currentExam').length > 0 && <TargetYearAndScores form={form} streams={filteredStream} />}
        </div>

        <div className="py-6 text-center">
          <Button
            type="submit"
            size="lg"
            variant="default"
            color="primary"
            className="gap-1 !px-24"
            data-testid="sign-in-btn"
            disabled={isLoading || !referralFailed}
          >
            {isLoading && <LucideLoader />}
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default OnBoardDetailsForm;
