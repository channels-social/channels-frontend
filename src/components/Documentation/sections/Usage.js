// src/docs/sections/Usage.jsx
import React from "react";

export default function Usage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Embedding & Usage</h2>

      <p className="mb-4 text-gray-700">
        To integrate the Channels widget into your site, include the following
        script in the
        <code className="bg-gray-100 px-1 rounded mx-1">head</code> tag of your
        main HTML file:
      </p>

      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto mb-6">
        <code>{`<script src="https://channels.social/widget.js?apiKey=YOUR_API_KEY_HERE" 
        onload="window.ChannelsWidget && window.ChannelsWidget()"></script>`}</code>
      </pre>

      {/* <p className="mb-4 text-gray-700">
        To open the widget programmatically, use the following JavaScript
        function:
      </p>

      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
        <code>{`window.openChannelsWidget({
  apiKey: 'YOUR_API_KEY_HERE',
  userId: 'USER_ID_OPTIONAL',
  additionalData: {}
});`}</code>
      </pre>

      <p className="mt-4 text-gray-700">
        You can trigger this function on any button click, user action, or
        automatically based on your logic.
      </p> */}
    </div>
  );
}
