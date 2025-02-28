import React from "react";

const Welcome = () => {
  return (
    <div className="flex flex-col dark:bg-tertiaryBackground-dark space-y-6 p-6 h-screen overflow-y-auto  ">
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
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="p-4 border dark:border-chatDivider-dark rounded-md">
            <h3 className="text-lg font-normal font-inter dark:text-white">
              Setup your Profile
            </h3>
            <img
              src="https://d3i6prk51rh5v9.cloudfront.net/channelsWebsite/welcome_1.svg"
              alt="welcome_1"
              className="rounded-md w-full my-2"
            />
            <p className="mt-2 text-sm font-light dark:text-secondaryText-dark font-inter">
              Share who you are, add curated content, and set up FAQs. Your
              profile doubles as a mini-website with a custom domain for your
              community.
            </p>
          </div>
          <div className="p-4 border dark:border-chatDivider-dark rounded-md">
            <h3 className="text-lg font-normal font-inter dark:text-white">
              Create your first Channel
            </h3>
            <img
              src="https://d3i6prk51rh5v9.cloudfront.net/channelsWebsite/welcome_2.svg"
              alt="welcome_2"
              className="rounded-md w-full my-2"
            />

            <p className="mt-2 text-sm font-light dark:text-secondaryText-dark font-inter">
              Start your first channel, customize it for your purpose, and set
              permissions to bring your community together seamlessly.
            </p>
          </div>
          <div className="p-4 border dark:border-chatDivider-dark rounded-md">
            <h3 className="text-lg font-normal font-inter dark:text-white">
              Add Topics of Discussion
            </h3>
            <img
              src="https://d3i6prk51rh5v9.cloudfront.net/channelsWebsite/welcome_3.svg"
              alt="welcome_3"
              className="rounded-md w-full my-2"
            />
            <p className="mt-2 text-sm font-light dark:text-secondaryText-dark font-inter">
              Create meaningful topics to structure your channel and spark
              focused, engaging discussions with your community for effortless
              participation.
            </p>
          </div>

          <div className="p-4 border dark:border-chatDivider-dark rounded-md">
            <div className="flex flex-row justify-between items-start">
              <h3 className="text-lg font-normal font-inter dark:text-white">
                Custom Integrations
              </h3>
              <div className="px-1 ml-1 py-0.5 dark:bg-sidebarColor-dark rounded-lg dark:text-white text-xs font-light w-max text-center">
                coming soon
              </div>
            </div>

            <img
              src="https://d3i6prk51rh5v9.cloudfront.net/channelsWebsite/welcome_4.svg"
              alt="welcome_4"
              className="rounded-md w-full my-2"
            />

            <p className="mt-2 text-sm font-light dark:text-secondaryText-dark font-inter">
              Embed Channels into your website in full page, popup or a modal
              with light mode, dark mode, or a custom theme that matches your
              brand’s style.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
