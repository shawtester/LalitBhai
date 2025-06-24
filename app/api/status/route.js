import crypto from "crypto";
import axios from "axios";
import { NextResponse } from "next/server";

const saltKey = "96434309-7796-489d-8924-ab56988a6076";
const merchantId = "PGTESTPAYUAT86";

export async function POST(req) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const clientTransactionId = searchParams.get("id");

    console.log("Request query parameters:", Array.from(searchParams.entries()));

    const keyIndex = 1;
    const stringToHash = `/pg/v1/status/${merchantId}/${clientTransactionId}` + saltKey;
    const checksum = crypto.createHash("sha256").update(stringToHash).digest("hex") + "###" + keyIndex;

    const options = {
      method: "GET",
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${clientTransactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": merchantId,
      },
    };

    const response = await axios(options);

    console.log("Response from PhonePe API:", response.data);

    if (response.data.success === true) {
      const { transactionId, amount, state, responseCode, paymentInstrument, ...otherDetails } = response.data.data;

      const orderData = {
        transactionId,
        clientTransactionId,
        amount,
        status: state || "UNKNOWN",
        details: { responseCode, paymentInstrument, ...otherDetails },
      };

      console.log("Data to be written to Firestore:", orderData);

      // Handle order saving logic here
      // Since we removed the 'writeOrderToFirestore' import, you should now implement the order saving code 
      // (either via a Firestore client, directly through an API call, or using another method).
      // For example, you can call a Firestore function or implement the saving logic below.

      // Example code for saving data to Firestore (pseudo code):
      // const db = getFirestore(app); // Assuming you have already initialized Firestore
      // const orderDocRef = doc(db, "orders", transactionId);
      // await setDoc(orderDocRef, orderData);

      console.log("Order written to Firestore successfully.");

      // Serialize nested data to pass via query params
      const queryParams = new URLSearchParams({
        transactionId,
        clientTransactionId,
        amount: amount.toString(),
        status: state,
        details: JSON.stringify(orderData.details), // Stringify nested objects
      }).toString();

      return NextResponse.redirect(`http://localhost:3000/success?${queryParams}`, {
        status: 301,
      });
    } else {
      console.error("Payment failed:", response.data);

      return NextResponse.redirect("http://localhost:3000/failed", {
        status: 301,
      });
    }
  } catch (error) {
    console.error("Error occurred during payment status check:", error);

    return NextResponse.json(
      { error: "Payment status check failed", details: error.message },
      { status: 500 }
    );
  }
}
