"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CalendarPlus2,
  Check,
  Clock3,
  Copy,
  Ellipsis,
  Facebook,
  Mail,
  MapPin,
  MessageSquare,
  Search,
  Share2,
  Star,
  Ticket,
  UserCircle2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import cardImgOne from "@/images/card-img 1.png";
import cardImgTwo from "@/images/card-img 2.png";
import cardImgThree from "@/images/card-img 3.png";
import cardImgFour from "@/images/card-img 4.png";
import echoesHeroImg from "@/images/echoes-hero-img.png";
import pastImgOne from "@/images/past-img 1.png";
import pastImgTwo from "@/images/past-img 2.png";
import pastImgThree from "@/images/past-img 3.png";
import pastImgFour from "@/images/past-img 4.png";
import pastImgFive from "@/images/past-img 5.png";
import pastImgSix from "@/images/past-img 6.png";
import pastImgSeven from "@/images/past-img 7.png";
import pastImgEight from "@/images/past-img 8.png";
import googleCalendarLogo from "@/images/google-calendar-logo.png";
import appleLogo from "@/images/apple-logo.png";
import fileDownloadIcon from "@/images/file-download.png";
import microsoftOutlookLogo from "@/images/microsoft-outlook-logo.svg";
import whatsappLogo from "@/images/whatsapp-logo.svg";
import messengerLogo from "@/images/messenger-logo.svg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type EventDetail = {
  id: string;
  title: string;
  tag: string;
  startsAtISO: string;
  timeLabel: string;
  locationName: string;
  locationAddress: string;
  latitude: number;
  longitude: number;
  priceFrom: string;
  heroImage: StaticImageData;
  galleryImages: StaticImageData[];
  description: string[];
  metrics: { label: string; value: string }[];
  includes: string[];
  organizer: {
    name: string;
    role: string;
    bio: string;
  };
  faqs: { question: string; answer: string }[];
  isMultiDate?: boolean;
  availableDateISOs?: string[];
  ticketOptions?: { id: string; name: string; price: string }[];
};

type TicketBadgeTone = "blue" | "amber" | "green";

type TicketTier = {
  id: string;
  name: string;
  priceNgn: number;
  description: string;
  note?: string;
  perks: string[];
  badges: { id: string; label: string; tone: TicketBadgeTone }[];
};

const horizontalPadding = "px-4 sm:px-6 md:px-8 lg:px-12";

const sharedPastMomentsImages: StaticImageData[] = [
  pastImgOne,
  pastImgTwo,
  pastImgThree,
  pastImgFour,
  pastImgFive,
  pastImgSix,
  pastImgSeven,
  pastImgEight,
];

const eventDetailsMap: Record<string, EventDetail> = {
  adventure: {
    id: "adventure",
    title: "Campus Film Screening Tour",
    tag: "Film & Entertainment",
    startsAtISO: "2026-12-13T19:00:00+01:00",
    timeLabel: "7:00 PM",
    locationName: "LAGOS127",
    locationAddress: "LAGOS127, Lagos Island, Lagos 10215 Nigeria",
    latitude: 6.4512,
    longitude: 3.3958,
    priceFrom: "N-",
    heroImage: cardImgOne,
    galleryImages: sharedPastMomentsImages,
    description: [
      "Step into an unforgettable cinematic journey at the Campus Film Screening Tour, designed for movie lovers and creatives.",
      "Expect carefully curated films, post-screening conversations, and opportunities to connect with other film enthusiasts in a vibrant community atmosphere.",
      "From thought-provoking shorts to crowd-favorite features, this event creates a shared space where stories come alive on screen.",
    ],
    metrics: [
      { label: "Expected Audience", value: "600+" },
      { label: "Past Ticket Sales", value: "700+" },
      { label: "Rating", value: "4.8/5" },
      { label: "Category", value: "Film" },
    ],
    includes: ["WiFi", "Parking", "Food", "Air Conditioning", "Accessibility"],
    organizer: {
      name: "Sarah Johnson",
      role: "Event Organizer",
      bio: "Community-focused film curator creating inclusive screenings and high-quality audience experiences.",
    },
    faqs: [
      {
        question: "What type of films will be screened during the tour?",
        answer:
          "The lineup includes a mix of independent features, short films, and curated audience favorites suitable for diverse tastes.",
      },
      {
        question: "Is there an age restriction for this screening?",
        answer:
          "Most screenings are open to all ages, but specific sessions may have content guidance listed before ticket checkout.",
      },
      {
        question: "Will food and drinks be available at the venue?",
        answer:
          "Yes, snacks and beverages will be available on-site. Some partner venues also include discount packages.",
      },
      {
        question: "How early should I arrive?",
        answer:
          "Arrive 30 to 45 minutes before start time for check-in, seating, and pre-show activities.",
      },
    ],
    isMultiDate: true,
    availableDateISOs: [
      "2026-12-10T19:00:00+01:00",
      "2026-12-11T19:00:00+01:00",
      "2026-12-12T19:00:00+01:00",
      "2026-12-13T19:00:00+01:00",
    ],
    ticketOptions: [
      { id: "day-pass", name: "Day Pass", price: "N12,000" },
      { id: "vip-day-pass", name: "VIP Day Pass", price: "N25,000" },
    ],
  },
  future: {
    id: "future",
    title: "Future of Summer Showcase",
    tag: "Style & Culture",
    startsAtISO: "2026-11-21T15:00:00+01:00",
    timeLabel: "3:00 PM",
    locationName: "The Atrium",
    locationAddress: "The Atrium, Lekki Phase 1, Lagos 106104 Nigeria",
    latitude: 6.4498,
    longitude: 3.4756,
    priceFrom: "N9,000",
    heroImage: cardImgTwo,
    galleryImages: sharedPastMomentsImages,
    description: [
      "Explore bold seasonal looks, creative styling sessions, and immersive showcases from leading designers.",
      "Connect with trend curators, photographers, and fashion enthusiasts in a high-energy setting built for inspiration.",
      "From runway moments to live styling demos, the event offers a fresh perspective on contemporary summer culture.",
    ],
    metrics: [
      { label: "Expected Audience", value: "500+" },
      { label: "Past Ticket Sales", value: "580+" },
      { label: "Rating", value: "4.7/5" },
      { label: "Category", value: "Fashion" },
    ],
    includes: ["WiFi", "Parking", "Media Booth", "Accessibility"],
    organizer: {
      name: "Naomi Clark",
      role: "Style Director",
      bio: "Creative lead with a strong focus on modern streetwear storytelling and live audience engagement.",
    },
    faqs: [
      {
        question: "Can I attend if I am not in the fashion industry?",
        answer:
          "Absolutely. The showcase is open to everyone interested in creativity, design, and cultural trends.",
      },
      {
        question: "Will there be photography sessions?",
        answer:
          "Yes. Dedicated photo areas and live content stations will be available throughout the event.",
      },
      {
        question: "Is there parking at the venue?",
        answer:
          "Yes, limited on-site parking is available and additional nearby parking options will be shared in your ticket email.",
      },
      {
        question: "Do I need a printed ticket?",
        answer: "No, your digital ticket QR code is sufficient for entry.",
      },
    ],
  },
  taste: {
    id: "taste",
    title: "Taste of Naija Experience",
    tag: "Food & Lifestyle",
    startsAtISO: "2026-10-30T13:00:00+01:00",
    timeLabel: "1:00 PM",
    locationName: "Culinary Hall",
    locationAddress: "Culinary Hall, Ikeja GRA, Lagos 100271 Nigeria",
    latitude: 6.6018,
    longitude: 3.3515,
    priceFrom: "Free",
    heroImage: cardImgThree,
    galleryImages: sharedPastMomentsImages,
    description: [
      "Discover the depth of local flavors through curated tastings, live cooking sessions, and chef-led storytelling.",
      "This one-day experience blends tradition and modern culinary expression in a welcoming social environment.",
      "Perfect for food lovers seeking fresh inspiration, networking, and memorable tasting moments.",
    ],
    metrics: [
      { label: "Expected Audience", value: "420+" },
      { label: "Past Ticket Sales", value: "510+" },
      { label: "Rating", value: "4.9/5" },
      { label: "Category", value: "Food" },
    ],
    includes: ["WiFi", "Tasting Access", "Parking", "Accessibility"],
    organizer: {
      name: "Chef Abdul Kareem",
      role: "Culinary Host",
      bio: "Chef and community curator passionate about preserving indigenous tastes through modern presentation.",
    },
    faqs: [
      {
        question: "Are there vegetarian options available?",
        answer:
          "Yes, multiple vegetarian and plant-based tasting options are included in the event menu.",
      },
      {
        question: "Can I bring children?",
        answer:
          "Yes, families are welcome. Children should be supervised at all times in food prep zones.",
      },
      {
        question: "Do I need to register if the event is free?",
        answer:
          "Yes, registration is required to manage capacity and provide a smooth check-in process.",
      },
      {
        question: "Is there seating on site?",
        answer: "Yes, both communal and private seating areas are available.",
      },
    ],
  },
  echoes: {
    id: "echoes",
    title: "Echoes of the Bassness Live",
    tag: "Music & Nightlife",
    startsAtISO: "2026-12-24T21:00:00+01:00",
    timeLabel: "9:00 PM",
    locationName: "The Dome",
    locationAddress: "The Dome, Victoria Island, Lagos 101241 Nigeria",
    latitude: 6.4281,
    longitude: 3.4219,
    priceFrom: "N15,000",
    heroImage: echoesHeroImg,
    galleryImages: sharedPastMomentsImages,
    description: [
      "Experience a single-night live production combining deep bass sets, immersive visuals, and guest performances.",
      "The event is curated for music lovers who value high-quality sound, energetic crowd moments, and seamless venue flow.",
      "From entry to closing set, every segment is designed to deliver a premium nightlife experience.",
    ],
    metrics: [
      { label: "Expected Audience", value: "900+" },
      { label: "Past Ticket Sales", value: "1,100+" },
      { label: "Rating", value: "4.6/5" },
      { label: "Category", value: "Concert" },
    ],
    includes: ["WiFi", "Parking", "Air Conditioning", "Accessibility"],
    organizer: {
      name: "DJ Kairo",
      role: "Music Curator",
      bio: "Live events producer focused on immersive sound design and high-impact audience engagement.",
    },
    faqs: [
      {
        question: "What time do gates open?",
        answer:
          "Gates open one hour before showtime to allow smooth entry and early access to lounge areas.",
      },
      {
        question: "Is this event seated or standing?",
        answer:
          "This is primarily a standing event with designated rest and VIP seating areas.",
      },
      {
        question: "Can I transfer my ticket to another person?",
        answer:
          "Yes, ticket transfer is available before the event cut-off time listed in your confirmation email.",
      },
      {
        question: "Is re-entry allowed?",
        answer: "Re-entry depends on ticket tier and venue policy for that night.",
      },
    ],
  },
};

const defaultTicketTiers: TicketTier[] = [
  {
    id: "standard-individual",
    name: "Standard Screening Pass (Individual)",
    priceNgn: 34840,
    description:
      "Secure your spot for an immersive cinematic journey. Grab this individual pass and save NGN 4,000 for a limited time.",
    note: "Save NGN 4,000 on a Regular Pass only for a limited time.",
    badges: [
      { id: "limited-seats", label: "Limited seats available", tone: "blue" },
      { id: "price-change", label: "Price increases Aug 30", tone: "amber" },
    ],
    perks: [
      "Access to all film screenings",
      "Digital program guide",
      "Audience poll participation",
      "Entry to merchandise draw",
      "Network with film enthusiasts",
      "Pre-event updates",
    ],
  },
  {
    id: "standard-duo",
    name: "Standard Screening Pass (Duo)",
    priceNgn: 30000,
    description:
      "Bring a friend and enjoy the festival together. Save NGN 8,000 when you purchase this duo pass today.",
    note: "Save up to NGN 8,000 on two Regular Passes.",
    badges: [
      { id: "group-limited", label: "Limited group tickets available", tone: "blue" },
      { id: "group-size", label: "2 people per group", tone: "green" },
      { id: "group-price", label: "Price increases Aug 30", tone: "amber" },
    ],
    perks: [
      "Access to all film screenings for two",
      "Two digital program guides",
      "Audience poll participation for two",
      "Entry to merchandise draw",
      "Network with film enthusiasts",
      "Pre-event updates",
    ],
  },
  {
    id: "vip-individual",
    name: "VIP Screening Experience (Individual)",
    priceNgn: 160000,
    description:
      "Elevate your film festival experience. This VIP pass offers premium access and an exclusive look behind the scenes.",
    note: "Get exclusive access and perks at CINESHOT.",
    badges: [
      { id: "vip-limited", label: "Limited seats available", tone: "blue" },
      { id: "vip-price", label: "Price increases Aug 30", tone: "amber" },
    ],
    perks: [
      "Priority seating at all screenings",
      "Q&A with filmmakers access",
      "Exclusive film merchandise",
      "Complimentary refreshment voucher",
      "Dedicated VIP check-in",
      "Photo op with featured guests",
    ],
  },
  {
    id: "vip-duo",
    name: "VIP Screening Experience (Duo)",
    priceNgn: 300000,
    description:
      "The VIP duo pass lets you and a guest experience the festival like true insiders.",
    note: "Buying 1 VIP Screening Experience Duo ticket gives you access to two prime tickets.",
    badges: [
      { id: "vip-duo-limited", label: "Limited group tickets available", tone: "blue" },
      { id: "vip-duo-size", label: "2 people per group", tone: "green" },
      { id: "vip-duo-price", label: "Price increases Aug 30", tone: "amber" },
    ],
    perks: [
      "Priority seating at all screenings for two",
      "Q&A with filmmakers access for two",
      "Two exclusive film merchandise items",
      "Two refreshment vouchers",
      "Dedicated VIP check-in for two",
      "Photo op with featured guests",
    ],
  },
  {
    id: "all-access",
    name: "Film Enthusiast All-Access Pass",
    priceNgn: 350000,
    description:
      "The ultimate pass for the dedicated cinephile. Unlock every aspect of the Campus Film Screening Tour and more.",
    badges: [
      { id: "all-access-limited", label: "Limited seats available", tone: "blue" },
      { id: "all-access-price", label: "Price increases Aug 30", tone: "amber" },
    ],
    perks: [
      "All VIP Screening perks included",
      "Private industry networking event invite",
      "Signed film poster (director/actor)",
      "Exclusive online masterclass access",
      "Guaranteed front-row panel seating",
      "Personalized festival lanyard and badge",
      "VIP lounge access all day",
      "Complimentary after-party entry",
    ],
  },
];

function getCountdown(targetISO: string) {
  const targetTime = new Date(targetISO).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, targetTime - now);

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);

  return { days, hours, minutes, seconds };
}

function EventCountdown({ targetISO }: { targetISO: string }) {
  const [countdown, setCountdown] = useState(() => getCountdown(targetISO));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown(getCountdown(targetISO));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetISO]);

  const slots = [
    { label: "Days", value: countdown.days },
    { label: "Hours", value: countdown.hours },
    { label: "Minutes", value: countdown.minutes },
    { label: "Seconds", value: countdown.seconds },
  ];

  return (
    <div className="rounded-2xl border border-[#e4e4e4] bg-white p-4">
      <h3 className="text-sm font-semibold text-[#2f2f2f]">Event Countdown</h3>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {slots.map((slot) => (
          <div key={slot.label} className="rounded-xl border border-[#e9e9e9] bg-[#fafafa] p-2 text-center">
            <p className="text-[30px] font-semibold leading-none text-[#1d1d1d]">
              {String(slot.value).padStart(2, "0")}
            </p>
            <p className="mt-1 text-[11px] text-[#7b7b7b]">{slot.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDateKeyFromISO(iso: string) {
  const [datePart] = iso.split("T");
  return datePart;
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatDateBadgeLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function MultiDateCalendar({
  monthDate,
  selectedDateKeys,
  availableDateKeys,
  onPreviousMonth,
  onNextMonth,
  onToggleDate,
}: {
  monthDate: Date;
  selectedDateKeys: string[];
  availableDateKeys: Set<string>;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToggleDate: (dateKey: string) => void;
}) {
  const monthStart = startOfMonth(monthDate);
  const monthLabel = monthStart.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const leadingDays = monthStart.getDay();
  const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
  const totalCells = Math.ceil((leadingDays + daysInMonth) / 7) * 7;
  const selectedSet = new Set(selectedDateKeys);

  return (
    <div className="rounded-2xl border border-[#e4e4e4] bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#2f2f2f]">{monthLabel}</h3>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Previous month"
            onClick={onPreviousMonth}
            className="grid h-6 w-6 place-items-center rounded-full border border-[#dfdfdf] text-[#666] transition hover:bg-[#f5f5f5]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={onNextMonth}
            className="grid h-6 w-6 place-items-center rounded-full border border-[#dfdfdf] text-[#666] transition hover:bg-[#f5f5f5]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {WEEK_DAYS.map((weekDay) => (
          <span key={weekDay} className="text-center text-[11px] text-[#8a8a8a]">
            {weekDay}
          </span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1.5">
        {Array.from({ length: totalCells }, (_, index) => {
          const dayNumber = index - leadingDays + 1;
          const isOutsideMonth = dayNumber < 1 || dayNumber > daysInMonth;

          if (isOutsideMonth) {
            return <span key={`empty-${index}`} className="block h-8" aria-hidden="true" />;
          }

          const dateValue = new Date(monthStart.getFullYear(), monthStart.getMonth(), dayNumber);
          const dateKey = toDateKey(dateValue);
          const isAvailable = availableDateKeys.has(dateKey);
          const isSelected = selectedSet.has(dateKey);

          return (
            <button
              key={dateKey}
              type="button"
              disabled={!isAvailable}
              onClick={() => onToggleDate(dateKey)}
              className={`h-8 rounded-md text-xs font-medium transition ${
                isSelected
                  ? "border border-[#5F00D0] bg-[#5F00D0] text-white"
                  : isAvailable
                    ? "border border-[#D8BFFF] bg-[#D8BFFF] text-[#2d2d2d] hover:brightness-95"
                    : "text-[#c6c6c6]"
              }`}
            >
              {dayNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function OpenStreetMapEmbed({
  latitude,
  longitude,
  address,
  height = 320,
}: {
  latitude: number;
  longitude: number;
  address: string;
  height?: number;
}) {
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const fullMapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const embedUrl = mapsApiKey
    ? `https://www.google.com/maps/embed/v1/view?key=${mapsApiKey}&center=${latitude},${longitude}&zoom=15&maptype=roadmap`
    : "";

  return (
    <div className="mt-4 overflow-hidden rounded-[12px] border border-[#dddddd] bg-white">
      {mapsApiKey ? (
        <iframe
          title={address}
          src={embedUrl}
          className="w-full"
          style={{ height }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div
          className="flex items-center justify-center bg-[#f8f8f8] text-sm text-[#6a6a6a]"
          style={{ height }}
        >
          Google Maps key is missing. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to view the map.
        </div>
      )}
      <div className="border-t border-[#ececec] px-3 py-2 text-[11px] text-[#666]">
        <a
          href={fullMapUrl}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-[#4a30f3] hover:underline"
        >
          View larger map
        </a>
      </div>
    </div>
  );
}

const CALENDAR_DURATION_MS = 2 * 60 * 60 * 1000;

function toUtcCalendarString(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function buildIcsContent({
  event,
  pageUrl,
  startISO,
}: {
  event: EventDetail;
  pageUrl: string;
  startISO: string;
}) {
  const startDate = new Date(startISO);
  const endDate = new Date(startDate.getTime() + CALENDAR_DURATION_MS);
  const nowStamp = toUtcCalendarString(new Date());
  const startStamp = toUtcCalendarString(startDate);
  const endStamp = toUtcCalendarString(endDate);
  const uid = `${event.id}-${startStamp}@konfera`;
  const escapeIcsText = (text: string) =>
    text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Konfera//Event Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${nowStamp}`,
    `DTSTART:${startStamp}`,
    `DTEND:${endStamp}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(`${event.description[0] ?? ""}\\n${pageUrl}`)}`,
    `LOCATION:${escapeIcsText(event.locationAddress)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function formatNgnAmount(amount: number) {
  return `NGN ${amount.toLocaleString("en-NG")}`;
}

function getBadgeToneClasses(tone: TicketBadgeTone) {
  if (tone === "amber") {
    return "border-[#FFE2A8] bg-[#FFF7E8] text-[#CF8A00]";
  }
  if (tone === "green") {
    return "border-[#BAF3CB] bg-[#ECFFF3] text-[#1E9152]";
  }
  return "border-[#B8DFFF] bg-[#EEF6FF] text-[#3D82D6]";
}

function GetTicketModal({
  isOpen,
  onClose,
  event,
  selectedDaysCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  event: EventDetail;
  selectedDaysCount: number;
}) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [collapsedTierMap, setCollapsedTierMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const nextQuantities: Record<string, number> = {};
    const nextCollapsedTierMap: Record<string, boolean> = {};
    for (const tier of defaultTicketTiers) {
      nextQuantities[tier.id] = 0;
      nextCollapsedTierMap[tier.id] = false;
    }
    setQuantities(nextQuantities);
    setCollapsedTierMap(nextCollapsedTierMap);
  }, [event.id]);

  if (!isOpen) return null;

  const updateQuantity = (tierId: string, diff: number) => {
    setQuantities((currentQuantities) => {
      const currentValue = currentQuantities[tierId] ?? 0;
      return {
        ...currentQuantities,
        [tierId]: Math.max(0, currentValue + diff),
      };
    });
  };

  const totalTicketCount = defaultTicketTiers.reduce(
    (sum, tier) => sum + (quantities[tier.id] ?? 0),
    0,
  );

  const totalAmount = defaultTicketTiers.reduce(
    (sum, tier) => sum + (quantities[tier.id] ?? 0) * tier.priceNgn,
    0,
  );

  const toggleTierExpand = (tierId: string) => {
    setCollapsedTierMap((currentState) => ({
      ...currentState,
      [tierId]: !currentState[tierId],
    }));
  };

  const handleProceedToCheckout = () => {
    if (totalTicketCount === 0) return;

    if (typeof window !== "undefined") {
      const selectedTickets = defaultTicketTiers
        .filter((tier) => (quantities[tier.id] ?? 0) > 0)
        .map((tier) => ({
          id: tier.id,
          name: tier.name,
          quantity: quantities[tier.id],
          unitPriceNgn: tier.priceNgn,
        }));

      sessionStorage.setItem(
        "pendingTicketSelection",
        JSON.stringify({
          eventId: event.id,
          eventTitle: event.title,
          selectedDaysCount,
          totalAmount,
          selectedTickets,
        }),
      );
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] bg-[#2f3136]/85">
      <button
        type="button"
        aria-label="Close get ticket modal"
        className="absolute inset-0 h-full w-full"
        onClick={onClose}
      />

      <div className="relative mx-auto flex h-[100dvh] w-full max-w-[470px] flex-col overflow-hidden border-[#d9d9d9] bg-[#f3f4f6] sm:my-2 sm:h-[calc(100dvh-16px)] sm:rounded-[16px] sm:border">
        <div className="flex items-center justify-between border-b border-[#dddddd] px-5 py-4">
          <p className="text-[18px] font-medium leading-tight text-[#272727] sm:text-[20px] md:text-[22px]">
            CINEFLIX by STUDIO G
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-full bg-black text-white transition hover:opacity-90"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-36 pt-4">
          <div className="mx-auto max-w-[395px]">
            <div className="relative h-[128px] overflow-hidden rounded-[10px] border border-[#d4d7de]">
              <Image src={event.heroImage} alt={event.title} fill className="object-cover" />
            </div>
          </div>

          <h2 className="mt-4 text-center text-[26px] font-semibold leading-tight text-[#1f2533] sm:text-[30px]">
            Event Tickets
          </h2>
          <p className="mx-auto mt-2 max-w-[360px] text-center text-[14px] leading-6 text-[#6f7785] sm:text-[16px]">
            Select the ticket type and quantity that suit you best!
          </p>

          {selectedDaysCount > 0 ? (
            <p className="mt-3 text-center text-[16px] text-[#5f16ff] sm:text-sm">
              {selectedDaysCount} selected day{selectedDaysCount > 1 ? "s" : ""}
            </p>
          ) : null}

          <div className="mt-5 space-y-4">
            {defaultTicketTiers.map((tier) => {
              const quantity = quantities[tier.id] ?? 0;
              const isCollapsed = collapsedTierMap[tier.id] ?? false;
              const visiblePerks = isCollapsed ? tier.perks.slice(0, 5) : tier.perks;
              const remainingPerkCount = Math.max(0, tier.perks.length - visiblePerks.length);

              return (
                <article key={tier.id} className="rounded-[12px] border border-[#d9dde5] bg-[#f6f7f9] p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {tier.badges.map((badge) => (
                      <span
                        key={badge.id}
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${getBadgeToneClasses(
                          badge.tone,
                        )}`}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold leading-5 text-[#273247]">{tier.name}</p>
                      <p className="mt-2 text-[30px] font-bold leading-none text-[#121721] sm:text-[32px]">
                        {formatNgnAmount(tier.priceNgn)}
                      </p>
                    </div>

                    <div className="mt-1 inline-flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={`Decrease quantity for ${tier.name}`}
                        onClick={() => updateQuantity(tier.id, -1)}
                        className={`grid h-11 w-11 place-items-center rounded-full text-[24px] leading-none ${
                          quantity === 0
                            ? "bg-[#b8c4ff] text-white"
                            : "bg-black text-white hover:opacity-90"
                        }`}
                      >
                        -
                      </button>
                      <span className="min-w-[12px] text-center text-xl font-medium text-[#1f1f1f]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity for ${tier.name}`}
                        onClick={() => updateQuantity(tier.id, 1)}
                        className="grid h-11 w-11 place-items-center rounded-full bg-black text-[24px] leading-none text-white hover:opacity-90"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {tier.note ? (
                    <p className="mt-4 text-[14px] leading-6 text-[#77839A] sm:text-sm">{tier.note}</p>
                  ) : null}
                  <p className="mt-3 text-[14px] leading-6 text-[#6d7789] sm:text-sm sm:leading-6">
                    {isCollapsed ? `${tier.description.slice(0, 105)}...` : tier.description}
                  </p>

                  <button
                    type="button"
                    onClick={() => toggleTierExpand(tier.id)}
                    className="mt-2 text-left text-[13px] font-medium leading-6 text-[#20242e] underline sm:text-xs"
                  >
                    {isCollapsed ? "Show more" : "Show less"}
                  </button>

                  <div className="mt-3 rounded-[10px] border border-[#dfe3eb] bg-[#f7f8fb] p-2.5">
                    <p className="text-[13px] font-medium leading-7 text-[#6c7687] sm:text-xs">Perks</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {visiblePerks.map((perk) => (
                        <span
                          key={perk}
                          className="inline-flex items-center rounded-full bg-[#e4edf6] px-2.5 py-1 text-[11px] font-medium text-[#52637f]"
                        >
                          <span className="mr-1.5 text-[10px]">🎁</span>
                          {perk}
                        </span>
                      ))}
                      {remainingPerkCount > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-[#e4edf6] px-2.5 py-1 text-[11px] font-medium text-[#52637f]">
                          + {remainingPerkCount} more
                        </span>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-[#dbdee5] bg-[#f3f4f6] px-4 pb-4 pt-3">
          {totalAmount > 0 ? (
            <p className="mb-2 text-[18px] text-[#1d1d1d] sm:text-base">
              <span className="font-semibold">{formatNgnAmount(totalAmount)}</span>
              <span className="ml-1 text-[#4b4b4b]">due today</span>
            </p>
          ) : null}
          <button
            type="button"
            onClick={handleProceedToCheckout}
            className="flex h-[46px] w-full items-center justify-center rounded-full bg-black px-5 text-[16px] font-semibold text-white"
          >
            <span>Proceed to Checkout</span>
            <ChevronRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AddToCalendarModal({
  isOpen,
  onClose,
  event,
  selectedDateISO,
}: {
  isOpen: boolean;
  onClose: () => void;
  event: EventDetail;
  selectedDateISO?: string;
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const activeStartISO = selectedDateISO ?? event.startsAtISO;
  const startDate = new Date(activeStartISO);
  const endDate = new Date(startDate.getTime() + CALENDAR_DURATION_MS);

  const googleCalendarUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(event.title)}` +
    `&dates=${toUtcCalendarString(startDate)}/${toUtcCalendarString(endDate)}` +
    `&details=${encodeURIComponent(`${event.description[0] ?? ""}\n${pageUrl}`)}` +
    `&location=${encodeURIComponent(event.locationAddress)}`;

  const outlookCalendarUrl =
    "https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent" +
    `&subject=${encodeURIComponent(event.title)}` +
    `&startdt=${encodeURIComponent(startDate.toISOString())}` +
    `&enddt=${encodeURIComponent(endDate.toISOString())}` +
    `&location=${encodeURIComponent(event.locationAddress)}` +
    `&body=${encodeURIComponent(`${event.description[0] ?? ""}\n${pageUrl}`)}`;

  const downloadIcsFile = () => {
    const icsContent = buildIcsContent({ event, pageUrl, startISO: activeStartISO });
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = `${event.id}.ics`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(blobUrl);
  };

  const eventDate = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-[95] bg-[#2f3136]/80 p-2 sm:p-4">
      <button
        type="button"
        aria-label="Close add to calendar modal"
        className="absolute inset-0 h-full w-full"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add to calendar"
        className="relative mx-auto mt-10 w-full max-w-[610px] rounded-[30px] bg-[#f3f4f6] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.22)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid h-8 w-8 place-items-center rounded-full text-[#4e4e4e] transition hover:bg-[#e8eaed]"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mt-2 text-[32px] font-semibold leading-tight text-[#1f2533]">
          Add to Calendar
        </h2>

        <div className="mt-6 flex items-start gap-3">
          <div className="relative h-[58px] w-[58px] shrink-0 overflow-hidden rounded-[10px]">
            <Image src={event.heroImage} alt={event.title} fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="truncate pr-2 text-[16px] font-semibold leading-6 text-[#1f2533]">
              {event.title} . {eventDate}
            </p>
            <p
              className="mt-0.5 text-[14px] font-normal leading-6 text-[#646a76]"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {event.locationAddress}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
          <button
            type="button"
            onClick={() => window.open(googleCalendarUrl, "_blank", "noopener,noreferrer")}
            className="flex h-[54px] items-center gap-3 rounded-[12px] border border-[#d0d4db] bg-[#f3f4f6] px-4 text-base font-normal text-[#2f3642]"
          >
            <Image src={googleCalendarLogo} alt="Google Calendar" width={18} height={18} />
            Google Calendar
          </button>

          <button
            type="button"
            onClick={downloadIcsFile}
            className="flex h-[54px] items-center gap-3 rounded-[12px] border border-[#d0d4db] bg-[#f3f4f6] px-4 text-base font-normal text-[#2f3642]"
          >
            <Image src={appleLogo} alt="Apple iCal" width={18} height={18} />
            iCal
          </button>

          <button
            type="button"
            onClick={() => window.open(outlookCalendarUrl, "_blank", "noopener,noreferrer")}
            className="flex h-[54px] items-center gap-3 rounded-[12px] border border-[#d0d4db] bg-[#f3f4f6] px-4 text-base font-normal text-[#2f3642]"
          >
            <Image src={microsoftOutlookLogo} alt="Microsoft Outlook" width={18} height={18} />
            Microsoft Outlook
          </button>

          <button
            type="button"
            onClick={downloadIcsFile}
            className="flex h-[54px] items-center gap-3 rounded-[12px] border border-[#d0d4db] bg-[#f3f4f6] px-4 text-base font-normal text-[#2f3642]"
          >
            <Image src={fileDownloadIcon} alt="Download .ics file" width={18} height={18} />
            .ics, ical, .vcs
          </button>
        </div>
      </div>
    </div>
  );
}

function ShareEventModal({
  isOpen,
  onClose,
  event,
}: {
  isOpen: boolean;
  onClose: () => void;
  event: EventDetail;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const eventDate = new Date(event.startsAtISO).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const shareTitle = `${event.title} . ${eventDate}`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareBody = `${shareTitle}\n${event.locationAddress}\n${shareUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  const openExternalShare = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleMoreOptions = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: event.title,
        text: `${event.title} - ${event.locationAddress}`,
        url: shareUrl,
      });
    } catch {
      // User cancelled share action.
    }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-[#2f3136]/80 p-2 sm:p-4">
      <button
        type="button"
        aria-label="Close share modal"
        className="absolute inset-0 h-full w-full"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Share this event"
        className="relative mx-auto mt-8 w-full max-w-[620px] rounded-[30px] bg-[#f3f4f6] p-7 shadow-[0_20px_50px_rgba(0,0,0,0.22)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid h-8 w-8 place-items-center rounded-full text-[#4e4e4e] transition hover:bg-[#e8eaed]"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mt-2 text-[32px] font-semibold leading-tight text-[#1f2533]">
          Share this event
        </h2>

        <div className="mt-6 flex items-start gap-3">
          <div className="relative h-[58px] w-[58px] shrink-0 overflow-hidden rounded-[10px]">
            <Image src={event.heroImage} alt={event.title} fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="truncate pr-2 text-[16px] font-semibold leading-6 text-[#1f2533]">
              {shareTitle}
            </p>
            <p
              className="mt-0.5 text-[14px] font-normal leading-6 text-[#646a76]"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {event.locationAddress}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex h-[54px] items-center gap-3 rounded-[12px] border border-[#d0d4db] bg-[#f3f4f6] px-4 text-base font-normal text-[#2f3642]"
          >
            <Copy className="h-[18px] w-[18px]" />
            {copied ? "Copied" : "Copy Link"}
          </button>

          <button
            type="button"
            onClick={() =>
              openExternalShare(
                `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareBody)}`,
              )
            }
            className="flex h-[54px] items-center gap-3 rounded-[12px] border border-[#d0d4db] bg-[#f3f4f6] px-4 text-base font-normal text-[#2f3642]"
          >
            <Mail className="h-[18px] w-[18px]" />
            Email
          </button>

          <button
            type="button"
            onClick={() =>
              openExternalShare(`sms:?&body=${encodeURIComponent(`${shareTitle}\n${shareUrl}`)}`)
            }
            className="flex h-[54px] items-center gap-3 rounded-[12px] border border-[#d0d4db] bg-[#f3f4f6] px-4 text-base font-normal text-[#2f3642]"
          >
            <MessageSquare className="h-[18px] w-[18px]" />
            Messages
          </button>

          <button
            type="button"
            onClick={() =>
              openExternalShare(
                `https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n${shareUrl}`)}`,
              )
            }
            className="flex h-[54px] items-center gap-3 rounded-[12px] border border-[#d0d4db] bg-[#f3f4f6] px-4 text-base font-normal text-[#2f3642]"
          >
            <Image
              src={whatsappLogo}
              alt="WhatsApp"
              width={18}
              height={18}
              style={{ filter: "grayscale(1) brightness(0)" }}
            />
            WhatsApp
          </button>

          <button
            type="button"
            onClick={() =>
              openExternalShare(
                `https://www.messenger.com/share?link=${encodeURIComponent(shareUrl)}`,
              )
            }
            className="flex h-[54px] items-center gap-3 rounded-[12px] border border-[#d0d4db] bg-[#f3f4f6] px-4 text-base font-normal text-[#2f3642]"
          >
            <Image
              src={messengerLogo}
              alt="Messenger"
              width={18}
              height={18}
              style={{ filter: "grayscale(1) brightness(0)" }}
            />
            Messenger
          </button>

          <button
            type="button"
            onClick={() =>
              openExternalShare(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
              )
            }
            className="flex h-[54px] items-center gap-3 rounded-[12px] border border-[#d0d4db] bg-[#f3f4f6] px-4 text-base font-normal text-[#2f3642]"
          >
            <Facebook className="h-[18px] w-[18px]" />
            Facebook
          </button>

          <button
            type="button"
            onClick={() =>
              openExternalShare(
                `https://x.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(
                  shareUrl,
                )}`,
              )
            }
            className="flex h-[54px] items-center gap-3 rounded-[12px] border border-[#d0d4db] bg-[#f3f4f6] px-4 text-base font-normal text-[#2f3642]"
          >
            <span className="text-base font-semibold">X</span>
            X
          </button>

          <button
            type="button"
            onClick={handleMoreOptions}
            className="flex h-[54px] items-center gap-3 rounded-[12px] border border-[#d0d4db] bg-[#f3f4f6] px-4 text-base font-normal text-[#2f3642]"
          >
            <Ellipsis className="h-[18px] w-[18px]" />
            More Options
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SingleDateEventDetailPage() {
  const params = useParams<{ id: string }>();
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedDateKeys, setSelectedDateKeys] = useState<string[]>([]);
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(new Date()));
  const [selectedTicketOptionId, setSelectedTicketOptionId] = useState("");
  const idParam = useMemo(() => {
    if (!params?.id) return "";
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params]);

  const event = eventDetailsMap[idParam];
  const availableDateMap = useMemo(() => {
    const dateMap = new Map<string, string>();
    if (!event?.isMultiDate) return dateMap;

    const sourceDates = event.availableDateISOs?.length
      ? event.availableDateISOs
      : [event.startsAtISO];
    for (const iso of sourceDates) {
      const dateKey = getDateKeyFromISO(iso);
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, iso);
      }
    }
    return dateMap;
  }, [event]);
  const availableDateKeys = useMemo(() => new Set(availableDateMap.keys()), [availableDateMap]);
  const isMultiDateEvent = Boolean(event?.isMultiDate && availableDateMap.size > 0);
  const selectedDateISOs = useMemo(
    () =>
      selectedDateKeys
        .map((dateKey) => availableDateMap.get(dateKey))
        .filter((iso): iso is string => Boolean(iso)),
    [selectedDateKeys, availableDateMap],
  );
  const selectedDaysCount = selectedDateISOs.length;
  const activeEventStartISO = selectedDateISOs[0] ?? event?.startsAtISO ?? "";
  const availableTicketOptions = event?.ticketOptions ?? [];
  const isPrimaryActionDisabled = isMultiDateEvent && selectedDaysCount === 0;
  const primaryActionText =
    isMultiDateEvent && selectedDaysCount === 0 ? "Select a date to continue" : "Get Tickets";

  useEffect(() => {
    if (!event) return;

    if (!event.isMultiDate) {
      setSelectedDateKeys([]);
      setSelectedTicketOptionId("");
      setCalendarMonth(startOfMonth(new Date(event.startsAtISO)));
      return;
    }

    const sourceDates = event.availableDateISOs?.length ? event.availableDateISOs : [event.startsAtISO];
    const firstDateKey = getDateKeyFromISO(sourceDates[0]);
    setSelectedDateKeys([]);
    setCalendarMonth(startOfMonth(parseDateKey(firstDateKey)));
    setSelectedTicketOptionId(event.ticketOptions?.[0]?.id ?? "");
  }, [event]);

  const handleToggleDate = (dateKey: string) => {
    if (!availableDateKeys.has(dateKey)) return;
    setSelectedDateKeys((currentDateKeys) => {
      if (currentDateKeys.includes(dateKey)) {
        return currentDateKeys.filter((key) => key !== dateKey);
      }

      return [...currentDateKeys, dateKey].sort((firstKey, secondKey) =>
        firstKey.localeCompare(secondKey),
      );
    });
  };

  const handlePrimaryAction = () => {
    if (isPrimaryActionDisabled) return;
    setIsTicketModalOpen(true);
  };

  if (!event) {
    return (
      <main className="min-h-screen bg-[#f2f2f2]">
        <div className={`${horizontalPadding} py-16`}>
          <div className="mx-auto max-w-[960px] rounded-2xl border border-[#e4e4e4] bg-white p-8 text-center">
            <h1 className="text-2xl font-semibold text-[#222]">Event not found</h1>
            <p className="mt-2 text-sm text-[#666]">
              The event detail page for this ID is not available.
            </p>
            <Link
              href="/events"
              className="mt-6 inline-flex rounded-full bg-[#5f16ff] px-6 py-2.5 text-sm font-semibold text-white"
            >
              Back to events
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f2f2f2] text-[#1b1b1b]">
      <header className="border-b border-[#e6e6e6] bg-[rgba(254,254,254,0.5)] backdrop-blur-[8px]">
        <div className="mx-auto w-full max-w-[1700px]">
          <div className={`flex h-[64px] items-center justify-between gap-4 ${horizontalPadding}`}>
            <div className="flex min-w-0 items-center gap-4">
              <Link href="/events" className="flex shrink-0 items-center gap-2">
                <Image
                  src="/images/logo-icon.svg"
                  alt="Konfera"
                  width={22}
                  height={22}
                  className="h-[22px] w-[22px]"
                />
                <span className="text-sm font-semibold tracking-[0.08em] text-[#4a30f3]">
                  KONFERA
                </span>
              </Link>
              <label className="hidden h-11 w-[300px] items-center rounded-[12px] bg-[#EEF2F7] px-4 md:flex">
                <input
                  aria-label="Search events"
                  className="w-full border-0 bg-transparent text-base text-[#5E6E82] outline-none placeholder:text-[#64748B]"
                  placeholder="Search"
                />
                <Search className="h-5 w-5 text-[#1F1F1F]" />
              </label>
            </div>

            <div className="hidden items-center gap-5 text-sm text-[#4a4a4a] md:flex">
              <button type="button" className="font-medium hover:text-[#1f1f1f]">
                Create Events
              </button>
              <button type="button" className="font-medium hover:text-[#1f1f1f]">
                My tickets
              </button>
              <button
                type="button"
                aria-label="My profile"
                className="relative h-9 w-9 overflow-hidden rounded-full border border-[#d5d5d5] bg-[#fafafa]"
              >
                <UserCircle2 className="h-9 w-9 text-[#7a7a7a]" />
              </button>
            </div>

            <div className="md:hidden">
              <button
                type="button"
                aria-label="My profile"
                className="relative h-9 w-9 overflow-hidden rounded-full border border-[#d5d5d5] bg-[#fafafa]"
              >
                <Image src="/placeholder-user.jpg" alt="User profile" fill className="object-cover" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={`mx-auto w-full max-w-[1700px] py-6 lg:py-8 ${horizontalPadding}`}>
        <div className="relative h-[220px] overflow-hidden rounded-[16px] md:h-[300px] lg:h-[360px] xl:h-[470px] 2xl:h-[520px]">
          <Image
            src={event.heroImage}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1700px"
            priority
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:gap-8">
          <div>
            <section className="border-b border-[#dddddd] pb-6">
              <p className="text-xs font-medium text-[#4a30f3]">{event.tag}</p>
              <h1 className="mt-1 text-[28px] font-semibold leading-tight text-[#1f1f1f] md:text-[34px]">
                {event.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#636363]">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {isMultiDateEvent
                    ? selectedDaysCount === 0
                      ? "Multiple dates available"
                      : selectedDaysCount === 1
                        ? formatDateBadgeLabel(activeEventStartISO)
                        : `${selectedDaysCount} days selected`
                    : formatDateBadgeLabel(event.startsAtISO)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4" />
                  {event.timeLabel}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {event.locationName}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrimaryAction}
                  disabled={isPrimaryActionDisabled}
                  className={`rounded-full px-5 py-2 text-sm font-semibold text-white ${
                    isPrimaryActionDisabled
                      ? "cursor-not-allowed bg-[#bca8ff]"
                      : "bg-[#5f16ff] hover:bg-[#4d12da]"
                  }`}
                >
                  {primaryActionText}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCalendarModalOpen(true)}
                  className="inline-flex items-center gap-1 rounded-full border border-[#dddddd] bg-white px-4 py-2 text-sm text-[#4d4d4d]"
                >
                  <CalendarPlus2 className="h-4 w-4" />
                  Add to Calendar
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[#dddddd] bg-white px-4 py-2 text-sm text-[#4d4d4d]"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="inline-flex items-center gap-1 rounded-full border border-[#dddddd] bg-white px-4 py-2 text-sm text-[#4d4d4d]"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
              {isMultiDateEvent ? (
                <p className="mt-2 text-xs text-[#686868]">
                  Select one or more available days from the calendar, then continue with ticket
                  type selection.
                </p>
              ) : null}
            </section>

            <section className="border-b border-[#dddddd] py-6">
              <h2 className="text-lg font-semibold text-[#212121]">About this event</h2>
              <div className="mt-3 space-y-3 text-sm leading-7 text-[#505050]">
                {event.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="border-b border-[#dddddd] py-6">
              <h2 className="text-lg font-semibold text-[#212121]">Where you&apos;ll be</h2>
              <p className="mt-2 text-sm text-[#666]">{event.locationAddress}</p>
              <OpenStreetMapEmbed
                latitude={event.latitude}
                longitude={event.longitude}
                address={event.locationAddress}
                height={460}
              />
            </section>

            <section className="border-b border-[#dddddd] py-6">
              <h2 className="text-lg font-semibold text-[#212121]">Moments from the past</h2>
              <div className="mt-4 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {event.galleryImages.map((image, index) => (
                  <div
                    key={`${event.id}-moment-${index + 1}`}
                    className="relative h-[160px] overflow-hidden border border-[#d7d7d7]"
                  >
                    <Image
                      src={image}
                      alt={`${event.title} moment ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 271px"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="flex h-[160px] items-center justify-center border border-[#d7d7d7] bg-white text-[38px] font-semibold text-[#101010]"
                >
                  See more
                </button>
              </div>
            </section>

            <section className="py-6">
              <h2 className="text-lg font-semibold text-[#212121]">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="mt-3">
                {event.faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`item-${index + 1}`}>
                    <AccordionTrigger className="text-left text-sm text-[#2f2f2f] hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-7 text-[#5d5d5d]">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            {isMultiDateEvent ? (
              <MultiDateCalendar
                monthDate={calendarMonth}
                selectedDateKeys={selectedDateKeys}
                availableDateKeys={availableDateKeys}
                onPreviousMonth={() =>
                  setCalendarMonth(
                    (currentMonth) =>
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
                  )
                }
                onNextMonth={() =>
                  setCalendarMonth(
                    (currentMonth) =>
                      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
                  )
                }
                onToggleDate={handleToggleDate}
              />
            ) : null}

            <EventCountdown targetISO={activeEventStartISO || event.startsAtISO} />

            <div className="rounded-2xl border border-[#e4e4e4] bg-white p-4">
              <h3 className="text-sm font-semibold text-[#2f2f2f]">Event metrics</h3>
              <div className="mt-3 space-y-2.5 text-sm">
                {event.metrics.map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between text-[#4f4f4f]">
                    <span>{metric.label}</span>
                    <span className="font-medium text-[#2d2d2d]">{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#e4e4e4] bg-white p-4">
              <h3 className="text-sm font-semibold text-[#2f2f2f]">What&apos;s included</h3>
              <ul className="mt-3 space-y-2.5 text-sm text-[#4f4f4f]">
                {event.includes.map((item) => (
                  <li key={item} className="inline-flex w-full items-center gap-2">
                    <Check className="h-4 w-4 text-[#5f16ff]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#e4e4e4] bg-white p-4">
              <h3 className="text-sm font-semibold text-[#2f2f2f]">Meet your organizer</h3>
              <div className="mt-3 flex items-start gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full border border-[#dfdfdf]">
                  <Image src="/placeholder-user.jpg" alt={event.organizer.name} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#2d2d2d]">{event.organizer.name}</p>
                  <p className="text-xs text-[#767676]">{event.organizer.role}</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-6 text-[#5f5f5f]">{event.organizer.bio}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="rounded-full border border-[#dddddd] bg-white px-3 py-2 text-xs font-medium text-[#3f3f3f]"
                >
                  Contact Organizer
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[#dddddd] bg-white px-3 py-2 text-xs font-medium text-[#3f3f3f]"
                >
                  See More Events
                </button>
              </div>
            </div>

            {isMultiDateEvent ? (
              <div id="ticket-options" className="rounded-2xl border border-[#e4e4e4] bg-white p-4">
                <h3 className="text-sm font-semibold text-[#2f2f2f]">Ticket options</h3>
                <div className="mt-3 space-y-2">
                  {availableTicketOptions.length > 0 ? (
                    availableTicketOptions.map((ticketOption) => {
                      const isSelected = selectedTicketOptionId === ticketOption.id;
                      return (
                        <button
                          key={ticketOption.id}
                          type="button"
                          onClick={() => setSelectedTicketOptionId(ticketOption.id)}
                          className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
                            isSelected
                              ? "border-[#5f16ff] bg-[#f5f0ff] text-[#2c215a]"
                              : "border-[#dddddd] bg-white text-[#404040] hover:border-[#c7c7c7]"
                          }`}
                        >
                          <span className="font-medium">{ticketOption.name}</span>
                          <span className="font-semibold">{ticketOption.price}</span>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-sm text-[#5a5a5a]">No ticket types available yet.</p>
                  )}
                </div>
                <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#242424]">
                  <Ticket className="h-4 w-4 text-[#5f16ff]" />
                  {selectedDaysCount === 0
                    ? "Select at least one date to continue"
                    : `${selectedDaysCount} day${selectedDaysCount > 1 ? "s" : ""} selected`}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#e4e4e4] bg-white p-4">
                <p className="inline-flex items-center gap-2 text-sm text-[#4f4f4f]">
                  <Star className="h-4 w-4 text-[#ffb400]" />
                  Single-date event experience
                </p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#242424]">
                  <Ticket className="h-4 w-4 text-[#5f16ff]" />
                  from {event.priceFrom}
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>

      <ShareEventModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        event={event}
      />
      <GetTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        event={event}
        selectedDaysCount={selectedDaysCount}
      />
      <AddToCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        event={event}
        selectedDateISO={selectedDateISOs[0]}
      />
    </main>
  );
}
