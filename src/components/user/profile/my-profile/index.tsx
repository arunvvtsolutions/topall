'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormFields, HeadersTitle } from '@/types/enum';
import ExamDetails from './exam';
import MyProfileDetails from './my-profile-details';

const MyProfile = () => {
  return (
    <div>
      <h2 className="my-3 text-base font-medium text-B2CAgrayn md:my-5 md:text-[1.5rem]">{HeadersTitle.ACCOUNT_SETTINGS}</h2>
      <div className="px:3 rounded-[0.5rem] border bg-white py-3 md:px-6 md:py-10">
        <Tabs defaultValue="profile-details" className="flex w-full flex-col md:flex-row">
          {/* Sidebar Tabs List (20%) */}
          <TabsList className="w-2/10 flex flex-shrink-0 flex-row flex-nowrap overflow-x-auto border-r p-1 pr-3 md:flex-col md:flex-wrap md:p-3 md:pr-10">
            <TabsTrigger
              value="profile-details"
              className="w-full justify-start gap-4 border-b-2 border-l-2 border-r-2 border-t-2 !border-b-transparent !border-r-transparent !border-t-transparent border-l-transparent pl-2 text-sm font-normal text-B2Cgray !shadow-none data-[state=active]:border-primary data-[state=active]:text-primary md:border-b-4 md:border-l-4 md:border-r-4 md:border-t-4 md:pl-4 md:text-[1.125rem]"
            >
              {FormFields.MY_PROFILE}
            </TabsTrigger>
            <TabsTrigger
              value="exam-details"
              className="w-full justify-start gap-4 border-b-2 border-l-2 border-r-2 border-t-2 !border-b-transparent !border-r-transparent !border-t-transparent border-l-transparent pl-2 text-sm font-normal text-B2Cgray !shadow-none data-[state=active]:border-primary data-[state=active]:text-primary md:border-b-4 md:border-l-4 md:border-r-4 md:border-t-4 md:pl-4 md:text-[1.125rem]"
            >
              {FormFields.EXAM}
            </TabsTrigger>
            {/* <TabsTrigger
                value="tab3"
                className="w-full justify-start gap-4 border-b-2 border-l-2 border-r-2 border-t-2 !border-b-transparent !border-r-transparent !border-t-transparent border-l-transparent pl-2 text-sm font-normal text-B2Cgray !shadow-none data-[state=active]:border-primary data-[state=active]:text-primary md:border-b-4 md:border-l-4 md:border-r-4 md:border-t-4 md:pl-4 md:text-[1.125rem]"
              >
                {FormFields.BILLING_DETAILS}
              </TabsTrigger> */}
          </TabsList>

          {/* Right Side Content (80%) */}
          <div className="w-8/10 min-w-0 flex-grow">
            <TabsContent value="profile-details">
              <MyProfileDetails />
            </TabsContent>
            <TabsContent value="exam-details">
              <ExamDetails />
            </TabsContent>
            {/* <TabsContent value="billing-details">
                <p className="p-10">Billing Details will display soon.</p>
              </TabsContent> */}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MyProfile;
