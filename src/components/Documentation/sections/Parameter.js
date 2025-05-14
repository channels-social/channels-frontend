import React from "react";

export default function Parameters() {
  const parameters = [
    {
      name: "channels",
      type: "Array of Strings",
      required: "❌",
      default: "[] (all channels in profile)",
      example: '["Channel1", "Channel2"]',
      description:
        "An array of channel names to be available in the embed. If not provided, all channels from the user’s profile are included.",
    },
    {
      name: "selectedChannel",
      type: "String",
      required: "✅",
      default: "First channel in the list",
      example: '"Channel1"',
      description:
        "The name of the channel that should be pre-selected when the embed opens.",
    },
    {
      name: "selectedTopic",
      type: "String",
      required: "✅",
      default: "None",
      example: '"Topic4"',
      description:
        "The name of the topic you want to auto-open inside the selected channel. Must exist in the channel.",
    },
    {
      name: "email",
      type: "String",
      required: "✅",
      default: "None",
      example: '"user@example.com"',
      description:
        "The email of the user opening the widget. Used for session tracking and authentication.",
    },
    {
      name: "autoLogin",
      type: "Boolean",
      required: "❌",
      default: "false",
      example: "true",
      description:
        "If set to true (and supported from your Channels settings), the user will be auto-logged in without a login prompt.",
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Embed Parameters</h2>
      <p className="text-gray-700 mb-6">
        Below is a complete list of parameters you can pass to{" "}
        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
          window.openChannelsWidget(...)
        </code>
        . These control how the widget loads and what data is prefilled for the
        user.
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-left text-sm">
          <thead className="bg-gray-100 font-medium">
            <tr>
              <th className="border px-4 py-4">Parameter</th>
              <th className="border px-4 py-4">Type</th>
              <th className="border px-4 py-4 text-center">Required</th>
              <th className="border px-4 py-4">Default</th>
              <th className="border px-4 py-4">Description</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((param) => (
              <tr key={param.name} className="hover:bg-gray-50">
                <td className="border px-4 py-4 font-medium">{param.name}</td>
                <td className="border px-4 py-4">{param.type}</td>
                <td className="border px-4 py-4 text-center">
                  {param.required}
                </td>
                <td className="border px-4 py-4">{param.default}</td>
                <td className="border px-4 py-4 max-w-60">
                  {param.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
