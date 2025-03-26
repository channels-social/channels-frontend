import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { hostUrl } from "./../../../utils/globals";

const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const redirectDomain = searchParams.get("state"); // Get original embed domain

    if (accessToken && redirectDomain) {
      fetchUserDetails(accessToken, redirectDomain);
    } else {
      console.error("No access token or redirect domain received");
      window.close(); // Close popup if invalid
    }
  }, [searchParams]);

  const fetchUserDetails = async (accessToken, redirectDomain) => {
    try {
      // Get user info
      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const userData = response.data;

      const registerResponse = await axios.post(
        `${hostUrl}/api/embed/google/auth`,
        {
          name: userData.name,
          email: userData.email,
        },
        { withCredentials: true }
      );

      if (registerResponse.data.success) {
        const { user, token } = registerResponse.data;

        window.opener.postMessage(
          { success: true, user, token },
          redirectDomain
        );
        window.close();
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      window.close();
    }
  };

  return (
    <div className="dark:text-secondaryText-dark text-md font-normal pl-4 pt-4">
      Processing Google authentication...
    </div>
  );
};

export default GoogleAuthCallback;
