import React, { useState } from "react";
import Logo from "../../../assets/icons/logo.svg";
import { axios } from "axios";
import Modal from "./PricingModal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const PricingCard = ({
  title,
  price,
  priceSuffix,
  description,
  features,
  buttonText,
  badge,
  originalPrice,
  originalAnnualPrice,
  annualPrice,
  type,
}) => {
  const [openInfoIndex, setOpenInfoIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const myData = useSelector((state) => state.myData);
  const navigate = useNavigate();

  const handleInfoOpen = (index) => setOpenInfoIndex(index);
  const handleInfoClose = () => setOpenInfoIndex(null);

  const handleStartClick = () => {
    if (buttonText === "Get started for free") {
      if (!isLoggedIn) {
        navigate("/get-started");
      } else {
        navigate(`/user/${myData.username}/profile`);
      }
    } else if (buttonText !== "Talk to sales") {
      setIsModalOpen(true);
      // openRazorpayTestCheckout();
    }
  };

  const getAmountInPaise = () => {
    const amountStr = type === "monthly" ? price : annualPrice;
    if (!amountStr) return 0;

    const clean = amountStr.replace(/[₹,]/g, "").trim();
    const number = parseInt(clean, 10);

    return isNaN(number) ? 0 : number * 100;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const openRazorpayTestCheckout = async () => {
    const amount = getAmountInPaise();
    if (!amount || amount <= 0) {
      alert("Invalid amount. Cannot proceed to payment.");
      return;
    }
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Failed to load Razorpay script. Are you online?");
      return;
    }

    const options = {
      key: "rzp_test_QOoM6OtgVZgTuW",
      amount: 2500,
      currency: "INR",
      name: "Channels.social",
      description: `${title} Plan Subscription`,
      image: "https://chips-social.s3.ap-south-1.amazonaws.com/logo.png",
      handler: function (response) {
        alert("✅ Payment successful: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3f83f8",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="bg-theme-pricingBackground rounded-lg p-6 flex flex-col relative space-y-4">
      <div className="flex flex-row justify-between items-center">
        <div className="text-white text-lg font-light">{title}</div>

        {badge && (
          <div className=" bg-[#CAD83C] text-black text-xs px-2 py-1 rounded-full">
            {badge}
          </div>
        )}
      </div>
      <div className="text-white text-2xl font-light flex items-center space-x-2">
        <span className="font-normal">
          {type === "monthly" ? price : annualPrice}
        </span>
        <span className="flex flex-col justify-start">
          {type === "monthy" && originalPrice && (
            <span className="text-xs text-theme-emptyEvent line-through">
              {originalPrice}
            </span>
          )}
          {type === "annually" && originalAnnualPrice && (
            <span className="text-xs text-theme-emptyEvent line-through">
              {originalAnnualPrice}
            </span>
          )}
          {priceSuffix && (
            <span className="text-xs font-extralight -pt-0.5">
              {type === "monthly" ? priceSuffix : "/year"}
            </span>
          )}
        </span>
      </div>
      {description && (
        <p className="text-xs text-white font-extralight">{description}</p>
      )}

      {buttonText !== "Talk to sales" && (
        <button
          className={`${
            buttonText === "Get started for free"
              ? "bg-theme-buttonEnable text-white "
              : "border border-white text-white"
          } text-sm py-2 rounded-lg  font-light`}
          onClick={handleStartClick}
        >
          {buttonText}
        </button>
      )}
      {buttonText === "Talk to sales" && (
        <a
          href="https://calendly.com/channels_social/talk-to-us"
          target="_blank"
          rel="noopener noreferrer"
          className={`${"border border-white text-white"} text-center text-sm py-2 rounded-lg  font-light`}
          onClick={handleStartClick}
        >
          {buttonText}
        </a>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={title}
      />
      {buttonText !== "Get started for free" &&
        buttonText !== "Talk to sales" && (
          <a
            href="https://calendly.com/channels_social/talk-to-us"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-white text-center text-sm py-2  font-light`}
          >
            Talk to sales
          </a>
        )}
      <ul className="text-white font-light text-sm space-y-2 pt-2">
        <p className="text-[#898989] text-sm font-light">
          {buttonText === "Get started for free"
            ? "Features:"
            : buttonText === "Talk to sales"
            ? ""
            : "Core Features:"}
        </p>
        {features.map(
          (feature, index) =>
            feature.available && (
              <li key={index} className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${
                    feature.available ? "text-white" : "text-[#898989]"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      feature.available
                        ? "M5 13l4 4L19 7" // Tick
                        : "M6 18L18 6M6 6l12 12" // Cross
                    }
                  />
                </svg>
                <span>{feature.name}</span>
                {feature.info && (
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5 text-white cursor-pointer ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      onMouseEnter={() => handleInfoOpen(index)}
                      onMouseLeave={handleInfoClose}
                      onClick={() => handleInfoOpen(index)}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"
                      />
                    </svg>

                    {openInfoIndex === index && (
                      <div className="absolute top-6 left-0 w-40 bg-[#333333]  text-white font-light text-sm rounded-md shadow-lg p-2 z-50">
                        {feature.info.map((line, i) => (
                          <p key={i} className="text-xs py-1">
                            {line}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </li>
            )
        )}
      </ul>
    </div>
  );
};

export default PricingCard;
