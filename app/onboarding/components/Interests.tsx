"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

const INTEREST_OPTIONS = [
  { id: "technology", label: "Technology" },
  { id: "business", label: "Business" },
  { id: "marketing", label: "Marketing" },
  { id: "design", label: "Design" },
  { id: "finance", label: "Finance" },
  { id: "health", label: "Health & Wellness" },
  { id: "education", label: "Education" },
  { id: "entertainment", label: "Entertainment" },
];

export default function Interests() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <div className="w-full text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
          <Sparkles className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          What Interests You?
        </h2>
        <p className="text-gray-600 text-sm">
          Select the topics that interest you most. We'll personalize your
          experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {INTEREST_OPTIONS.map((interest) => (
          <button
            key={interest.id}
            onClick={() => toggleInterest(interest.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left font-medium ${
              selectedInterests.includes(interest.id)
                ? "border-purple-600 bg-purple-50 text-purple-900"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  selectedInterests.includes(interest.id)
                    ? "bg-purple-600 border-purple-600"
                    : "border-gray-300"
                }`}
              >
                {selectedInterests.includes(interest.id) && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              {interest.label}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          Selected: {selectedInterests.length} of {INTEREST_OPTIONS.length}{" "}
          interests
        </p>
      </div>
    </div>
  );
}
