"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  CalendarPlus2,
  Check,
  Clock3,
  MapPin,
  Search,
  Share2,
  Star,
  Ticket,
  UserCircle2,
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
  const bboxDelta = 0.015;
  const left = longitude - bboxDelta;
  const right = longitude + bboxDelta;
  const top = latitude + bboxDelta;
  const bottom = latitude - bboxDelta;

  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  const fullMapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;

  return (
    <div className="mt-4 overflow-hidden rounded-[12px] border border-[#dddddd] bg-white">
      <iframe
        title={address}
        src={embedUrl}
        className="w-full"
        style={{ height }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
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

export default function SingleDateEventDetailPage() {
  const params = useParams<{ id: string }>();
  const idParam = useMemo(() => {
    if (!params?.id) return "";
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params]);

  const event = eventDetailsMap[idParam];

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
              <label className="hidden h-9 w-[280px] items-center gap-2 rounded-md border border-[#d8d8d8] bg-[#f8f8f8] px-3 md:flex">
                <Search className="h-4 w-4 text-[#767676]" />
                <input
                  aria-label="Search events"
                  className="w-full border-0 bg-transparent text-sm text-[#1e1e1e] outline-none placeholder:text-[#9e9e9e]"
                  placeholder="Search"
                />
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
                  {new Date(event.startsAtISO).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
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
                  className="rounded-full bg-[#5f16ff] px-5 py-2 text-sm font-semibold text-white"
                >
                  Get Tickets
                </button>
                <button
                  type="button"
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
                  className="inline-flex items-center gap-1 rounded-full border border-[#dddddd] bg-white px-4 py-2 text-sm text-[#4d4d4d]"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
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
            <EventCountdown targetISO={event.startsAtISO} />

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
          </aside>
        </div>
      </div>
    </main>
  );
}
