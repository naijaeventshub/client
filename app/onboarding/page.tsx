"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import onboardingImage from "@/images/onboarding-image.png";
import WelcomeBasicInfo from "./components/WelcomeBasicInfo";
import AddressBilling from "./components/AddressBilling";
import Interests from "./components/Interests";
import Notifications from "./components/Notifications";

type Step = "welcome" | "addressBilling" | "interests" | "notifications";

const STEPS = [
  { id: "welcome", label: "Welcome & Basic Info" },
  { id: "addressBilling", label: "Address & Billing" },
  { id: "interests", label: "Your Interests" },
  { id: "notifications", label: "Notifications & Finish" },
];

const STEP_COMPONENTS: Record<Step, React.ComponentType> = {
  welcome: WelcomeBasicInfo,
  addressBilling: AddressBilling,
  interests: Interests,
  notifications: Notifications,
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<Step>("welcome");

  const currentIndex = STEPS.findIndex((step) => step.id === currentStep);
  const CurrentComponent = STEP_COMPONENTS[currentStep];

  const handleNext = () => {
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id as Step);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id as Step);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* LEFT SECTION - 40% (Image Panel) */}
      <div className="hidden lg:flex w-[40%] relative">
        <Image
          src={onboardingImage}
          alt="Onboarding"
          fill
          className="object-cover"
          priority
        />
        {/* Subtle Logo */}
        <div className="absolute bottom-8 left-8 text-white text-sm font-light opacity-60">
          cleo
        </div>
      </div>

      {/* RIGHT SECTION - 60% (Content Panel) */}
      <div className="w-full lg:w-[60%] flex flex-col overflow-y-auto">
        {/* TOP STEPPER */}
        <div className="px-8 md:px-12 pt-8 pb-6 border-b border-gray-200">
          <div className="flex items-start justify-between gap-4 max-w-4xl">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex-1">
                {/* Line above circle (except first) */}
                {index > 0 && (
                  <div
                    className={`h-0.5 mb-2 transition-all ${
                      index - 1 < currentIndex ? "bg-purple-600" : "bg-gray-300"
                    }`}
                  />
                )}

                {/* Circle and Label Container */}
                <div className="flex flex-col items-center">
                  {/* Circle Indicator */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all mb-2 ${
                      index === currentIndex
                        ? "bg-purple-600 text-white"
                        : index < currentIndex
                          ? "bg-purple-200 text-purple-600"
                          : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Step Label Below Circle */}
                  <span
                    className={`text-xs md:text-sm font-medium text-center transition-all ${
                      index <= currentIndex ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-12 py-12">
          <div className="max-w-2xl mx-auto w-full">
            {CurrentComponent && <CurrentComponent />}
          </div>
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="px-8 md:px-12 pb-8 border-t border-gray-200">
          <div className="max-w-2xl mx-auto flex justify-between items-center gap-4 pt-6">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              className="px-8 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              {currentIndex === STEPS.length - 1 ? "Complete" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
