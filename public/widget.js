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
  const domain = window.location.hostname;

  if (!apiKey) {
    console.error("❌ Missing API key in script URL.");
    return;
  }

  window.ChannelsWidget = function (params = {}) {
    fetch("https:channels.social/api/verify-api-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey, domain }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.valid) {
          console.error("❌ Invalid API key or unauthorized domain.");
          return;
        }

        window.openChannelsWidget = function (params = {}) {
          const embedData = {
            apiKey: apiKey,
            domain: domain,
            selectedChannel: params.selectedChannel || null,
            email: params.email || null,
            selectedTopic: params.selectedTopic || null,
            autoJoin: params.autoJoin || false,
          };
          StorageManager.setItem("embedData", JSON.stringify(embedData));
          if (window.history.pushState) {
            window.history.pushState({}, "", "/embed/channels");
            window.dispatchEvent(new Event("popstate"));
          } else {
            window.location.href = "/embed/channels";
          }
        };
      })
      .catch((error) => console.error("❌ Error verifying API key:", error));
  };
})();
