"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import cardImgOne from "@/images/card-img 1.png";
import cardImgTwo from "@/images/card-img 2.png";
import cardImgThree from "@/images/card-img 3.png";
import cardImgFour from "@/images/card-img 4.png";
import heroOne from "@/images/hero-section1.png";
import heroTwo from "@/images/hero-section 2.png";
import heroThree from "@/images/hero-section 3.png";
import heroFour from "@/images/hero-section 4.png";
import {
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Compass,
  Flame,
  Gamepad2,
  Heart,
  Landmark,
  MapPin,
  Menu,
  Mic2,
  Music2,
  PartyPopper,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Ticket,
  Timer,
  TreePine,
  UtensilsCrossed,
  Waves,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type TouchEvent,
} from "react";

type CategoryKey =
  | "all"
  | "hackathon"
  | "fashion"
  | "foodDrink"
  | "sport"
  | "travel"
  | "conference"
  | "festival"
  | "nightlife"
  | "bootcamp"
  | "esports"
  | "hangout"
  | "wellness";

type HeroSlide = {
  title: string;
  description: string;
  cta: string;
  image: StaticImageData;
  overlay: string;
  category: CategoryKey;
};

type Category = {
  key: Exclude<CategoryKey, "all">;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

type BackendEvent = {
  id: string;
  title: string;
  image: string;
  location: string;
  latitude: number;
  longitude: number;
  isFree: boolean;
  isLive: boolean;
  rating: number;
  ticketsSold: number;
  startDate: string;
};

type EventView = BackendEvent & {
  category: Exclude<CategoryKey, "all">;
  tag: string;
};

type EventStatus = "popular" | "limitedSpots" | "sellingFast";

const horizontalPadding = "px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16";
const pageContainer = "mx-auto w-full max-w-[1720px]";
const profileFallback = { latitude: 6.4551, longitude: 3.3942 };
const swipeThreshold = 48;

const heroSlides: HeroSlide[] = [
  {
    title: "Experience the magic of Christmas",
    description:
      "Explore festive events filled with holiday cheer, from carol nights to Christmas markets, family gatherings, and cozy seasonal activities.",
    cta: "Find Christmas Events",
    image: heroOne,
    overlay: "rgba(0,0,0,0.18)",
    category: "festival",
  },
  {
    title: "Catch the season by the waves",
    description:
      "Explore beach parties, bonfire nights, sunrise meetups, and chill hangouts perfect for seasonal relaxation and connection",
    cta: "Find Beach Events",
    image: heroTwo,
    overlay: "rgba(0,0,0,0.22)",
    category: "travel",
  },
  {
    title: "Start the year with unforgettable moments",
    description:
      "Discover exciting New Year events, from fireworks to countdown parties, brunches, concerts, and citywide celebrations.",
    cta: "Find New Year Events",
    image: heroThree,
    overlay: "rgba(0,0,0,0.3)",
    category: "nightlife",
  },
  {
    title: "Taste the flavors of the season",
    description:
      "Enjoy themed dinners, brunches, tasting menus, and culinary experiences that celebrate seasonal ingredients and festive moments",
    cta: "Find Food Events",
    image: heroFour,
    overlay: "rgba(0,0,0,0.3)",
    category: "foodDrink",
  },
];

const categories: Category[] = [
  { key: "hackathon", label: "Hackathon", icon: Sparkles },
  { key: "fashion", label: "Fashion", icon: ShoppingBag },
  { key: "foodDrink", label: "Food & Drink", icon: UtensilsCrossed },
  { key: "sport", label: "Sport", icon: PartyPopper },
  { key: "travel", label: "Travel", icon: Ticket },
  { key: "conference", label: "Conference", icon: Landmark },
  { key: "festival", label: "Festival", icon: Music2 },
  { key: "nightlife", label: "Nightlife", icon: Mic2 },
  { key: "bootcamp", label: "Bootcamp", icon: Compass },
  { key: "esports", label: "Esports", icon: Gamepad2 },
  { key: "hangout", label: "Hangout", icon: Waves },
  { key: "wellness", label: "Wellness", icon: TreePine },
];

const categoryLabels = categories.reduce(
  (acc, c) => ({ ...acc, [c.key]: c.label }),
  {} as Record<Exclude<CategoryKey, "all">, string>,
);

const imageMap: Record<string, StaticImageData> = {
  "/images/card-img 1.png": cardImgOne,
  "/images/card-img 2.png": cardImgTwo,
  "/images/card-img 3.png": cardImgThree,
  "/images/card-img 4.png": cardImgFour,
};

const backendEvents: BackendEvent[] = [
  {
    id: "adventure",
    title: "AfroBeats Explosion",
    image: "/images/card-img 1.png",
    location: "Lagos",
    latitude: 6.4698,
    longitude: 3.5852,
    isFree: false,
    isLive: false,
    rating: 4.8,
    ticketsSold: 1257,
    startDate: "2026-11-13T10:00:00+01:00",
  },
  {
    id: "future",
    title: "Future of AI Summit",
    image: "/images/card-img 2.png",
    location: "Lagos",
    latitude: 6.4302,
    longitude: 3.4198,
    isFree: false,
    isLive: true,
    rating: 4.8,
    ticketsSold: 1182,
    startDate: "2026-11-13T10:00:00+01:00",
  },
  {
    id: "taste",
    title: "Taste of Naija",
    image: "/images/card-img 3.png",
    location: "Lagos",
    latitude: 6.6083,
    longitude: 3.3495,
    isFree: true,
    isLive: true,
    rating: 4.8,
    ticketsSold: 891,
    startDate: "2026-11-13T10:00:00+01:00",
  },
  {
    id: "echoes",
    title: "Echoes of the Ancestors",
    image: "/images/card-img 4.png",
    location: "Lagos",
    latitude: 6.4312,
    longitude: 3.4214,
    isFree: false,
    isLive: false,
    rating: 4.8,
    ticketsSold: 1468,
    startDate: "2026-11-13T10:00:00+01:00",
  },
];

const eventCategoryMap: Record<string, Exclude<CategoryKey, "all">> = {
  adventure: "nightlife",
  future: "conference",
  taste: "foodDrink",
  echoes: "festival",
};

const statusPattern: EventStatus[] = ["popular", "limitedSpots", "sellingFast", "limitedSpots"];

const statusStyles: Record<
  EventStatus,
  { label: string; className: string; Icon: ComponentType<{ className?: string }> }
> = {
  popular: { label: "Popular", className: "bg-[#22C55E]", Icon: Flame },
  limitedSpots: { label: "Limited Spots", className: "bg-[#E69B13]", Icon: Tag },
  sellingFast: { label: "Selling Fast", className: "bg-[#EF4444]", Icon: Timer },
};

const featuredSponsoredEvent: {
  title: string;
  description: string;
  image: string;
  eventId: string;
} | null = {
  title: "Lagos Grand Gala Night",
  description:
    "Enjoy an unforgettable blend of fine dining, live performances, evergreen music, and sophisticated networking with the city’s finest.",
  image: "/images/card-img 1.png",
  eventId: "echoes",
};

const resolveImage = (imagePath: string) => imageMap[imagePath] ?? cardImgOne;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

const popularityScore = (event: BackendEvent) => event.ticketsSold * 0.7 + event.rating * 100;

const distanceKm = (
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number },
) => {
  const r = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(destination.latitude - origin.latitude);
  const dLon = toRad(destination.longitude - origin.longitude);
  const lat1 = toRad(origin.latitude);
  const lat2 = toRad(destination.latitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return r * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const expandEventsForUi = (items: EventView[], targetCount: number) => {
  if (items.length === 0) return [];
  if (items.length >= targetCount) return items.slice(0, targetCount);

  return Array.from({ length: targetCount }, (_, index) => items[index % items.length]);
};

function Rating({ value }: { value: number }) {
  const safe = Math.max(0, Math.min(5, value));
  const fillWidth = `${(safe / 5) * 100}%`;

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="relative inline-flex">
        <div className="flex text-[#d5d5d5]">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={`empty-${i}`} className="h-4 w-4" />
          ))}
        </div>
        <div className="absolute inset-0 overflow-hidden" style={{ width: fillWidth }}>
          <div className="flex text-[#F6A609]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={`fill-${i}`} className="h-4 w-4 fill-current" />
            ))}
          </div>
        </div>
      </div>
      <span className="text-sm font-semibold text-[#313131]">{safe.toFixed(1)}</span>
    </div>
  );
}

function Badge({ status }: { status: EventStatus }) {
  const { label, className, Icon } = statusStyles[status];
  return (
    <span className={`inline-flex h-7 items-center gap-1 rounded-[1234px] px-[10px] text-xs font-medium text-white ${className}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function EventCard({
  event,
  status,
  liked,
  saved,
  onLike,
  onSave,
}: {
  event: EventView;
  status: EventStatus;
  liked: boolean;
  saved: boolean;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
}) {
  const eventHref = event.isLive ? `/events/${event.id}/live` : `/events/${event.id}`;

  return (
    <article className="flex h-[458px] w-full max-w-[323px] flex-col gap-[10px] rounded-[16px] border border-[#dfdfdf] bg-white p-4">
      <Link href={eventHref} className="relative block h-[170px] overflow-hidden rounded-[14px]">
        <Image src={resolveImage(event.image)} alt={event.title} fill className="object-cover" sizes="323px" />
        <div className="absolute bottom-2 right-2">
          <Badge status={status} />
        </div>
      </Link>

      <span className="text-xs font-medium text-[#4a30f3]">{event.tag}</span>
      <Link href={eventHref} className="group">
        <h4 className="text-[18px] font-bold leading-[26px] text-[#292929] transition group-hover:text-[#5E16FF] sm:text-[20px] sm:leading-7">
          {event.title}
        </h4>
      </Link>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#797979]">
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(event.startDate)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-3.5 w-3.5" />
          {formatTime(event.startDate)}
        </span>
      </div>

      <div className="inline-flex items-center gap-1">
        <Rating value={event.rating} />
        <span className="text-sm text-[#75839A]">({Math.max(12, Math.round(event.ticketsSold * 0.2))})</span>
      </div>

      <span className="inline-flex items-center gap-1 text-sm text-[#6d6d6d]">
        <MapPin className="h-3.5 w-3.5 text-[#8592A7]" />
        {event.location}
      </span>

      <div className="flex items-center justify-end">
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#2d2d2d]">
          from <Ticket className="h-3.5 w-3.5" /> {event.isFree ? "Free" : "N-"}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onLike(event.id)} className="grid h-8 w-8 place-items-center rounded-full border border-[#d5d5d5]">
            <Heart className={`h-4 w-4 ${liked ? "fill-[#ef4444] text-[#ef4444]" : "text-[#8b8b8b]"}`} />
          </button>
          <button type="button" onClick={() => onSave(event.id)} className="grid h-8 w-8 place-items-center rounded-full border border-[#d5d5d5]">
            <Bookmark className={`h-4 w-4 ${saved ? "fill-[#5E16FF] text-[#5E16FF]" : "text-[#8b8b8b]"}`} />
          </button>
        </div>

        <Link href={eventHref} className="inline-flex h-7 min-w-[91px] items-center justify-center gap-1 rounded-[1234px] bg-[#5E16FF] px-[10px] text-[11px] font-semibold text-white">
          Buy Tickets
          <span className="grid h-4 w-4 place-items-center rounded-full bg-white/20">
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </Link>
      </div>
    </article>
  );
}

function Section({
  title,
  subtitle,
  events,
  likes,
  saves,
  onLike,
  onSave,
  onReset,
}: {
  title: string;
  subtitle?: string;
  events: EventView[];
  likes: string[];
  saves: string[];
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onReset: () => void;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const desktopGridTemplate =
    events.length <= 1
      ? "md:[grid-template-columns:minmax(0,323px)] md:justify-center"
      : events.length === 2
        ? "md:[grid-template-columns:repeat(2,minmax(0,323px))] md:justify-between"
        : events.length === 3
          ? "md:[grid-template-columns:repeat(2,minmax(0,323px))] md:justify-between xl:[grid-template-columns:repeat(3,minmax(0,323px))] xl:justify-between"
          : "md:[grid-template-columns:repeat(2,minmax(0,323px))] md:justify-between xl:[grid-template-columns:repeat(4,minmax(0,323px))] xl:justify-between";

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-[#2f2f2f] md:text-lg">{title}</h3>
          {subtitle ? <p className="mt-1 max-w-[860px] text-sm text-[#6d6d6d]">{subtitle}</p> : null}
        </div>
        {events.length > 1 ? (
          <div className="flex items-center gap-2 md:hidden">
            <button type="button" onClick={() => scrollerRef.current?.scrollBy({ left: -320, behavior: "smooth" })} className="grid h-8 w-8 place-items-center rounded-full border border-[#d0d0d0] bg-white text-[#666]">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => scrollerRef.current?.scrollBy({ left: 320, behavior: "smooth" })} className="grid h-8 w-8 place-items-center rounded-full border border-[#d0d0d0] bg-white text-[#666]">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d6d6d6] bg-white px-5 py-8 text-center">
          <p className="text-sm text-[#6a6a6a]">No events available for the selected category.</p>
          <button type="button" onClick={onReset} className="mt-4 inline-flex rounded-full bg-[#5E16FF] px-5 py-2 text-sm font-semibold text-white">
            View all categories
          </button>
        </div>
      ) : (
        <>
          <div ref={scrollerRef} className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
            {events.map((event, index) => (
              <div key={`m-${title}-${event.id}-${index}`} className="w-[min(85vw,323px)] shrink-0 snap-start">
                <EventCard event={event} status={statusPattern[index % 4]} liked={likes.includes(event.id)} saved={saves.includes(event.id)} onLike={onLike} onSave={onSave} />
              </div>
            ))}
          </div>
          <div className={`hidden gap-y-4 md:grid ${desktopGridTemplate}`}>
            {events.map((event, index) => (
              <EventCard key={`d-${title}-${event.id}-${index}`} event={event} status={statusPattern[index % 4]} liked={likes.includes(event.id)} saved={saves.includes(event.id)} onLike={onLike} onSave={onSave} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default function EventsPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sponsoredClosed, setSponsoredClosed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [userCoords, setUserCoords] = useState(profileFallback);
  const touchStart = useRef<number | null>(null);
  const touchCurrent = useRef<number | null>(null);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => setUserCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      () => setUserCoords(profileFallback),
      { enableHighAccuracy: false, timeout: 9000, maximumAge: 180000 },
    );
  }, []);

  const events = useMemo<EventView[]>(
    () =>
      backendEvents.map((event) => {
        const category = eventCategoryMap[event.id] ?? "conference";
        return { ...event, category, tag: categoryLabels[category] };
      }),
    [],
  );

  const categoryFiltered = useMemo(
    () => (activeCategory === "all" ? events : events.filter((e) => e.category === activeCategory)),
    [activeCategory, events],
  );

  const popularNearYou = useMemo(() => {
    const scored = categoryFiltered.map((event) => ({
      event,
      distance: distanceKm(userCoords, { latitude: event.latitude, longitude: event.longitude }),
    }));
    const near = scored.filter((item) => item.distance <= 80);
    const pool = near.length ? near : scored;
    return [...pool].sort((a, b) => popularityScore(b.event) - popularityScore(a.event)).map((item) => item.event);
  }, [categoryFiltered, userCoords]);

  const freeEntry = useMemo(
    () => [...categoryFiltered].filter((event) => event.isFree).sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate)),
    [categoryFiltered],
  );

  const liveStream = useMemo(
    () => [...categoryFiltered].filter((event) => event.isLive).sort((a, b) => popularityScore(b) - popularityScore(a)),
    [categoryFiltered],
  );

  const freeEntryPreview = useMemo(() => expandEventsForUi(freeEntry, 8), [freeEntry]);
  const liveStreamPreview = useMemo(() => expandEventsForUi(liveStream, 8), [liveStream]);

  const goPrevSlide = () => setActiveSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  const goNextSlide = () => setActiveSlide((prev) => (prev + 1) % heroSlides.length);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStart.current = event.touches[0]?.clientX ?? null;
    touchCurrent.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    touchCurrent.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = () => {
    if (touchStart.current === null || touchCurrent.current === null) return;
    const deltaX = touchStart.current - touchCurrent.current;
    if (Math.abs(deltaX) >= swipeThreshold) deltaX > 0 ? goNextSlide() : goPrevSlide();
    touchStart.current = null;
    touchCurrent.current = null;
  };

  const toggleLike = (id: string) =>
    setLikedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  const toggleSave = (id: string) =>
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));

  const handleHeroCta = (category: CategoryKey) => {
    setActiveCategory(category);
    document.getElementById("events-sections")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="min-h-screen bg-[#f2f2f2] text-[#171717]">
      <header className="sticky top-0 z-50 border-b border-[#e6e6e6] bg-[rgba(254,254,254,0.5)] backdrop-blur-[8px]">
        <div className={`${pageContainer} ${horizontalPadding}`}>
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <Link href="/events" className="flex shrink-0 items-center gap-2">
                <Image src="/images/logo-icon.svg" alt="Konfera" width={22} height={22} className="h-[22px] w-[22px]" />
                <span className="text-sm font-semibold tracking-[0.08em] text-[#4a30f3]">KONFERA</span>
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

            <nav className="hidden items-center gap-5 text-sm text-[#4a4a4a] md:flex">
              <Link href="/events" className="font-medium hover:text-[#1f1f1f]">Create Events</Link>
              <Link href="/events" className="font-medium hover:text-[#1f1f1f]">My tickets</Link>
              <button type="button" className="relative h-9 w-9 overflow-hidden rounded-full border border-[#d5d5d5] bg-[#fafafa]" aria-label="My profile">
                <Image src="/placeholder-user.jpg" alt="User profile" fill className="object-cover" />
              </button>
            </nav>

            <div className="flex items-center gap-2 md:hidden">
              <button type="button" className="relative h-9 w-9 overflow-hidden rounded-full border border-[#d5d5d5] bg-[#fafafa]" aria-label="My profile">
                <Image src="/placeholder-user.jpg" alt="User profile" fill className="object-cover" />
              </button>
              <button type="button" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu" className="grid h-9 w-9 place-items-center rounded-full border border-[#d5d5d5] bg-white text-[#4a4a4a]">
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] md:hidden ${
          mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-[#121212]/45 transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-[82%] max-w-[320px] border-r border-[#dfdfdf] bg-white shadow-[0_20px_45px_rgba(0,0,0,0.2)] transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          <div className="flex h-16 items-center justify-between border-b border-[#ececec] px-4">
            <span className="text-sm font-semibold tracking-[0.08em] text-[#4a30f3]">KONFERA</span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="grid h-9 w-9 place-items-center rounded-full border border-[#d5d5d5] bg-white text-[#4a4a4a]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="p-4">
            <Link
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full rounded-lg px-3 py-2 text-sm font-medium text-[#333] hover:bg-[#f4f4f4]"
            >
              Create Events
            </Link>
            <Link
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-1 block w-full rounded-lg px-3 py-2 text-sm font-medium text-[#333] hover:bg-[#f4f4f4]"
            >
              My tickets
            </Link>
          </nav>
        </aside>
      </div>

      <section className="w-full pb-8 pt-3 sm:pt-4">
        <div className="relative overflow-hidden">
          <div className="relative h-[380px] sm:h-[430px] lg:h-[560px] xl:h-[620px]">
            <div className="flex h-full transition-transform duration-700 ease-out" style={{ transform: `translateX(-${activeSlide * 100}%)` }} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
              {heroSlides.map((slide, index) => (
                <article key={slide.title} className="relative min-w-full">
                  <Image src={slide.image} alt={slide.title} fill priority={index === 0} className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 1720px" />
                  <div className="absolute inset-0" style={{ backgroundColor: slide.overlay }} />
                  <div className={`relative z-10 h-full ${pageContainer} ${horizontalPadding}`}>
                    <div className="max-w-[520px] pt-12 text-white md:pt-16 lg:pt-20">
                      <h1 className="text-[38px] font-semibold leading-[1.1] md:text-[48px] lg:text-[56px]">{slide.title}</h1>
                      <p className="mt-4 max-w-[500px] text-sm leading-[1.7] text-white/90 md:mt-5 md:text-base lg:text-[18px]">{slide.description}</p>
                      <button type="button" onClick={() => handleHeroCta(slide.category)} className="mt-7 rounded-full bg-[#5f16ff] px-7 py-3 text-base font-semibold text-white hover:bg-[#4c11d2]">{slide.cta}</button>
                    </div>
                  </div>

                  {index === 0 && featuredSponsoredEvent && !sponsoredClosed ? (
                    <aside className={`absolute right-4 top-12 z-20 hidden w-[374px] rounded-[16px] border border-[#4e4b45] bg-[linear-gradient(161deg,#1c180f_0%,#272116_50%,#2f271f_100%)] p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)] lg:block lg:right-12 lg:top-20 xl:right-16`}>
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[10px] font-semibold tracking-[0.04em]">SPONSORED EVENT</p>
                        <button type="button" onClick={() => setSponsoredClosed(true)} className="grid h-5 w-5 place-items-center text-white/90 hover:text-white" aria-label="Close sponsored event">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="relative mt-4 h-[232px] overflow-hidden rounded-[16px]">
                        <Image src={resolveImage(featuredSponsoredEvent.image)} alt={featuredSponsoredEvent.title} fill className="object-cover" sizes="374px" />
                      </div>
                      <h3 className="mt-4 overflow-hidden text-ellipsis whitespace-nowrap text-[24px] font-bold leading-8">
                        {featuredSponsoredEvent.title}
                      </h3>
                      <p
                        className="mt-3 h-[72px] max-w-[292px] overflow-hidden text-base font-normal leading-6 text-white/85"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        Enjoy an unforgettable blend of fine dining, live performances, evergreen music, and sophisticated networking with the city&apos;s finest.
                      </p>
                      <Link href={`/events/${featuredSponsoredEvent.eventId}`} className="mt-5 inline-flex h-[42px] items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#5f6470]">Get Tickets</Link>
                    </aside>
                  ) : null}
                </article>
              ))}
            </div>
          </div>

          <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
            {heroSlides.map((slide, index) => (
              <button key={slide.title} type="button" onClick={() => setActiveSlide(index)} aria-label={`Go to slide ${index + 1}`} className={`h-3 w-3 rounded-full ${activeSlide === index ? "bg-white" : "bg-white/45 hover:bg-white/70"}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-[#323438] py-8 text-white md:py-10">
        <div className={`${pageContainer} ${horizontalPadding}`}>
          <h2 className="text-base font-semibold md:text-[28px]">Browse By Categories</h2>
          <p className="mt-2 max-w-[760px] text-xs text-white/75 md:text-base">Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna.</p>
          <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6 lg:gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              const active = activeCategory === category.key;
              return (
                <button key={category.key} type="button" onClick={() => setActiveCategory(category.key)} className={`flex h-[86px] flex-col items-center justify-center gap-2 rounded-[8px] border bg-white px-2 text-center sm:h-[110px] ${active ? "border-[#5E16FF] shadow-[0_0_0_1px_rgba(94,22,255,0.25)]" : "border-[#e6e6e6]"}`}>
                  <Icon className={`h-5 w-5 ${active ? "text-[#5E16FF]" : "text-[#535353]"}`} />
                  <span className={`text-[10px] font-medium sm:text-xs ${active ? "text-[#5E16FF]" : "text-[#404040]"}`}>{category.label}</span>
                </button>
              );
            })}
          </div>
          <button type="button" onClick={() => setActiveCategory("all")} disabled={activeCategory === "all"} className={`mt-4 inline-flex rounded-full px-4 py-2 text-xs font-semibold sm:text-sm ${activeCategory === "all" ? "cursor-default bg-white/20 text-white/75" : "bg-white text-[#2f2f2f] hover:bg-white/90"}`}>Clear category filter</button>
        </div>
      </section>

      <div id="events-sections" className={`${pageContainer} ${horizontalPadding} space-y-10 py-8 md:py-10`}>
        <Section
          title="Popular Events near you"
          subtitle="Popular events near your location based on distance and ticket demand."
          events={popularNearYou}
          likes={likedIds}
          saves={savedIds}
          onLike={toggleLike}
          onSave={toggleSave}
          onReset={() => setActiveCategory("all")}
        />
        <Section
          title="Events with Free Entry"
          subtitle="Unlock amazing opportunities for learning, networking, and fun. These events offer full access and participation, absolutely free."
          events={freeEntryPreview}
          likes={likedIds}
          saves={savedIds}
          onLike={toggleLike}
          onSave={toggleSave}
          onReset={() => setActiveCategory("all")}
        />
        <Section
          title="Live Stream and Webinars"
          subtitle="Engage in real-time with hosts and presenters, ask questions, and connect with a global audience, all from the comfort of your home."
          events={liveStreamPreview}
          likes={likedIds}
          saves={savedIds}
          onLike={toggleLike}
          onSave={toggleSave}
          onReset={() => setActiveCategory("all")}
        />
      </div>
    </main>
  );
}
