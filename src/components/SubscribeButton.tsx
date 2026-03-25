"use client";

import { useState } from "react";

export default function SubscribeButton({ mode = "subscribe" }: { mode?: "subscribe" | "upgrade" }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Failed to start checkout");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSubscribe}
        disabled={isLoading}
        className="w-full py-3 px-4 rounded-xl gradient-brand text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isLoading ? "Redirecting..." : mode === "upgrade" ? "Upgrade to Pro" : "Subscribe to Pro"}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
