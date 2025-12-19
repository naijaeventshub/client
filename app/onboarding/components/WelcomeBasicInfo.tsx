"use client";

import { useState } from "react";
import { User, Phone } from "lucide-react";

export default function WelcomeBasicInfo() {
  const [formData, setFormData] = useState({
    phone: "",
    gender: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full text-center">
      {/* Icon Container */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-6">
        <User className="w-8 h-8 text-purple-600" />
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Tell Us More About You.
      </h2>

      {/* Subtext */}
      <p className="text-gray-600 text-sm mb-10">
        We'll tailor every feature to work for you
      </p>

      {/* Form */}
      <div className="space-y-4">
        {/* Two-Column Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Phone Number */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none bg-white"
              />
            </div>
          </div>

          {/* Gender Dropdown */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none bg-white appearance-none cursor-pointer"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
              {/* Dropdown Arrow */}
              <svg
                className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>

            {/* Helper Text */}
            <p className="text-xs text-gray-400 mt-2">
              Why we collect your information
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
