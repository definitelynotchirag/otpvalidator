"use client";
import React, { useState, useEffect } from "react";
import { useUserContext } from "@/context/context";
import {useRouter} from 'next/navigation';

const OtpInput = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const COOLDOWN_DURATION = 30;
  const [dbotp, setdbotp] = useState("");

  const { userId } = useUserContext();

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownTime]);

  useEffect(() => {
    const isComplete = otp.every((value) => value !== "");
    if (isComplete && !isSubmitting && cooldownTime === 0) {
      handleSubmit();
    }
  }, [otp]);

  useEffect(() => {
    const fetchOTP = async () => {
      const response = await fetch("/api/getotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch OTP");
      }

      const data = await response.json();
      setdbotp(data.otp);
    };

    fetchOTP();
  })

  useEffect(() => {
    if (isError) {
      setIsError(false);
    }
  }, [otp]);

  const handleChange = (value: string | number, index: number) => {
    if (typeof value === "string" && isNaN(Number(value))) return;

    if (typeof value === "string" && (value.length <= 1 || value === "")) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (!otp[index] && index > 0) {
        document.getElementById(`otp-input-${index - 1}`)?.focus();
      }
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const isOtpComplete = otp.every((value) => value !== "");

  const handleSubmit = async () => {
    if (isSubmitting || cooldownTime > 0) return;

    setIsSubmitting(true);
    try {
      // Call backend API to validate OTP
      const response = await fetch("/api/validate-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otp.join(""), userId: userId }),
      });

      if(response.ok){
        router.push('/dashboard');
      }
      else if(!response.ok) {
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      setIsError(true);
      setTimeout(() => {
        setOtp(["", "", "", ""]);
        document.getElementById("otp-input-0")?.focus();
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <style jsx global>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-4px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(4px);
          }
        }
        .shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>

      <div className="box-content border-slate-800 p-10 max-w-md w-full rounded-lg bg-white shadow-lg items-center">
        <div className="text-2xl text-center text-slate-950 pb-4">
          One Time Password
        </div>
        <div className="text-center text-slate-950 pb-4">
          Enter the OTP sent to your mobile number
        </div>

        <div className="flex items-center justify-center h-auto">
          <div className={`flex gap-2 mb-4 ${isError ? "shake" : ""}`}>
            {otp.map((_, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-12 h-12 text-center text-slate-950 text-2xl border rounded-md focus:outline-none focus:border-blue-500 
                  ${isSubmitting ? "bg-gray-100" : ""}
                  ${isError ? "border-red-500" : "border-gray-900"}
                  transition-colors duration-200`}
                disabled={cooldownTime > 0 || isSubmitting}
                autoComplete="off"
              />
            ))}
          </div>
        </div>

        {isSubmitting && (
          <div className="text-center text-sm text-blue-600 mb-2">
            Verifying OTP...
          </div>
        )}

        {isError && (
          <div className="text-center text-sm text-red-500 mb-2">
            Invalid OTP. Please try again.
          </div>
        )}

        {cooldownTime > 0 && (
          <div className="text-center text-sm text-slate-600 mb-2">
            Please wait {formatTime(cooldownTime)} before submitting again
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!isOtpComplete || cooldownTime > 0 || isSubmitting}
          className={`w-full py-2 mt-4 text-white rounded-md ${
            isOtpComplete && cooldownTime === 0 && !isSubmitting
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Verifying..." : "Submit"}
        </button>

        <div
          className={`text-center text-xs text-slate-500 mt-4 ${
            isSubmitting ? "opacity-0" : "opacity-100"
          }`}
        >
          OTP will process automatically once all digits are entered
        <div>Your Otp is : {dbotp}</div>
        </div>
      </div>
    </div>
  );
};

export default OtpInput;