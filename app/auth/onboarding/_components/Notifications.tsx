'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function Notifications() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsAlerts: false,
    eventReminders: false,
    newEventsAlerts: false,
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleFinishSetup = () => {
    // TODO: Submit preferences and complete onboarding
    console.log('Notification preferences:', preferences);
  };

  return (
    <div className="w-full text-center">
      {/* Header Section */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-200 mb-6">
        <Bell className="w-8 h-8 text-purple-600" />
      </div>

      <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
        How would you like to be notified?
      </h2>

      <p className="text-gray-600 text-xs md:text-sm mb-12">
        Choose your preferred channels.
      </p>

      {/* Notification Preferences List */}
      <div className="space-y-6 mb-12">
        {/* Email Notifications */}
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Email Notifications</h3>
          </div>
          <Switch
            checked={preferences.emailNotifications}
            onCheckedChange={() => togglePreference('emailNotifications')}
            className="[&[data-state=checked]]:bg-[rgba(79,70,229,1)]"
          />
        </div>

        {/* SMS Alerts */}
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">SMS Alerts</h3>
          </div>
          <Switch
            checked={preferences.smsAlerts}
            onCheckedChange={() => togglePreference('smsAlerts')}
            className="[&[data-state=checked]]:bg-[rgba(79,70,229,1)]"
          />
        </div>

        {/* Event Reminders */}
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Event Reminders</h3>
            <p className="text-sm text-gray-600 mt-1">
              Remind me 24 hours before an event
            </p>
          </div>
          <Switch
            checked={preferences.eventReminders}
            onCheckedChange={() => togglePreference('eventReminders')}
            className="[&[data-state=checked]]:bg-[rgba(79,70,229,1)]"
          />
        </div>

        {/* New Events Alerts */}
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">New Events Alerts</h3>
            <p className="text-sm text-gray-600 mt-1">
              Notify me about events I might like
            </p>
          </div>
          <Switch
            checked={preferences.newEventsAlerts}
            onCheckedChange={() => togglePreference('newEventsAlerts')}
            className="[&[data-state=checked]]:bg-[rgba(79,70,229,1)]"
          />
        </div>
      </div>
    </div>
  );
}
