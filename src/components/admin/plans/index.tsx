'use client';
import AdminSectionHeader from '@/components/common/admin-header';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlanCard } from './plan-card';
import { AddPlanCard } from './add-plan-card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { FormType, IPackagePlan, IPackagePlans, TosterMessages } from '@/types/enum';
import md5 from 'md5';
import { profile } from '@/utils/mock-password';
import PasswordConfirmationModal from '@/components/common/password-confirmation-modal';
import DeleteConfirmationModal from '@/components/delete-confirmation-dialog';
import PackagePlanModal from './forms/plan-form';
import { useDispatch, useSelector } from '@/store';
import { getPackagePlan } from '@/store/slice/admin/packages';
import { GenericType } from '@/types';
import { archiveUnarchivePackagePlan, deletePackagePlan } from '@/utils/api/packages';
import { HttpStatus } from '@/types/constants';
import { getStandards, getStreams } from '@/store/slice/admin/academic';
import ArchiveUnarchiveModal from './forms/archive-unarchive-modal';

const ARCHIVE_ID = -1; // Constant ID for ARCHIVE tab

const PackagePlans = () => {
  const dispatch = useDispatch();
  const { packages } = useSelector((state) => state.packagePlan);
  const { streams } = useSelector((state) => state.selectors);

  const [formType, setFormType] = useState<FormType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPlanModal, setShowPlanModal] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState<number>(0); // now using number
  const [allTabs, setAllTabs] = useState<GenericType[]>([]);
  const [plans, setPlans] = useState<IPackagePlan[] | null>(null);
  const [planId, setPlanId] = useState<number>(0);
  const [singlePlan, setSinglePlan] = useState<IPackagePlan | null>();
  const [archiveUnarchive, setArchiveUnarchive] = useState<boolean>(false);
  const [archive, setArchive] = useState<boolean>(false);

  const showAddPlanCard = tabValue !== ARCHIVE_ID;

  // Tab Change Handler
  const handleTabChange = (value: string) => {
    const id = parseInt(value);
    setTabValue(id);
  };

  // Plan Delete Handler
  const handleDeletePlan = (id: number) => {
    setPlanId(id);
    setShowPassword(true);
  };

  // Plan Archive Unarchive Handler
  const handleArchiveUnarchivePlan = (id: number, archive: boolean) => {
    setPlanId(id);
    setArchiveUnarchive(true);
    setArchive(archive);
  };

  // Plan Archive Unarchive Confirmation Handler
  const handleArchiveUnarchivePlanConfirmation = async () => {
    try {
      const response = await archiveUnarchivePackagePlan(planId);
      if (response.statusCode === HttpStatus.OK) {
        if (archive) toast.success(TosterMessages.PLAN_ARCHIVE_SUCCESS);
        else toast.success(TosterMessages.PLAN_UNARCHIVE_SUCCESS);
      } else {
        if (archive) toast.error(TosterMessages.PLAN_ARCHIVE_FAIL);
        else toast.error(TosterMessages.PLAN_UNARCHIVE_FAIL);
      }
      dispatch(getPackagePlan());
    } catch (error) {
      console.log('error', error);
    } finally {
      setArchiveUnarchive(false);
      setArchive(false);
      setPlanId(0);
    }
  };

  // Plan Edit Handler
  const handleEditPlan = (id: number) => {
    const singlePlan = plans && plans.find((plan) => plan.id === id);
    setSinglePlan(singlePlan);
    setPlanId(id);
    setFormType(FormType.EDIT);
    setShowPlanModal(true);
  };

  // Plan Delete Confirmation Handler
  const handleDeleteConfirm = async () => {
    try {
      const response = await deletePackagePlan(planId);
      if (response.statusCode === HttpStatus.OK) {
        toast.success(TosterMessages.PLAN_DELETE_SUCCESS);
      } else {
        toast.error(TosterMessages.PLAN_DELETE_FAIL);
      }
    } catch (error) {
      console.log('error', error);
      toast.error(TosterMessages.PLAN_DELETE_FAIL);
    } finally {
      dispatch(getPackagePlan());
      setShowDeleteModal(false);
      setPlanId(0);
    }
  };

  // Password Confirmation Handler
  const passwordConfirmHandler = async (pass: string) => {
    try {
      if (profile.user.publish_password == md5(pass)) {
        setShowPassword(false);
        setShowDeleteModal(true);
      } else {
        toast.error(TosterMessages.ADMIN_PASSWORD_ERROR);
        setShowPassword(false);
      }
    } catch (error) {
      toast.error(TosterMessages.PLAN_DELETE_FAIL);
      setShowPassword(false);
    }
  };

  useEffect(() => {
    if (tabValue === ARCHIVE_ID) {
      const archivedPlans = packages.flatMap((p: IPackagePlans) => p.packagePlans).filter((plan: IPackagePlan) => !plan.isActive);
      setPlans(archivedPlans);
    } else {
      const selectedStream = packages.find((p: IPackagePlans) => p.streamId === tabValue);
      const activePlans = selectedStream?.packagePlans.filter((plan: IPackagePlan) => plan.isActive) || [];
      setPlans(activePlans);
    }
  }, [tabValue, packages]);

  useEffect(() => {
    setAllTabs([...streams, { id: ARCHIVE_ID, name: 'ARCHIVE' }]);

    // Set initial tabValue to the first streamId if not already set
    if (streams.length > 0 && tabValue === 0) {
      setTabValue(streams[0].id);
    }
  }, [streams]);

  useEffect(() => {
    dispatch(getPackagePlan());
    dispatch(getStandards());
    dispatch(getStreams());
  }, []);

  return (
    <div className="mx-2 h-full min-h-[calc(100vh-5.97rem)] sm:mx-2 md:mx-2 lg:mx-2 xl:mx-6">
      <AdminSectionHeader title="Package Plans" action={<></>} />
      <div className="w-full">
        <div className="mb-6 flex items-center justify-between">
          <Tabs value={String(tabValue)} onValueChange={handleTabChange} className="w-full">
            <div className="flex items-end justify-between !p-0">
              <TabsList className="flex w-full justify-between p-0">
                <div className="flex">
                  {streams.map((stream) => (
                    <TabsTrigger
                      key={stream.id}
                      className={`mr-2 border-primary bg-transparent text-base font-medium text-[#222222] ${
                        tabValue === stream.id
                          ? 'border-b-2 text-[#222222] data-[state=active]:bg-transparent data-[state=active]:text-[#222222]'
                          : 'data-[state=active]:bg-transparent data-[state=active]:text-[#222222]'
                      } md:text-base lg:text-lg`}
                      value={String(stream.id)}
                    >
                      {stream.name}
                    </TabsTrigger>
                  ))}
                </div>

                <div className="flex items-center">
                  <Separator orientation="vertical" className="h-6 bg-[#4B4B4B]" />
                  <TabsTrigger
                    className={`ml-2 cursor-pointer bg-transparent text-base font-medium ${
                      tabValue === ARCHIVE_ID ? 'border-b-2 border-primary text-primary' : 'text-[#222222]'
                    } data-[state=active]:bg-transparent md:flex md:text-lg lg:text-lg`}
                    value={String(ARCHIVE_ID)}
                  >
                    Archive
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>

            <Separator className="bg-[#10101026]" />

            {allTabs.map((tab) => (
              <TabsContent key={tab.id} value={String(tab.id)} className="mt-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
                  {plans && plans.length > 0
                    ? plans.map((plan) => (
                        <PlanCard
                          key={plan.id}
                          onEdit={handleEditPlan}
                          onDelete={handleDeletePlan}
                          onArchiveUnarchive={handleArchiveUnarchivePlan}
                          plan={plan}
                          isArchiveTab={tabValue === ARCHIVE_ID}
                          stream={packages.find((stream: any) => stream.packagePlans.some((p: any) => p.id === plan.id))}
                        />
                      ))
                    : tabValue === ARCHIVE_ID && (
                        <div className="col-span-full flex h-60 items-center justify-center text-lg text-gray-500">
                          No plans found
                        </div>
                      )}
                  {showAddPlanCard && (
                    <AddPlanCard
                      onCreate={() => {
                        setFormType(FormType.ADD);
                        setShowPlanModal(true);
                      }}
                    />
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteConfirmationModal
          open={showDeleteModal}
          message={'Are you sure you want to delete this plan?'}
          onClose={() => {
            setShowDeleteModal(false);
            setPlanId(0);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {archiveUnarchive && (
        <ArchiveUnarchiveModal
          open={archiveUnarchive}
          message={archive ? 'Are you sure you want to archive this plan?' : 'Are you sure you want to unarchive this plan?'}
          onClose={() => {
            setArchiveUnarchive(false);
            setPlanId(0);
          }}
          onConfirm={handleArchiveUnarchivePlanConfirmation}
        />
      )}

      {showPassword && (
        <PasswordConfirmationModal
          open={showPassword}
          onClose={() => {
            setShowPassword(false);
            setPlanId(0);
          }}
          onConfirm={passwordConfirmHandler}
        />
      )}

      {showPlanModal && (
        <PackagePlanModal
          onClose={() => {
            setFormType(null);
            setShowPlanModal(false);
            dispatch(getPackagePlan());
            setSinglePlan(null);
          }}
          open={showPlanModal}
          type={formType}
          streamId={tabValue}
          initialData={singlePlan}
        />
      )}
    </div>
  );
};

export default PackagePlans;
