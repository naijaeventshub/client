"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import onboardingImage from "@/images/onboarding-image.png";
import stepBaseItem from "@/images/step-baseitem.png";
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
] as const;

const STEP_COMPONENTS: Record<Step, React.ComponentType> = {
  welcome: WelcomeBasicInfo,
  addressBilling: AddressBilling,
  interests: Interests,
  notifications: Notifications,
};

const PRIMARY_COLOR = "rgba(95, 0, 208, 1)";
const COMPLETED_COLOR = "rgb(168, 85, 247)";
const PENDING_COLOR = "rgb(209, 213, 219)";

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
      <div className="hidden lg:flex w-[40%] relative">
        <Image
          src={onboardingImage}
          alt="Onboarding"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-8 left-8 text-white text-sm font-light opacity-60">
          cleo
        </div>
      </div>

      <div className="w-full lg:w-[60%] flex flex-col overflow-y-auto">
        <div className="px-8 md:px-12 pt-8 pb-6">
          <div className="flex items-start justify-between gap-0 max-w-4xl">
            {STEPS.map((step, index) => {
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div
                  key={step.id}
                  className="flex-1 flex flex-col items-center relative"
                >
                  {index < STEPS.length - 1 && (
                    <div
                      className="absolute top-4 h-px -translate-y-1/2 pointer-events-none"
                      style={{
                        left: "calc(50% + 16px)",
                        width: "calc(100% - 32px)",
                        backgroundColor: isCompleted
                          ? COMPLETED_COLOR
                          : PENDING_COLOR,
                      }}
                    />
                  )}

                  <div className="flex flex-col items-center relative z-10">
                    <div
                      className="relative w-8 h-8 mb-2 transition-all flex-shrink-0"
                      style={{
                        filter:
                          !isCurrent && !isCompleted
                            ? "grayscale(100%)"
                            : "none",
                      }}
                    >
                      <Image
                        src={stepBaseItem}
                        alt={`Step ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>

                    <span
                      className={`text-xs md:text-sm font-medium text-center transition-all max-w-xs ${
                        isCompleted || isCurrent
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 md:px-12 py-12">
          <div className="max-w-2xl mx-auto w-full">
            {CurrentComponent && <CurrentComponent />}
          </div>
        </div>

        <div className="px-8 md:px-12 pb-8">
          <div className="max-w-2xl mx-auto pt-6">
            {currentStep === "addressBilling" ? (
              <div className="flex justify-between items-start md:items-center gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-400 rounded-full text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <div className="flex flex-col md:flex-row md:gap-2.5 gap-3">
                  <button className="px-6 py-3 border border-gray-400 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                    I&apos;ll do this later
                  </button>
                  <button
                    onClick={handleNext}
                    style={{ backgroundColor: PRIMARY_COLOR }}
                    className="px-8 py-3 text-white rounded-full font-medium hover:opacity-90 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-400 rounded-full text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  style={{ backgroundColor: PRIMARY_COLOR }}
                  className="px-8 py-3 text-white rounded-full font-medium hover:opacity-90 transition-colors"
                >
                  {currentIndex === STEPS.length - 1 ? "Complete" : "Continue"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
