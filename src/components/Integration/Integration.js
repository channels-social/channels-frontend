import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { postRequestAuthenticated } from "./../../services/rest";
import DNSTable from "./widget";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyIcon from "../../assets/icons/copy_icon.png";

const Integration = () => {
  const myData = useSelector((state) => state.myData);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const [domain, setDomain] = useState(null);
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState("dns");
  const [apiKey, setApiKey] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [error, setError] = useState();
  const [successMessage, setSuccessMessage] = useState();
  const [verificationToken, setVerificationToken] = useState(null);
  const [domainProvider, setDomainProvider] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoggedIn) {
        navigate(`/get-started?redirect=/api/integration/channels`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const checkInitialKey = async () => {
      try {
        setError("");
        const response = await postRequestAuthenticated(
          "/check/initial/api/key"
        );
        if (response.success) {
          setVerificationToken(response.verificationToken);
          setActiveTab(response.verificationMethod || "dns");
          setDomainProvider(response.provider);
          setApiKey(response.apiKey);
          setDomain(response.domain);
          setPage(response.page);
        } else {
          setError(response.message);
        }
      } catch (error) {
        setActiveTab("dns");
        setError(error);
      }
    };

    checkInitialKey();
  }, []);

  const handleDomainVerify = async () => {
    setError("");
    try {
      setLoading(true);
      const response = await postRequestAuthenticated(
        "/check/domain/verification",
        { domain: domain }
      );
      setLoading(false);
      if (response.success) {
        setVerificationToken(response.token);
        setDomainProvider(response.provider);
        setPage(1);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleCopy = () => {
    setError("");
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const downloadJson = (apiKey) => {
    setError("");
    if (!apiKey) {
      alert("API key is empty!");
      return;
    }
    const jsonData = JSON.stringify({ apiKey }, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "api_key.json";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = () => {
    setError("");
    const link = document.createElement("a");
    link.href = `https://api.channels.social/api/download/verification-file?token=${encodeURIComponent(
      verificationToken
    )}`;
    link.setAttribute("download", "channels-verification.txt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVerify = async () => {
    setError("");
    try {
      setLoadingVerify(true);
      const response = await postRequestAuthenticated(
        "/domain/verification/method",
        { verificationMethod: activeTab }
      );
      console.log(response);
      setLoadingVerify(false);
      if (response.success) {
        setSuccessMessage(response.message);
        setApiKey(response.apiKey);
        setPage(2);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error);
      setLoadingVerify(false);
    }
  };

  const metaData = `<meta name="channels-verification" content="${verificationToken}"/>`;

  return (
    <div className="flex flex-col px-10 pt-10 overflow-y-auto h-full">
      <h3 className="dark:text-secondaryText-dark text-2xl font-normal">
        Channels API Integration
      </h3>
      <p className="dark:text-primaryText-dark font-light text-sm mt-1 ">
        Your domain needs to be verified for integration
      </p>
      <div className="border-t dark:border-t-chatDivider-dark my-4 "></div>
      {loading && (
        <div className="dark:text-secondaryText-dark text-sm font-normal mt-8 ml-4">
          Verification in progress.
          <br /> Please Wait...
        </div>
      )}
      {error && (
        <div className="dark:text-error-dark text-sm font-normal mt-4">
          {error}
        </div>
      )}

      {!loading && page === 0 && (
        <div className="w-1/3 flex flex-col">
          <p className="dark:text-secondaryText-dark text-sm mt-4 font-light">
            Enter your organization domain
          </p>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="mt-3 pt-3 pb-3 pl-4 pr-3  rounded-md border font-light font-inter dark:border-primaryText-dark
         dark:bg-transparent dark:text-secondaryText-dark  focus:outline-none placeholder:font-light placeholder:text-sm 
         dark:placeholder:text-chatBackground-dark"
            placeholder="Enter your website url"
          />
          <button
            className={` py-2.5 mt-6 rounded-lg ${
              !domain || domain.length < 10
                ? "dark:text-buttonDisable-dark dark:text-opacity-40 dark:bg-buttonDisable-dark dark:bg-opacity-10"
                : "dark:bg-buttonEnable-dark dark:text-secondaryText-dark"
            } font-normal`}
            onClick={handleDomainVerify}
          >
            Continue
          </button>
        </div>
      )}
      {!loading && page === 1 && (
        <div className="flex flex-col">
          <div className="flex border-b dark:border-b-chatDivider-dark font-normal text-sm mt-4 w-max">
            <button
              className={`py-3 px-5 ${
                activeTab === "dns"
                  ? "border-b-2 dark:text-secondaryText-dark dark:border-b-secondaryText-dark"
                  : "dark:text-primaryText-dark"
              }`}
              onClick={() => setActiveTab("dns")}
            >
              DNS Verification
            </button>
            <button
              className={`py-3 px-5 ${
                activeTab === "file"
                  ? "border-b-2 dark:text-secondaryText-dark dark:border-b-secondaryText-dark"
                  : "dark:text-primaryText-dark"
              }`}
              onClick={() => setActiveTab("file")}
            >
              TXT File Upload
            </button>
            <button
              className={`py-3 px-5 ${
                activeTab === "meta"
                  ? "border-b-2 dark:text-secondaryText-dark dark:border-b-secondaryText-dark"
                  : "dark:text-primaryText-dark"
              }`}
              onClick={() => setActiveTab("meta")}
            >
              Meta-Tag
            </button>
          </div>{" "}
          <div className="mt-8">
            {activeTab === "dns" && (
              <div className="flex flex-col space-y-4 dark:text-primaryText-dark font-light text-sm">
                <p>
                  1. We have identified that your domain manager is{" "}
                  {domainProvider}. Login to your {domainProvider} account.
                </p>
                <p>
                  2. Now, add a new TXT record, and paste the below TXT value{" "}
                  into the DNS configuration.
                </p>
                <div className="h-2"></div>
                <DNSTable token={verificationToken} />
                <p className="pt-4">
                  3. You may have to wait for 30 minutes to 1 day for this
                  change to propagate , depending on the TTL value that you've
                  entered.
                </p>
                <p>
                  4. Finally, come back to this page and click on the below
                  button to complete the domain verification process.
                </p>
                <div className="flex flex-row space-x-6 text-sm font-light pt-2">
                  <div
                    className="dark:text-secondaryText-dark cursor-pointer dark:bg-buttonEnable-dark rounded-lg text-center px-12 py-2"
                    onClick={handleVerify}
                  >
                    Verify
                  </div>
                  {/* <div className="dark:text-secondaryText-dark border dark:border-secondaryText-dark rounded-lg text-center px-12 py-2 text-xs font-light">
                    Cancel
                  </div> */}
                </div>
              </div>
            )}
            {activeTab === "file" && (
              <div className="flex flex-col space-y-4 dark:text-primaryText-dark font-light text-sm">
                <p>
                  1. Download the TXT file{" "}
                  <span
                    className="text-blue-400 underline cursor-pointer cursor-pointer"
                    onClick={handleDownload}
                  >
                    channels-verification.txt
                  </span>
                </p>
                <p>
                  2. Upload the downloaded TXT file in root folder of your
                  project.
                </p>
                <p className="leading-8">
                  3. To verify whether you've performed the above steps
                  correctly,
                  <br /> &nbsp;&nbsp;&nbsp;&nbsp;visit{" "}
                  <a
                    href={`https://${domain}/channels-verification.txt`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline cursor-pointer"
                  >
                    https://{domain}/channels-verification.txt
                  </a>
                  . If you can see a verification code, then you are good to go.
                </p>

                <p>4. Click Verify below to complete verification.</p>
                <div className="flex flex-row space-x-6 text-sm font-light pt-2">
                  <div
                    className="dark:text-secondaryText-dark cursor-pointer dark:bg-buttonEnable-dark rounded-lg text-center px-12 py-2"
                    onClick={handleVerify}
                  >
                    Verify
                  </div>
                  {/* <div className="dark:text-secondaryText-dark border dark:border-secondaryText-dark rounded-lg text-center px-12 py-2 text-xs font-light">
                    Cancel
                  </div> */}
                </div>
              </div>
            )}
            {activeTab === "meta" && (
              <div className="flex flex-col space-y-4 dark:text-primaryText-dark font-light text-sm">
                <p>
                  Copy the meta tag below and paste it inside the {"<head>"}{" "}
                  section of your homepage {domain}.
                </p>
                <p>
                  The tag should go between the {"<head> and </head>"} tags,
                  before the {"<body>"} tag .
                </p>
                <p className="pt-2">Meta tag value:</p>

                <div className="flex flex-row items-center mt-2 dark:bg-transparent rounded-md  w-full">
                  <div className="dark:bg-chatDivider-dark px-4 py-4 rounded-lg items-center xs:text-sm text-xs dark:text-secondaryText-dark w-max">
                    {metaData}
                  </div>
                  <CopyToClipboard text={metaData} onCopy={handleCopy}>
                    <div className="relative flex items-center">
                      <button className="flex items-center justify-center px-2 ">
                        <img
                          src={CopyIcon}
                          alt="copy"
                          className="dark:text-white font-normal text-xs xs:text-sm py-1 rounded-md cursor-pointer"
                        />
                      </button>
                      {copied && (
                        <p className="absolute bottom-8 left-2 text-sm font-light dark:text-primaryText-dark">
                          copied
                        </p>
                      )}
                    </div>
                  </CopyToClipboard>
                </div>
                <div className="flex flex-row space-x-6 text-sm font-light pt-2">
                  <div
                    className="cursor-pointer dark:text-secondaryText-dark dark:bg-buttonEnable-dark rounded-lg text-center px-12 py-2"
                    onClick={handleVerify}
                  >
                    Verify
                  </div>
                  {/* <div className="dark:text-secondaryText-dark border dark:border-secondaryText-dark rounded-lg text-center px-12 py-2 text-xs font-light">
                    Cancel
                  </div> */}
                </div>
              </div>
            )}
            {successMessage && (
              <div className="dark:text-green-300 text-sm font-normal mt-8">
                {successMessage}
              </div>
            )}
          </div>
        </div>
      )}
      {!loading && page === 2 && (
        <div className="flex flex-col mt-2 dark:text-primaryText-dark font-light text-sm">
          <p>
            This is your unique password and its non-recoverable. If you lose
            this API key, you will have to reset it.
          </p>
          <p
            className="text-blue-400 cursor-pointer mt-2"
            onClick={() => downloadJson(apiKey)}
          >
            Download as JSON
          </p>
          <div
            className="dark:bg-chatDivider-dark px-4 py-4 rounded-lg items-center xs:text-sm text-xs
           dark:text-secondaryText-dark w-max mt-6"
          >
            {apiKey}
          </div>
          <CopyToClipboard text={apiKey} onCopy={handleCopy}>
            <div className="w-max cursor-pointer dark:text-secondaryText-dark mt-6 dark:bg-buttonEnable-dark rounded-lg text-center px-12 py-2">
              Copy
            </div>
          </CopyToClipboard>
        </div>
      )}
      {!loading && page === 3 && (
        <div className="mt-6 dark:text-secondaryText-dark text-md font-light ">
          Api key is already generated.{" "}
          <span className="dark:text-blue-400 underline">
            Contact the channels support
          </span>
        </div>
      )}
    </div>
  );
};

export default Integration;
