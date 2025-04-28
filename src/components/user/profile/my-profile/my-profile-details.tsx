'use client';

import { LucideLoader } from '@/components/common/LucideLoader';
import SelectDropdown from '@/components/common/Select';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProfileFormValues, profileSchema } from '@/schemas/user/profile-schema';
import { useSelector } from '@/store';
import { getUserProfile } from '@/store/slice/user/userProfileSlice';
import { GenericType } from '@/types';
import { HttpStatus } from '@/types/constants';
import { Errors, FormFields, FormType, TosterMessages } from '@/types/enum';
import { imageUpload } from '@/utils/api/academic';
import { getProfileCity, getProfileDetail, getProfileState, putProfileDetails } from '@/utils/api/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

const genderOptions: GenericType[] = [
  { id: 1, name: 'Male' },
  { id: 2, name: 'Female' },
  { id: 3, name: 'Other' }
];

const initialFormValues: ProfileFormValues = {
  name: '',
  email: '',
  mobileNumber: '',
  gender: '',
  standard: '',
  loginCountry: '',
  stateId: null,
  city: null,
  zipcode: '',
  address: '',
  dob: ''
};

// Update Profile
export const updateProfileData = async (profilePayload: any) => {
  const updateProfile = await putProfileDetails(profilePayload);
  if (updateProfile?.statusCode !== HttpStatus.OK) {
    toast.error(TosterMessages.PROFILE_UPDATE_FAILED);
    return false;
  }
  toast.success(TosterMessages.PROFILE_UPDATE_SUCCESS);
  return true;
};

const MyProfileDetails = () => {
  const profileData = useSelector((state) => state.userProfile);

  const [states, setStates] = useState<GenericType[]>([]);
  const [city, setCity] = useState<GenericType[]>([]);
  const [selectedState, setSelectedState] = useState<GenericType | null>(null);
  const [selectedCity, setSelectedCity] = useState<GenericType | null>(null);
  const [selectedGender, setSelectedGender] = useState<GenericType | null>(null);
  const [profileImage, setProfileImage] = useState('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: initialFormValues
  });

  // Fetch States on Component Mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const statesResponse = await getProfileState();
        setStates(statesResponse);
      } catch (error) {
        console.error('Error fetching states:', error);
        setStates([]);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      const fetchCities = async () => {
        try {
          const citiesResponse = await getProfileCity(selectedState.id);
          setCity(citiesResponse || []);
        } catch (error) {
          console.error('Error fetching cities:', error);
          toast.error(Errors.SOMETHING_WENT_WRONG);
          setCity([]);
        }
      };

      fetchCities();
    }
  }, [selectedState]);

  useEffect(() => {
    if (profileData) {
      const initialGender =
        genderOptions.find((option) => option.name.toLowerCase() === profileData?.gender?.toLowerCase()) || null;

      const initialState = states.find((option) => option.id === profileData.state) || null;
      // Set the selected state first
      setSelectedState(initialState);

      form.reset({
        name: profileData.name,
        email: profileData.email || '',
        mobileNumber: profileData.mobileNumber || '',
        gender: initialGender?.name || '',
        dob: profileData.dob || '',
        loginCountry: profileData.loginCountry || '',
        stateId: initialState?.id || null,
        zipcode: profileData.zipCode || '',
        address: profileData.address || ''
      });
      setProfileImage(profileData.profileImage || '');
      setSelectedGender(initialGender);
    }
  }, [profileData, states, form]);

  // Set city once cities are loaded and we have profile data
  useEffect(() => {
    if (profileData && city.length > 0) {
      const initialCity = city.find((option) => option.id === profileData.city) || null;

      if (initialCity) {
        setSelectedCity(initialCity);
        form.setValue('city', initialCity.id);
      }
    }
  }, [profileData, city, form]);

  //onSubmit Profile Update
  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    const updatedCurrentExams =
      profileData?.standard?.map(({ streamId, standard }) => ({
        streamId,
        standardId: standard.id
      })) || [];

    const { mobileNumber, loginCountry, ...filteredData } = data;
    const profilePayload = {
      ...filteredData,
      // stateId: data.state || 0,
      city: data.city || 0,
      zipcode: data.zipcode || '',
      studentId: profileData.userId || 0,
      referalCode: '',
      currentExam: updatedCurrentExams,
      referLevel: profileData?.referLevel || '',
      target: profileData?.target ?? [],
      profileImage: profileData?.profileImage || '',
      best: profileData?.best ?? []
    };
    try {
      if (await updateProfileData(profilePayload)) {
        if (profileData?.mobileNumber) await getUserProfile(profileData.mobileNumber);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(TosterMessages.PROFILE_UPDATE_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Profile Image
  const handleDeleteImage = async () => {
    try {
      const updatedCurrentExams =
        profileData?.standard?.map(({ streamId, standard }) => ({
          streamId,
          standardId: standard.id
        })) || [];

      const profilePayload = {
        studentId: profileData.userId || 0,
        name: profileData?.name || '',
        stateId: Number(profileData?.state) || 0,
        referalCode: '',
        currentExam: updatedCurrentExams,
        referLevel: profileData?.referLevel || '',
        target: profileData?.target ?? [],
        profileImage: '',
        gender: profileData?.gender || '',
        dob: profileData?.dob?.toString() || '',
        address: profileData?.address || '',
        city: Number(profileData?.city) || 0,
        zipcode: profileData?.zipCode || '',
        best: profileData?.best ?? [],
        email: profileData?.email || ''
      };

      if (await updateProfileData(profilePayload)) {
        setProfileImage('');
        toast.success('Profile Image Deleted Successfully');
        if (profileData?.mobileNumber) await getUserProfile(profileData.mobileNumber);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to delete profile image:', error);
      toast.error(TosterMessages.PROFILE_UPDATE_FAILED);
    }
  };

  // Update Profile Image
  const handleUpdateImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await imageUpload(formData);
      const updatedProfileImage = uploadResponse?.data?.path;

      if (!updatedProfileImage) {
        toast.error(TosterMessages.IMAGE_UPLOAD_FAILED);
        return;
      }

      const updatedCurrentExams =
        profileData?.standard?.map(({ streamId, standard }) => ({
          streamId,
          standardId: standard.id
        })) || [];

      const profilePayload = {
        studentId: profileData.userId || 0,
        name: profileData?.name || '',
        stateId: profileData?.state || 0,
        referalCode: '',
        currentExam: updatedCurrentExams,
        referLevel: profileData.referLevel || 0,
        target: profileData?.target ?? [],
        profileImage: updatedProfileImage,
        gender: profileData?.gender || '',
        dob: profileData?.dob?.toString() || '',
        address: profileData?.address || '',
        city: profileData?.city || 0,
        zipcode: profileData?.zipCode || '',
        best: profileData?.best ?? [],
        email: profileData?.email || ''
      };

      if (await updateProfileData(profilePayload)) {
        setProfileImage(updatedProfileImage);
        if (profileData?.mobileNumber) await getUserProfile(profileData.mobileNumber);
      } else if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error(TosterMessages.IMAGE_UPLOAD_ERROR);
    }
  };

  const handleUpdateClick = () => {
    fileInputRef.current?.click();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle cancel button click
  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  // console.log('name', form.watch('name').charAt(0).toUpperCase());
  return (
    <div className="px-4 pt-0 md:px-10 md:pt-4">
      <h2 className="border-b pb-2 text-base font-medium text-B2CAgrayn md:pb-4 md:text-[1.5rem]">{FormFields.MY_PROFILE}</h2>

      {/* Profile Picture Section */}
      <div className="mt-2 flex flex-row gap-8 border-b pb-3 md:mt-8 md:flex-row md:items-center md:pb-6">
        {/* <div>
          <h4 className="mb-2 text-sm font-medium text-B2CAgrayn md:text-base">{FormFields.PHOTO}</h4>
          <p className="text-sm font-medium text-B2Cgray md:text-base">{FormFields.PHOTO_DESCRIPTION}</p>
        </div> */}
        <div>
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary lg:h-20 lg:w-20">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span className="text-lg font-medium text-white lg:text-xl">{profileData?.name.charAt(0).toUpperCase() || ''}</span>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept=".jpg, .jpeg, .png"
            onChange={handleUpdateImage}
            style={{ display: 'none' }}
          />
        </div>

        <div className="flex items-center gap-6 md:mt-4">
          <Button
            className="!p-0 font-medium text-B2CAgrayn lg:text-base"
            onClick={handleDeleteImage}
            disabled={!profileData?.profileImage || !profileImage}
          >
            {FormFields.DELETE}
          </Button>

          <Button className="!p-0 font-medium text-[#0D068E] lg:text-base" onClick={handleUpdateClick}>
            {FormFields.UPDATE}
          </Button>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="mt-3 md:mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-B2CAgrayn md:text-base">{FormFields.PERSONAL_INFO}</h2>

              {isEditing ? (
                <div className="space-x-2">
                  <Button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    variant="default"
                    className="h-8 rounded-md text-xs md:text-sm"
                  >
                    {FormFields.CANCEL}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-6 gap-2 rounded-md border border-borderad bg-[#0D068E1A] text-xs font-medium text-primary md:h-8 md:text-sm"
                  >
                    {isLoading && <LucideLoader />}
                    {FormFields.UPDATE}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleEdit}
                  type="button"
                  className="h-6 rounded-md border border-borderad bg-[#6F6F6F1A] text-xs font-medium text-B2Cgray md:h-8 md:text-sm"
                >
                  {FormType.EDIT}
                </Button>
              )}
            </div>
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-[14px] text-[0.875rem] font-medium text-B2Cgray">{FormFields.FULL_NAME}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Full Name"
                        disabled={!isEditing}
                        autoComplete="off"
                        {...field}
                        className="h-12 border-borderad text-sm font-medium text-B2CAgrayn md:text-base"
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-[14px] text-[0.875rem] font-medium text-B2Cgray">{FormFields.EMAIL_ID}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Email ID"
                        type="email"
                        autoComplete="off"
                        {...field}
                        value={field.value}
                        className="h-12 border-borderad text-sm font-medium text-B2CAgrayn md:text-base"
                        disabled={!isEditing}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 border-b pb-6 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[0.875rem] font-medium text-B2Cgray">{FormFields.PHONE_NUMBER}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Phone Number"
                        autoComplete="off"
                        {...field}
                        value={field.value ? `+${field.value}` : ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          field.onChange(value);
                        }}
                        className="h-12 border-borderad text-sm font-medium text-B2CAgrayn md:text-base"
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[0.875rem] font-medium text-B2Cgray">{FormFields.GENDER}</FormLabel>
                    <div className="h-[36px]">
                      <SelectDropdown
                        name={field.name}
                        value={selectedGender}
                        onChange={(selectedOption) => {
                          setSelectedGender(selectedOption);
                          form.setValue('gender', selectedOption.name);
                        }}
                        data={genderOptions}
                        placeholder="Select Gender"
                        placeholderColor="text-B2Cgray"
                        borderRadius="rounded-[0.375rem]"
                        color="text-B2CAgrayn"
                        height="h-12"
                        width="w-full"
                        borderColor="border-borderad"
                        placeholderSize="text-sm md:text-base"
                        dropdownBg={false}
                        disabled={!isEditing}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[0.875rem] font-medium text-B2Cgray">{FormFields.DOB}</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          type="date"
                          id="dob"
                          {...field}
                          disabled={!isEditing}
                          value={field.value}
                          onChange={(e) => {
                            form.setValue('dob', e.target.value);
                          }}
                          className="h-12 w-full rounded-sm border border-border pr-12 text-sm font-medium text-B2CAgrayn placeholder:text-gray-400 md:text-base [&::-webkit-calendar-picker-indicator]:hidden"
                        />
                        <img
                          src="/images/calendar.svg"
                          alt="Calendar Icon"
                          className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 cursor-pointer"
                          onClick={() => {
                            const input = document.getElementById('dob') as HTMLInputElement;
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
            <h2 className="my-8 text-base font-medium text-B2CAgrayn">{FormFields.ADDRESS}</h2>
            <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              <FormField
                control={form.control}
                name="loginCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[0.875rem] font-medium text-B2Cgray">{FormFields.COUNTRY}</FormLabel>
                    <Input
                      placeholder="Select Country"
                      disabled
                      autoComplete="off"
                      {...field}
                      value={field.value}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        field.onChange(value);
                        // setIsDirty(true);
                      }}
                      className="md:text-basee h-12 border-borderad text-sm font-medium text-B2CAgrayn"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[0.875rem] font-medium text-B2Cgray">{FormFields.STATE}</FormLabel>
                    <SelectDropdown
                      name={field.name}
                      data={states || []}
                      disabled={!isEditing}
                      value={selectedState}
                      onChange={(selectedOption) => {
                        setSelectedState(selectedOption);
                        form.setValue('stateId', selectedOption?.id);
                        setSelectedCity(null);
                        form.setValue('city', 0);
                        setCity([]);
                      }}
                      placeholder="Select State"
                      placeholderColor="text-B2Cgray"
                      borderRadius="!rounded-[0.375rem]"
                      color="text-B2CAgrayn"
                      height="h-12"
                      width="w-full"
                      borderColor="border-borderad"
                      placeholderSize="text-sm md:text-base"
                      dropdownBg={false}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[0.875rem] font-medium text-B2Cgray">{FormFields.CITY}</FormLabel>
                    <SelectDropdown
                      name={field.name}
                      disabled={!isEditing}
                      data={city || []}
                      value={selectedCity}
                      onChange={(selectedOption) => {
                        setSelectedCity(selectedOption);
                        form.setValue('city', selectedOption?.id);
                      }}
                      emptyLabel="No City Found"
                      placeholder="Select City"
                      borderRadius="!rounded-[0.375rem]"
                      color="text-B2CAgrayn"
                      placeholderColor="text-B2Cgray"
                      height="h-12"
                      width="w-full"
                      fontsize="text-base"
                      borderColor="border-borderad"
                      placeholderSize="text-sm md:text-base"
                      dropdownBg={false}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[0.875rem] font-medium text-B2Cgray">{FormFields.ZIP_CODE}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Zip-code"
                        autoComplete="off"
                        disabled={!isEditing}
                        {...field}
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          field.onChange(value);
                        }}
                        className="md:text-basee h-12 border-borderad text-sm font-medium text-B2CAgrayn"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[0.875rem] font-medium text-B2Cgray">{FormFields.ADDRESS}</FormLabel>
                  <FormControl>
                    <Textarea
                      //  readOnly={type === FormType.VIEW}
                      placeholder=""
                      disabled={!isEditing}
                      color="secondary"
                      className="text-sm font-medium text-B2CAgrayn md:text-base"
                      data-test-id="standard-description"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default MyProfileDetails;
