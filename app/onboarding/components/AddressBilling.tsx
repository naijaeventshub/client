"use client";

import { useState, useCallback } from "react";
import { Home, CreditCard, HelpCircle, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  homeAddress: string;
  billingAddress: string;
  country: string;
  state: string;
}

const INITIAL_STATE: FormData = {
  homeAddress: "",
  billingAddress: "",
  country: "",
  state: "",
};

const COUNTRIES = [
  { value: "usa", label: "United States" },
  { value: "canada", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "australia", label: "Australia" },
];

const STATES = [
  { value: "ca", label: "California" },
  { value: "ny", label: "New York" },
  { value: "tx", label: "Texas" },
  { value: "fl", label: "Florida" },
];

const ICON_BG_COLOR = "rgba(238, 242, 255, 1)";

export default function AddressBilling() {
  const [formData, setFormData] = useState<FormData>(INITIAL_STATE);

  const handleHomeAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setFormData((prev) => ({
        ...prev,
        homeAddress: value,
      }));
    },
    []
  );

  const handleBillingAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setFormData((prev) => ({
        ...prev,
        billingAddress: value,
      }));
    },
    []
  );

  const handleCountryChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      country: value,
    }));
  }, []);

  const handleStateChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      state: value,
    }));
  }, []);

  return (
    <div className="w-full text-center">
      <div
        className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
        style={{ backgroundColor: ICON_BG_COLOR }}
      >
        <Home className="h-8 w-8 text-purple-600" />
      </div>

      <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
        Where are you based?
      </h2>

      <p className="text-gray-600 text-xs md:text-sm mb-10">
        We'll use this to personalize your event experience.
      </p>

      <div className="space-y-4">
        {/* Vertical Stack - Home Address and Billing Address */}
        <div className="space-y-4">
          {/* Home Address Field */}
          <div className="text-left">
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Home Address
            </label>
            <div className="relative flex items-center">
              <Home className="absolute left-3 h-5 w-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={formData.homeAddress}
                onChange={handleHomeAddressChange}
                placeholder="Enter your home address"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none bg-white text-xs md:text-sm transition-colors"
              />
            </div>
          </div>

          {/* Billing Address Field */}
          <div className="text-left">
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Billing Address
            </label>
            <div className="relative flex items-center">
              <CreditCard className="absolute left-3 h-5 w-5 text-gray-400 flex-shrink-0 z-10" />
              <input
                type="text"
                value={formData.billingAddress}
                onChange={handleBillingAddressChange}
                placeholder="Enter your billing address"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none bg-white text-xs md:text-sm transition-colors"
              />
              <HelpCircle className="absolute right-3 h-5 w-5 text-gray-400 flex-shrink-0" />
            </div>
          </div>
        </div>

        {/* Horizontal Stack - Country and State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Country Field */}
          <div className="text-left">
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <div className="relative flex items-center">
              <Select
                value={formData.country}
                onValueChange={handleCountryChange}
              >
                <SelectTrigger className="w-full pl-10 pr-4 py-2 rounded-full border-gray-300 focus:ring-purple-600">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {COUNTRIES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* State Field */}
          <div className="text-left">
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <div className="relative flex items-center">
              <Select value={formData.state} onValueChange={handleStateChange}>
                <SelectTrigger className="w-full pl-10 pr-4 py-2 rounded-full border-gray-300 focus:ring-purple-600">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {STATES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
