'use client';

import { useState, useCallback } from 'react';
import { Phone, User } from 'lucide-react';
import Image from 'next/image';
import userIcon from '@/images/user-2.png';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FormData {
  phone: string;
  gender: string;
}

const INITIAL_STATE: FormData = {
  phone: '',
  gender: '',
};

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const ICON_BG_COLOR = 'rgba(238, 242, 255, 1)';

export default function WelcomeBasicInfo() {
  const [formData, setFormData] = useState<FormData>(INITIAL_STATE);

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setFormData((prev) => ({
        ...prev,
        phone: value,
      }));
    },
    []
  );

  const handleGenderChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  }, []);

  return (
    <div className="w-full text-center">
      <div
        className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
        style={{ backgroundColor: ICON_BG_COLOR }}
      >
        <Image
          src={userIcon}
          alt="User profile"
          width={32}
          height={32}
          priority
        />
      </div>

      <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
        Tell Us More About You.
      </h2>

      <p className="text-gray-600 text-xs md:text-sm mb-10">
        We&apos;ll tailor every feature to work for you
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone Number Field */}
          <div className="text-left">
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3 h-5 w-5 text-gray-400 flex-shrink-0" />
              <input
                type="tel"
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="Enter your phone number"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none bg-white text-xs md:text-sm transition-colors"
              />
            </div>
          </div>

          {/* Gender Selection Field */}
          <div className="text-left">
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3 h-5 w-5 text-gray-400 flex-shrink-0 z-10" />
              <Select
                value={formData.gender}
                onValueChange={handleGenderChange}
              >
                <SelectTrigger className="w-full pl-10 pr-4 py-2 rounded-full border-gray-300 focus:ring-purple-600">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="text-2xs md:text-xs text-gray-400 mt-2">
              Why we collect your information
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
