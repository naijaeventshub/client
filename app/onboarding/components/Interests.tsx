"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import MagicWand from "@/images/MagicWand.png";
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
import { apiClient } from "@/lib/api-client";

interface InterestItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface InterestsProps {
  onSelectionChange?: (selectedIds: string[]) => void;
}

// Icon mapping - maps backend icon identifiers to Lucide React icons
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  music: Music,
  business: Briefcase,
  weddings: HeartHandshake,
  religious: Heart,
  fitness: Dumbbell,
  family: Users,
  arts: Palette,
  wellness: Sparkles,
  food: Utensils,
  education: GraduationCap,
  tech: Laptop,
  fashion: Camera,
  sustainability: Leaf,
  politics: Landmark,
  travel: Plane,
  shopping: ShoppingBag,
};

// Fallback hardcoded interests - will be replaced by backend data
// TODO: Remove this once backend endpoint is ready
const FALLBACK_INTEREST_OPTIONS: InterestItem[] = [
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
  const [interestOptions, setInterestOptions] = useState<InterestItem[]>(
    FALLBACK_INTEREST_OPTIONS
  );
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Update endpoint when backend is ready
  // Expected endpoint: /api/v1/interests or similar
  // Expected response structure: { data: { items: [{ id, label, icon }] } } or { data: [{ id, label, icon }] }
  useEffect(() => {
    const fetchInterests = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual endpoint when backend is ready
        // const response = await apiClient.get<{ items: InterestItem[] } | InterestItem[]>('/interests');
        // const interests = Array.isArray(response.data)
        //   ? response.data
        //   : (response.data as any)?.items || [];
        //
        // // Map backend response to InterestItem format
        // const mappedInterests = interests.map((item: any) => ({
        //   id: item.id,
        //   label: item.label || item.name,
        //   icon: ICON_MAP[item.icon || item.icon_name] || Sparkles, // fallback to Sparkles if icon not found
        // }));
        //
        // setInterestOptions(mappedInterests);
      } catch (error) {
        console.error("Error fetching interests:", error);
        // Keep fallback data on error
      } finally {
        setIsLoading(false);
      }
    };

    // Uncomment when backend is ready
    // fetchInterests();
  }, []);

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
      <div
        className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
        style={{ backgroundColor: "rgba(238, 242, 255, 1)" }}
      >
        <Image
          src={MagicWand}
          alt="Magic Wand"
          width={32}
          height={32}
          className="w-8 h-8"
        />
      </div>

      {/* Title & Subtitle */}
      <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
        Let&apos;s select your Interests
      </h2>

      <p className="text-gray-600 text-xs md:text-sm mb-12">
        Please select two or more to proceed
      </p>

      {/* Interest Selection Section */}
      <div className="flex flex-wrap justify-center gap-3 overflow-y-auto scrollbar-hide max-h-96 md:max-h-none">
        {isLoading ? (
          <p className="text-gray-500">Loading interests...</p>
        ) : (
          interestOptions.map((interest) => {
            const Icon = interest.icon;
            const isSelected = selectedInterests.includes(interest.id);

            return (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                  isSelected
                    ? "text-white"
                    : "bg-white border border-gray-300 text-gray-900 hover:border-gray-400"
                }`}
                style={
                  isSelected
                    ? { backgroundColor: "rgba(31, 41, 55, 1)" }
                    : undefined
                }
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-white" : ""}`} />
                <span>{interest.label}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
