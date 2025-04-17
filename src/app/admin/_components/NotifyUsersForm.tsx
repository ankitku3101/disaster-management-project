"use client";

import { useState } from "react";

export default function NotifyUsersForm() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setStatus("❗ Please enter a message.");
      return;
    }

    setIsSending(true);
    setStatus("");

    try {
      const res = await fetch("/api/notify-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Message sent to all users.");
        setMessage("");
      } else {
        setStatus(`❌ ${data.error || "Something went wrong."}`);
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Error sending message.");
    }

    setIsSending(false);
  };

  return (
    <div className="mt-6 sm:mt-10 w-full px-4 sm:px-6 md:px-0 max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-md mx-auto">
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          📢 Send Alert to Users
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full p-3 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-md resize-none"
            placeholder="Enter your alert message here..."
          />

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-60 text-sm"
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Alert"}
          </button>
        </form>

        {status && (
          <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
