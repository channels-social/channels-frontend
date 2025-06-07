import axios from "axios";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const handlePayment = async (amount, myData) => {
  const res = await loadRazorpayScript();
  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }
  const currency = "INR";

  try {
    const { data: order } = await axios.post(
      "http://localhost:3000/api/create-order",
      {
        amount,
        currency,
      }
    );

    const options = {
      key: "rzp_live_w50CppHJGDmkhe",
      amount: order.amount,
      currency: order.currency,
      name: "Channels.social",
      description: "Test Transaction",
      image:
        "https://chips-social.s3.ap-south-1.amazonaws.com/channelsWebsite/logo.svg",
      order_id: order.id,
      handler: async function (response) {
        // const verification = await axios.post(
        //   "http://localhost:5000/verify-payment",
        //   {
        //     razorpay_order_id: response.razorpay_order_id,
        //     razorpay_payment_id: response.razorpay_payment_id,
        //     razorpay_signature: response.razorpay_signature,
        //   }
        // );
        // alert(verification.data.status);
        console.log(response);
        alert("Payment Successful!");
      },
      prefill: {
        name: myData?.fullName || myData?.username,
        email: myData?.email,
        contact: myData?.contact || myData?.whatsapp_number || "",
      },
      notes: {
        address:
          "No. 261/1, SY No. 12/1, AECS Layout Sanjay Nagar, Bangalore, Karnataka, 560094",
      },
      theme: {
        color: "#202020",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error(error);
  }
};
