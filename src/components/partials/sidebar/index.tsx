'use client';
import React, { useEffect } from 'react';
import SidebarContent from './sidebar-content';
import Logo from '@/components/logo';
import { Menu } from './menu';
import { useSession } from 'next-auth/react';
import { Roles, TosterMessages } from '@/types/enum';
import { getProfileDetail } from '@/utils/api/user';
import { setUserProfileSuccess } from '@/store/slice/user/userProfileSlice';
import { useDispatch, useSelector } from '@/store';
import {
  setProfileDetailsSucess,
  setStandardSuccess,
  setStreamSelection,
  setStreamsSuccess,
  setUserIdSuccess
} from '@/store/slice/user';
import { setStreamSelectionSuccess } from '@/store/slice/user/stream-slice';
import { toast } from 'sonner';
import { getTestTypeByStreamId } from '@/store/slice/user/testType';
import { getLocalStorageData } from '@/utils';

const Sidebar = () => {
  const { data } = useSession();
  const dispatch = useDispatch();
  const { stream } = useSelector((state) => state.stream);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        if (data && data?.user?.mobileNumber) {
          // Ensure mobileNumber is defined
          const profileResponse = await getProfileDetail(data.user.mobileNumber);

          dispatch(setUserProfileSuccess(profileResponse));

          const profileData = {
            name: profileResponse.name,
            email: profileResponse.email,
            phone: profileResponse.mobileNumber,
            gender: profileResponse.gender,
            dob: profileResponse.dob,
            standard: profileResponse.standard,
            address: profileResponse.address,
            country: profileResponse.loginCountry,
            state: profileResponse.state,
            city: profileResponse.city,
            zip_code: profileResponse.zipCode,
            role: profileResponse.role.role,
            currentExams: profileResponse.currentExams,
            referLevel: profileResponse.referLevel
          };

          const userSelectedStream = getLocalStorageData('stream');

          const streamSelection = {
            stream: userSelectedStream || profileResponse.currentExams?.[0],
            standards: profileResponse.standard
          };

          dispatch(setStreamsSuccess(profileResponse.currentExams));
          dispatch(setUserIdSuccess(profileResponse.userId));
          dispatch(setStandardSuccess(profileResponse.standard));
          dispatch(setProfileDetailsSucess(profileData));
          if (data.user.role === Roles.STUDENT) {
            dispatch(setStreamSelectionSuccess(streamSelection));
            await setStreamSelection(profileResponse.currentExams[0]?.id);
          }
        }
      } catch (error) {
        console.log('error', error);
        toast.error(TosterMessages.ADMIN_COMMON_ERROR);
      }
    };
    if (data?.user?.mobileNumber) {
      getProfileData();
    }
  }, [data?.user?.mobileNumber]);

  useEffect(() => {
    if (stream?.id) {
      dispatch(getTestTypeByStreamId(stream?.id));
    }
  }, [stream?.id]);

  return (
    <SidebarContent>
      <Menu />
    </SidebarContent>
  );
};

export default Sidebar;
