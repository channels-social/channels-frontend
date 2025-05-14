import { React, useState, Footer } from "../../globals/imports";
import PricingCard from "./widgets.js/PricingCard";
import PricingImage from "../../assets/icons/pricing_card.svg";

const plans = [
  {
    title: "Basic",
    price: "₹0",
    annualPrice: "₹0",
    description: "Get started for free with all the community essentials",
    buttonText: "Get started for free",
    features: [
      { name: "1 Community", available: true },
      { name: "Total 50 users", available: true },
      { name: "Unlimited free events", available: true },
      { name: "Auto Login", available: false },
      { name: "Newsletters", available: false },
      { name: "Analytics", available: false },
      { name: "Integration support", available: false },
      { name: "Community Manager", available: false },
      { name: "In App Notifications", available: false },
      { name: "Chat summary", available: false },
    ],
  },
  {
    title: "Pro",
    price: "₹249",
    annualPrice: "₹2,499",
    priceSuffix: "/month",
    originalPrice: "₹299",
    originalAnnualPrice: "₹2,999",
    description:
      "Unlock powerful tools to grow, engage, and customise your community.",
    buttonText: "Get started with Pro",
    badge: "Limited time offer",
    features: [
      { name: "Up to 4 Communities", available: true },
      { name: "Total 400 users", available: true },
      { name: "Unlimited free and paid events", available: true },
      { name: "Auto Login", available: true },
      { name: "5 monthly Newsletters", available: true },
      {
        name: "Basic analytics",
        available: true,
        info: ["Total users", "Total chats", "Active users"],
      },
      { name: "Integration support", available: false },
      { name: "Community Manager", available: false },
      { name: "In App Notifications", available: false },
      { name: "Chat summary", available: false },
    ],
  },
  {
    title: "Business",
    price: "₹449",
    annualPrice: "₹4,499",
    priceSuffix: "/month",
    originalPrice: "₹599",
    originalAnnualPrice: "₹5,499",
    buttonText: "Get started with Business",
    description:
      "Scale your community with advanced integrations and analytics.",
    badge: "Limited time offer",
    features: [
      { name: "Up to 8 Communities", available: true },
      { name: "Total 800 users", available: true },
      { name: "Unlimited free and paid events", available: true },
      { name: "Auto Login", available: true },
      { name: "10 monthly Newsletters", available: true },
      {
        name: "Advanced analytics",
        available: true,
        info: [
          "Total users",
          "Total chats",
          "Active users",
          "New joining users",
          "Most active topic",
          "Media shared count",
        ],
      },
      { name: "Integration support", available: true },
      { name: "Community Manager", available: true },
      { name: "In App Notifications", available: true },
      { name: "Per topic chat summary", available: true },
    ],
  },
  {
    title: "Enterprise",
    price: "Custom pricing",
    annualPrice: "Custom pricing",
    buttonText: "Talk to sales",
    description:
      "Get enterprise-grade features, security, and dedicated support.",
    features: [
      // { name: "Custom communities", available: true },
      // { name: "Custom users", available: true },
      // { name: "Unlimited free and paid events", available: true },
      // { name: "Auto Login", available: true },
      // { name: "Custom Newsletters", available: true },
      {
        name: "Advanced+custom analytics",
        available: true,
        info: [
          "Total users",
          "Total chats",
          "Active users",
          "New joining users",
          "Users interaction",
          "Most interactive users",
          "Inactive topics",
          "Invites and joins",
          "Most active topic",
          "Media shared count",
        ],
      },
      { name: "Dedicated support", available: true },
      // { name: "Community Manager", available: true },
      // { name: "In App Notifications", available: true },
      // { name: "Custom solutions", available: true },
      // { name: "Custom chat summary", available: true },
    ],
  },
];

const Pricing = ({ type }) => {
  const [activeTabPricing, setActiveTabPricing] = useState("monthly");

  return (
    <div className="flex flex-col mt-20 items-center z-10 px-8 bg-[#202020] h-full ">
      <p className="text-white text-2xl font-normal">
        Choose the plan that's right for you
      </p>
      <p className="mt-2 text-white text-xs font-extralight">
        No credit card required. You can cancel at any time.
      </p>

      <div className="flex space-x-6 mt-12 border-b-2 border-[#3c3c3c] ">
        <button
          onClick={() => setActiveTabPricing("monthly")}
          className={`text-sm font-light tracking-wider ${
            activeTabPricing === "monthly"
              ? "border-b-2 border-white text-white"
              : "text-white "
          } pb-2 px-3 transition-all`}
        >
          Monthly
        </button>
        <button
          onClick={() => setActiveTabPricing("annually")}
          className={`text-sm font-light tracking-wider ${
            activeTabPricing === "annually"
              ? "border-b-2 border-white text-white"
              : "text-white"
          } pb-2 px-3 transition-all`}
        >
          Annualy (~15% off)
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6  w-full max-w-7xl mt-12">
        {plans.map((plan, index) => (
          <PricingCard key={index} {...plan} type={activeTabPricing} />
        ))}
      </div>
      <div className="border border-theme-chatDivider rounded-lg flex sm:flex-row flex-col justify-start mt-20 w-full xl:w-4/5 p-0">
        <img
          src={PricingImage}
          alt="pricing-card"
          className="sm:h-40 sm:w-auto w-full h-40 object-cover"
        />
        <div className="ml-6 flex flex-col pt-4 w-full">
          <div className=" bg-theme-sidebarColor text-black text-xs px-3 py-0.5 rounded-full w-max">
            Add ons
          </div>
          <p className="text-lg text-white mt-1 mb-2 font-light">
            Make the most of your communities
          </p>
          <div className="flex lg:flex-row flex-col mt-2 justify-between w-full">
            <div className="flex sm:flex-row flex-col">
              <p className="font-light text-white text-sm w-64">
                Along with any othe plans mentioned above, you can add these
                pemium services.
              </p>
              <ul className="text-theme-secondaryText font-light text-sm space-y-2 mb-6 sm:ml-2 sm:mt-0 mt-2">
                <li className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ${"text-white"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        "M5 13l4 4L19 7" // Tick
                      }
                    />
                  </svg>
                  <span className="font-light">Whatsapp Notifications</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ${"text-white"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        "M5 13l4 4L19 7" // Tick
                      }
                    />
                  </svg>
                  <span className="font-light">
                    Custom chat summary generation
                  </span>
                </li>
              </ul>
            </div>
            <a
              href="https://calendly.com/channels_social/talk-to-us"
              target="_blank"
              rel="noopener noreferrer"
              className="border rounded-lg border-white text-white py-2 text-center
             px-10 mr-10 mb-8 font-light text-sm cursor-pointer"
            >
              Talk to sales
            </a>
          </div>
        </div>
      </div>
      <div className="h-12"></div>
    </div>
  );
};

export default Pricing;
