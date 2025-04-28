"use client"
import { useRouter } from "next/navigation";
import CCAvenue from "./lib/ccavenue";


export default function Payment() {

    const host = "http://www.localhost.com";
    const router = useRouter();
    const merchantId=process.env.NEXT_PUBLIC_CCAVENUE_MERCHANT_ID;
    const accessCodeData = process.env.NEXT_PUBLIC_CCAVENUE_ACCESS_CODE;
    const paymentCCAvenue = () => {
        let paymentData = {
            merchant_id: Number(merchantId),
            order_id: "ORD123",
            amount: "1",
            currency: "INR",
            billing_email: "hariharan5235@gmail.com",
            billing_name: "Hariharan",
            billing_address: "Address Details",
            billing_city: "Ahmedabad",
            billing_state: "Gujarat",
            billing_zip: "380002",
            billing_country: "India",
            redirect_url: `${host}/api/payment/ccavenue-handle`,
            cancel_url: `${host}/api/payment/ccavenue-handle`,
            merchant_param1: "1",   //studentId
            merchant_param2: "15", //packageId
            merchant_param3: "1", //subscriptionId
            language: 'EN',
            billing_tel: "1234567890"
        }

        let encReq = CCAvenue.getEncryptedOrder(paymentData);
        let accessCode = accessCodeData;
        let URL = `https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction&merchant_id=${paymentData.merchant_id}6&encRequest=${encReq}&access_code=${accessCode}`;
        router.push(URL);
    }

    return (
        <>
            <button onClick={paymentCCAvenue}>Pay Now</button>
        </>
    )
}