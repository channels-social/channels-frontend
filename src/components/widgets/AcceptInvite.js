import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { hostUrl } from "../../utils/globals";

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Processing your request...");

  useEffect(() => {
    const channelId = searchParams.get("channelId");
    const userId = searchParams.get("userId");

    fetch(
      `${hostUrl}/api/accept/channel/invite?channelId=${channelId}&userId=${userId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMessage("You have successfully accepted the channel invite!");
        } else {
          setMessage(data.message || "Failed to accept the invite.");
        }
      })
      .catch((error) => {
        console.error("Error accepting invite:", error);
        setMessage("An error occurred while processing your request.");
      });
  }, [searchParams]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>{message}</h2>
    </div>
  );
};

export default AcceptInvite;
