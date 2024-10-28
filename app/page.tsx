"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/context";

export default function LoginPage() {
  const router = useRouter();
  const { userId, setuserId } = useUserContext();
  const [user, setUser] = React.useState({
    email: "",
    username: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
      });

      if (response.ok) {
        const data = await response.json();
        setuserId(data.user);
        router.push("/otp");
      }
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email && user.username));
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black-50 py-6 sm:py-12">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-gray-700 text-center">{loading ? "Processing..." : "Sign Up"}</h1>
        <hr className="border-gray-200" />
        
        <div className="space-y-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-600">
            Username
          </label>
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-950"
            id="username"
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Enter your username"
          />

          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-950"
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
          />
        </div>

        <button
          onClick={onSignup}
          disabled={buttonDisabled || loading}
          className={`w-full py-3 mt-6 font-semibold text-white rounded-lg transition-all duration-200 ${
            buttonDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Processing..." : "Sign Up"}
        </button>
      </div>
    </div>
  );
}
