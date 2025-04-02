(function () {
  if (window.ChannelsWidgetLoaded) return;
  window.ChannelsWidgetLoaded = true;

  function getApiKeyFromScript() {
    const scripts = document.getElementsByTagName("script");
    for (let script of scripts) {
      const src = script.src;
      if (src && src.includes("widget.js")) {
        const urlParams = new URL(src).searchParams;
        return urlParams.get("apiKey");
      }
    }
    return null;
  }

  const apiKey = getApiKeyFromScript();
  // const domain = window.location.hostname;
  const domain = "channelsbychips.site";
  const targetOrigin = "http://localhost:3001";

  if (!apiKey) {
    console.error("❌ Missing API key in script URL.");
    return;
  }

  window.ChannelsWidget = function (params = {}) {
    fetch(`http://localhost:3000/api/verify/api/key`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey, domain }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (!data.valid) {
          alert("❌ Invalid API key or unauthorized domain.");
          console.error("❌ Invalid API key or unauthorized domain.");
          return;
        }

        window.openChannelsWidget = function (params = {}) {
          // console.log("⚡ openChannelsWidget called with:", params);
          const embedData = {
            apiKey: apiKey,
            domain: domain,
            selectedChannel: params.selectedChannel || null,
            email: params.email || null,
            selectedTopic: params.selectedTopic || null,
            autoJoin: params.autoJoin || false,
            channels: params.channels || [],
          };
          let attempts = 0;
          const maxAttempts = 20;

          const tryToSendMessage = () => {
            const iframe = document.querySelector("iframe.channels-frame");
            if (!iframe) {
              if (attempts < maxAttempts) {
                attempts++;
                setTimeout(tryToSendMessage, 100); // Try again after 100ms
              } else {
                console.log("❌ Iframe not found after max attempts.");
              }
              return;
            }

            iframe.addEventListener("load", () => {
              // console.log("✅ Sending embedData to iframe...");
              iframe.contentWindow.postMessage(
                {
                  type: "embedData",
                  source: "channels-widget",
                  payload: embedData,
                },
                "http://localhost:3001"
              );
            });
          };

          tryToSendMessage();
        };
      })
      .catch((error) => console.log("❌ Error verifying API key:", error));
  };
})();
