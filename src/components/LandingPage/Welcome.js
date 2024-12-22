import React from "react";

const Welcome = () => {
  return (
    <div className="flex flex-col dark:bg-tertiaryBackground-dark space-y-6 p-6 h-full">
      <div className="relative p-6 dark:bg-welcomeColor-dark rounded-md">
        <div className="absolute left-0 top-0 bottom-0 w-2 rounded-l-lg dark:bg-sidebarColor-dark"></div>
        <p className=" dark:text-secondaryText-dark font-light font-inter italic text-sm tracking-wide">
          We are thrilled to have you here. Channels is built with one goal in
          mind, helping you bring your community closer, right where they
          already are. No juggling between tools.
          <br />
          <br />
          Think of Channels as your community’s new home base which can be
          integrated directly into your website, where chats, events, and
          content come together seamlessly. Explore, set up, and start creating
          those magic moments with your audience.
          <br />
          <br />
          If you ever need a hand, we are just a click away (top right corner,
          Help button).
          <br />
          <br />
          Have fun building your community
          <br />
          Cheers!
          <br />
          Team Channels
        </p>
      </div>

      <div>
        <h2 className="text-md font-normal font-inter mb-4 dark:text-white ">
          Here's how you can get started
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4 border dark:border-chatDivider-dark rounded-md">
            <h3 className="text-md font-normal font-inter dark:text-white">
              Setup your Profile
            </h3>
            <div className="h-24 dark:bg-primaryText-dark my-2"></div>
            <p className="mt-2 text-sm font-light dark:text-secondaryText-dark italic font-inter">
              We are thrilled to have you here. Channels is built with one goal
              in mind, helping you bring your community closer, right where they
              already are.
            </p>
          </div>
          <div className="p-4 border dark:border-chatDivider-dark rounded-md">
            <h3 className="text-md font-normal font-inter dark:text-white">
              Create a Channel
            </h3>
            <div className="h-24 dark:bg-primaryText-dark my-2"></div>

            <p className="mt-2 text-sm font-light dark:text-secondaryText-dark italic font-inter">
              We are thrilled to have you here. Channels is built with one goal
              in mind, helping you bring your community closer, right where they
              already are.
            </p>
          </div>
          <div className="p-4 border dark:border-chatDivider-dark rounded-md">
            <h3 className="text-md font-normal font-inter dark:text-white">
              Create Topics of Discussion
            </h3>
            <div className="h-24 dark:bg-primaryText-dark my-2"></div>
            <p className="mt-2 text-sm font-light dark:text-secondaryText-dark italic font-inter">
              We are thrilled to have you here. Channels is built with one goal
              in mind, helping you bring your community closer, right where they
              already are.
            </p>
          </div>

          <div className="p-4 border dark:border-chatDivider-dark rounded-md">
            <h3 className="text-md font-normal font-inter dark:text-white">
              Custom Integration
            </h3>
            <div className="h-24 dark:bg-primaryText-dark my-2"></div>

            <p className="mt-2 text-sm font-light dark:text-secondaryText-dark italic font-inter">
              We are thrilled to have you here. Channels is built with one goal
              in mind, helping you bring your community closer, right where they
              already are.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
