import axios from "axios";
import crypto from "crypto";
import { NextResponse } from "next/server";

const salt_key = "96434309-7796-489d-8924-ab56988a6076";
const merchant_id = "PGTESTPAYUAT86";

export async function POST(req) {
  try {
    const reqData = await req.json();
    const merchantTransactionId = reqData.transactionId;

    const data = {
      merchantId: merchant_id,
      merchantTransactionId: merchantTransactionId,
      name: reqData.name,
      amount: reqData.amount * 100, // Convert amount to smallest unit (e.g., paise)
      redirectUrl: `http://localhost:3000/api/status?id=${merchantTransactionId}`,
      redirectMode: "POST",
      callbackUrl: `http://localhost:3000/api/status?id=${merchantTransactionId}`,
      mobileNumber: reqData.phone,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + salt_key;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;

    const prod_URL =
      "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";

    const options = {
      method: "POST",
      url: prod_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    // Make the API request
    const response = await axios(options);
    console.log("PhonePe Response:", response.data);

    // Return JSON response to frontend
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error initiating payment:", error);

    // Return error response to frontend
    return NextResponse.json(
      { error: "Payment initiation failed", details: error.message },
      { status: 500 }
    );
  }
}
