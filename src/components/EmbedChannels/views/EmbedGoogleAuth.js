import { useEffect } from "react";
import axios from "axios";

const GoogleAuthPopup = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectDomain = urlParams.get("redirect");

    redirectToGoogleAuth(redirectDomain);
  }, []);

  const redirectToGoogleAuth = (redirectDomain) => {
    const clientId =
      "391369792833-72medeq5g0o5sklosb58k7c98ps72foj.apps.googleusercontent.com";
    const redirectUri = encodeURIComponent(
      "https://channels.social/auth/google/callback"
    );
    const scope = encodeURIComponent("email profile");

    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&state=${redirectDomain}`;

    window.location.href = authUrl;
  };

  return (
    <div className="dark:text-secondaryText-dark text-md font-normal text-center pt-12">
      Redirecting to Google Authentication...
    </div>
  );
};

export default GoogleAuthPopup;
