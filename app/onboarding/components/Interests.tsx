"use client";

import { useState } from "react";
import {
  Music,
  Briefcase,
  HeartHandshake,
  Heart,
  Dumbbell,
  Users,
  Palette,
  Sparkles,
  Utensils,
  GraduationCap,
  Laptop,
  Camera,
  Leaf,
  Landmark,
  Plane,
  ShoppingBag,
} from "lucide-react";

interface InterestItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface InterestsProps {
  onSelectionChange?: (selectedIds: string[]) => void;
}

const INTEREST_OPTIONS: InterestItem[] = [
  { id: "music", label: "Music", icon: Music },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "weddings", label: "Weddings", icon: HeartHandshake },
  { id: "religious", label: "Religious", icon: Heart },
  { id: "fitness", label: "Fitness & Sports", icon: Dumbbell },
  { id: "family", label: "Family & Kids", icon: Users },
  { id: "arts", label: "Arts", icon: Palette },
  { id: "wellness", label: "Wellness", icon: Sparkles },
  { id: "food", label: "Food & Lifestyle", icon: Utensils },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "tech", label: "Tech & Startup", icon: Laptop },
  { id: "fashion", label: "Fashion & Photography", icon: Camera },
  { id: "sustainability", label: "Sustainability & Environment", icon: Leaf },
  { id: "politics", label: "Politics & Governance", icon: Landmark },
  { id: "travel", label: "Travel & Adventure", icon: Plane },
  { id: "shopping", label: "Shopping / Pop-up Markets", icon: ShoppingBag },
];

export default function Interests({ onSelectionChange }: InterestsProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    const updatedInterests = selectedInterests.includes(id)
      ? selectedInterests.filter((item) => item !== id)
      : [...selectedInterests, id];
    
    setSelectedInterests(updatedInterests);
    onSelectionChange?.(updatedInterests);
  };

  return (
    <div className="w-full text-center">
      {/* Circular Icon Container */}
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-200 mb-6">
        <Sparkles className="w-8 h-8 text-purple-600" />
      </div>

      {/* Title & Subtitle */}
      <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
        Let&apos;s select your Interest
      </h2>

      <p className="text-gray-600 text-xs md:text-sm mb-12">
        Please select two or more to proceed
      </p>

      {/* Interest Selection Section */}
      <div className="flex flex-wrap justify-center gap-3">
        {INTEREST_OPTIONS.map((interest) => {
          const Icon = interest.icon;
          const isSelected = selectedInterests.includes(interest.id);

          return (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                isSelected
                  ? "bg-black text-white"
                  : "bg-white border border-gray-300 text-gray-900 hover:border-gray-400"
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? "text-white" : ""}`} />
              <span>{interest.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
