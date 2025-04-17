"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, location }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (err) {
      setMessage("Error submitting form.");
      console.error(err);
    }
  };

  if (!isLoaded || !user) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold">Profile</h2>
      <div className="flex items-center space-x-4 mt-4">
        <img
          src={user.imageUrl}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg">{user.fullName}</h3>
          <p className="text-gray-500">{user.primaryEmailAddress?.emailAddress}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            placeholder="Enter your phone number"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            placeholder="Enter your location"
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
          Save
        </button>

        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </form>
    </div>
  );
}
