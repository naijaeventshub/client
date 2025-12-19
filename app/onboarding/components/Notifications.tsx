"use client";

import { useState } from "react";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";

export default function Notifications() {
  const [preferences, setPreferences] = useState({
    emailMarketing: true,
    emailUpdates: true,
    smsMarketing: false,
    smsUpdates: true,
    pushNotifications: true,
    weeklyDigest: true,
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div>
      <div className="w-full text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
          <Bell className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Notification Preferences
        </h2>
        <p className="text-gray-600 text-sm">
          Choose how you'd like to receive updates from us.
        </p>
      </div>

      <div className="space-y-4">
        {/* Email Notifications */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-gray-400 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                Email Notifications
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Receive updates and news via email
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailMarketing}
                  onChange={() => togglePreference("emailMarketing")}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="text-sm text-gray-700">Marketing</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.emailUpdates}
                  onChange={() => togglePreference("emailUpdates")}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="text-sm text-gray-700">Updates</span>
              </label>
            </div>
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <MessageSquare className="h-5 w-5 text-gray-400 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">SMS Notifications</h3>
              <p className="text-sm text-gray-600 mt-1">
                Receive important updates via text message
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.smsMarketing}
                  onChange={() => togglePreference("smsMarketing")}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="text-sm text-gray-700">Marketing</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.smsUpdates}
                  onChange={() => togglePreference("smsUpdates")}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="text-sm text-gray-700">Updates</span>
              </label>
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3 justify-between">
            <div className="flex items-start gap-3 flex-1">
              <Smartphone className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  Push Notifications
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Receive real-time notifications on your device
                </p>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.pushNotifications}
                onChange={() => togglePreference("pushNotifications")}
                className="w-4 h-4 text-purple-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Weekly Digest */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3 justify-between">
            <div className="flex items-start gap-3 flex-1">
              <Mail className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">Weekly Digest</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Get a summary of your activity and important updates every
                  week
                </p>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.weeklyDigest}
                onChange={() => togglePreference("weeklyDigest")}
                className="w-4 h-4 text-purple-600 rounded"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
