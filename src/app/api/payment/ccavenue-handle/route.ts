import CCAvenue from '@/components/payment/lib/ccavenue';
import { postPaymentDetails } from '@/utils/api/payment';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    try {
        const bodyText = await req.text();
        const params = new URLSearchParams(bodyText);
        const encResp = params.get('encResp');
        if (!encResp) {
            return NextResponse.json({ error: 'Missing encResp parameter' }, { status: 400 });
        }
        const data: any = CCAvenue.redirectResponseToJson(encResp);
        const paymentDetails = {
            studentId: Number(data.merchant_param1),
            packageId: Number(data.merchant_param2),
            subscriptionId: Number(data.merchant_param3),
            streamId: Number(data.merchant_param4),
            orderId: data.order_id,
            trackingId: data.tracking_id,
            bankRefNumber: data.bank_ref_no,
            orderStatus: data.order_status,
            failureMessage: data.failure_message,
            paymentMode: data.payment_mode,
            cardName: data.card_name,
            currency: data.currency,
            amount: data.amount,
            billingName: data.billing_name,
            billingAddress: data.billing_address,
            billingCity: data.billing_city,
            billingState: data.billing_state,
            billingZip: data.billing_zip,
            billingCountry: data.billing_country,
            billingEmail: data.billing_email,
            billingDate: data.trans_date
        };
        
        await postPaymentDetails(paymentDetails);
        if (data.order_status === "Success") {
            return NextResponse.redirect(`${baseUrl}/payment/success`);
        } else {
            return NextResponse.redirect(`${baseUrl}/payment/failure`);
        }
    } catch (error) {
        console.error('Error processing CCAvenue request:', error);
        return NextResponse.redirect(`${baseUrl}/payment/failure`);
    }
}
