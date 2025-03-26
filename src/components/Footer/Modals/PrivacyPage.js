import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const PrivacyPage = () => {
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/Chips-social/chips-constants/main/privacy-policy.md"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch Privacy Policy.");
        }
        return response.text();
      })
      .then((text) => {
        setMarkdown(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching markdown file:", err);
        setError("Failed to load privacy policy.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 dark:text-secondaryText-dark text-primaryText-light">
      <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6">
        Privacy Policy
      </h1>

      {/* Show loading state */}
      {loading && <p className="text-center text-sm">Loading...</p>}

      {/* Show error if markdown fails to load */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Show Privacy Policy Content */}
      {!loading && !error && (
        <div className="prose dark:prose-dark text-sm leading-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default PrivacyPage;
