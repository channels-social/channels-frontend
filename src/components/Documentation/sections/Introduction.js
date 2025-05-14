// src/docs/sections/Introduction.jsx
import React from "react";

export default function Introduction() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Introduction</h2>
      <p className="text-gray-700 text-lg">
        Welcome to the Channels Embed SDK documentation. This guide will help
        you integrate our embeddable widget into your website or platform with
        ease.
      </p>
      <p className="text-gray-700 mt-6">You'll learn how to:</p>
      <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-3">
        <li>Create an account and set up Channels</li>
        <li>Verify your domain</li>
        <li>Generate your unique API key</li>
        <li>Embed the widget and customize it</li>
      </ul>
    </div>
  );
}
