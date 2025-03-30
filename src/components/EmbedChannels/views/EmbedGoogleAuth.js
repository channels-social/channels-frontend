import { useEffect } from "react";
import axios from "axios";

const GoogleAuthPopup = () => {
  console.log("work2");

  const redirectToGoogleAuth = (redirectDomain, hostDomain) => {
    const clientId =
      "391369792833-72medeq5g0o5sklosb58k7c98ps72foj.apps.googleusercontent.com";
    const redirectUri = encodeURIComponent(
      "http://localhost:3001/auth/google/callback"
    );
    const scope = encodeURIComponent("email profile");
    const stateObject = {
      redirectDomain,
      hostDomain,
    };
    const state = encodeURIComponent(JSON.stringify(stateObject));

    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&state=${state}&prompt=select_account`;

    window.location.href = authUrl;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectDomain = urlParams.get("domain");
    const hostDomain = urlParams.get("hostDomain");

    setTimeout(() => {
      redirectToGoogleAuth(redirectDomain, hostDomain);
    }, 100); // delay allows console.log to flush
  }, []);

  return (
    <div className="dark:text-secondaryText-dark text-md font-normal text-center pt-12">
      Redirecting to Google Authentication...
    </div>
  );
};

export default GoogleAuthPopup;
