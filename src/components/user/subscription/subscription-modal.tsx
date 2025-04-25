import { LucideLoader } from '@/components/common/LucideLoader';
import { MainDialog } from '@/components/common/MainDialog';
import CCAvenue from '@/components/payment/lib/ccavenue';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useSelector } from '@/store';
import { GenericType, Subscription } from '@/types';
import { UserProfileType } from '@/types/user';
import { getProfileCity, getProfileDetail, getProfileState } from '@/utils/api/user';
import { Check } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface SubscriptionModalProps {
  data: Subscription[];
  title: string;
  open: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ data, title, open, onClose }) => {
  const router = useRouter();
  const userProfile = useSelector((state) => state.userProfile);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(data[0].id);
  const [states, setStates] = useState<GenericType[]>([]);
  const [city, setCity] = useState<GenericType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  //create payment data
  const createPaymentRequestData = (userData: any, subscriptionData: any) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const merchantId = process.env.NEXT_PUBLIC_CCAVENUE_MERCHANT_ID;
    const finalPrice = calculateFinalPrice(subscriptionData);

    return {
      merchant_id: Number(merchantId),
      order_id: `TA-${Math.floor(Math.random() * 99999) + 10000}`,
      amount: String(finalPrice),
      currency: 'INR',
      billing_email: userData.email,
      billing_name: userData.name,
      billing_address: userData.address,
      billing_city: userData.city ?? '',
      billing_state: userData.state ?? '',
      billing_zip: userData.zipCode ?? '',
      billing_country: userData.loginCountry,
      redirect_url: `${baseUrl}/api/payment/ccavenue-handle`,
      cancel_url: `${baseUrl}/api/payment/ccavenue-handle`,
      merchant_param1: String(userData.userId), // studentId
      merchant_param2: String(subscriptionData.packagePlanId), // packageId
      merchant_param3: String(selectedSubscription), //subscriptionId
      merchant_param4: String(subscriptionData.stream), // streamId
      language: 'EN',
      billing_tel: userData.mobileNumber
    };
  };

  //calculate amount price
  const calculateFinalPrice = (subscriptionData: any) => {
    const subAmount = subscriptionData?.subscriptionAmountData[0];
    return subAmount.actual_price - subAmount.discount_price;
  };

  //submit payment
  const handlePaymentSubmit = async () => {
    setLoading(true);
    try {
      const subscriptionData = data.find((d) => d.id === selectedSubscription);
      if (!subscriptionData) return;

      const { state: stateId, city: cityId } = userProfile;
      const stateName = states
        .find((state) => state.id === stateId)
        ?.name.trim()
        .replace(/[()]/g, '');
      const cityName = city
        .find((city) => city.id === cityId)
        ?.name.trim()
        .replace(/[()]/g, '');

      const userData = { ...userProfile, state: stateName, city: cityName };

      const paymentRequestData = createPaymentRequestData(userData, subscriptionData);

      let encReq = CCAvenue.getEncryptedOrder(paymentRequestData);
      const accessCode = process.env.NEXT_PUBLIC_CCAVENUE_ACCESS_CODE;
      const paymentUrl = process.env.NEXT_PUBLIC_CCAVENUE_URL;
      let URL = `${paymentUrl}&merchant_id=${paymentRequestData.merchant_id}6&encRequest=${encReq}&access_code=${accessCode}`;
      router.push(URL);
      // onClose();
    } catch (error) {
      toast.error('Payment Failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCityAndState = async () => {
      try {
        const statesResponse = await getProfileState();
        const citiesResponse = await getProfileCity(userProfile.state ?? 0);
        setStates(statesResponse);
        setCity(citiesResponse);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };
    fetchCityAndState();
  }, [userProfile.state]);
  return (
    <MainDialog title={`${title} Subscription`} isOpen={open} size="md" onOpenChange={onClose}>
      <Separator className="bg-[#10101026]" />
      <div className="px-0 py-0">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {data.length > 0 &&
            data.map((plan) => {
              return (
                plan.subscriptionAmountData.length > 0 && (
                  <div
                    key={plan.id}
                    className={cn(
                      'relative flex cursor-pointer items-center justify-between rounded-lg border bg-white p-4',
                      selectedSubscription === plan.id ? 'border-primary' : 'border-borderad'
                    )}
                    onClick={() => setSelectedSubscription(plan.id)}
                  >
                    {/* Left-aligned plan details */}

                    <div className="flex flex-1 flex-col items-start">
                      <div className="text-sm font-medium text-[#222222] md:text-base">{plan.name}</div>
                      <div className="mt-2">
                        <span className="text-lg font-medium text-B2Cgray line-through md:text-xl">
                          ₹{plan.subscriptionAmountData[0]?.actual_price}
                        </span>
                        <span className="pl-1 text-xl font-semibold text-[#222222] md:text-2xl">
                          ₹{plan.subscriptionAmountData[0]?.actual_price - plan.subscriptionAmountData[0]?.discount_price}
                        </span>
                      </div>
                    </div>

                    {/* Right-aligned checkmark */}
                    <div>
                      {selectedSubscription === plan.id ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                          <Check className="h-3.5 w-3.5 text-white" />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full border border-gray-300" />
                      )}
                    </div>
                  </div>
                )
              );
            })}
        </div>

        <div className="mt-6 flex items-center justify-center">
          <Button
            onClick={handlePaymentSubmit}
            variant="default"
            color="primary"
            className="w-full gap-2 text-sm font-medium md:max-w-md md:text-base"
            disabled={loading}
          >
            {loading && <LucideLoader />}
            Proceed
          </Button>
        </div>
      </div>
    </MainDialog>
  );
};

export default SubscriptionModal;
