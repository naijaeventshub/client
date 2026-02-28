"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  CalendarDays,
  ChevronDown,
  Clock3,
  Copy,
  Download,
  Ellipsis,
  ExternalLink,
  Facebook,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  MessageSquareText,
  Monitor,
  Search,
  Paperclip,
  SendHorizontal,
  Share2,
  Star,
  UserCircle2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import cardImgOne from "@/images/card-img 1.png";
import cardImgThree from "@/images/card-img 3.png";
import pastImgOne from "@/images/past-img 1.png";
import pastImgTwo from "@/images/past-img 2.png";
import pastImgThree from "@/images/past-img 3.png";
import pastImgFour from "@/images/past-img 4.png";
import pastImgFive from "@/images/past-img 5.png";
import pastImgSix from "@/images/past-img 6.png";
import pastImgSeven from "@/images/past-img 7.png";
import pastImgEight from "@/images/past-img 8.png";
import googlePartnerLogo from "@/images/google-svg.svg";
import netflixPartnerLogo from "@/images/netflix-svg.svg";
import microsoftPartnerLogo from "@/images/microsoft-svg.svg";
import imdbPartnerLogo from "@/images/imdb-svg.svg";
import whatsappLogo from "@/images/whatsapp-logo.svg";
import messengerLogo from "@/images/messenger-logo.svg";

type AgendaItem = {
  time: string;
  title: string;
  description: string;
  active?: boolean;
};

type ResourceItem = {
  id: string;
  title: string;
  description: string;
  format: string;
  size: string;
  action: "download" | "visit";
  href: string;
};

type QaMessage = {
  id: string;
  name: string;
  time: string;
  question: string;
  likes: number;
  avatar: string;
};

type LiveEventDetail = {
  id: string;
  title: string;
  startsAtISO: string;
  location: string;
  heroImage: StaticImageData;
  about: string[];
  agenda: AgendaItem[];
  resources: ResourceItem[];
  partners: { id: string; image: StaticImageData; alt: string }[];
  gallery: StaticImageData[];
  qaMessages: QaMessage[];
};

const horizontalPadding = "px-4 sm:px-6 md:px-8 lg:px-12";

const sharedGallery: StaticImageData[] = [
  pastImgOne,
  pastImgTwo,
  pastImgThree,
  pastImgFour,
  pastImgFive,
  pastImgSix,
  pastImgSeven,
  pastImgEight,
];

const sharedResources: ResourceItem[] = [
  {
    id: "keynote",
    title: "Film Screening Overview - Keynote Presentation",
    description: "Complete presentation slides from the opening session.",
    format: "PDF",
    size: "4.2 MB",
    action: "download",
    href: "#",
  },
  {
    id: "qa-session",
    title: "Director's Q&A Session Recording",
    description: "Full video recording of the live Q&A with the director.",
    format: "MP4",
    size: "246 MB",
    action: "download",
    href: "#",
  },
  {
    id: "program",
    title: "Event Program & Schedule",
    description: "Detailed program with all session timings and speaker bios.",
    format: "PDF",
    size: "1.8 MB",
    action: "download",
    href: "#",
  },
  {
    id: "website",
    title: "Film Festival Official Website",
    description: "Visit the main festival website for more events.",
    format: "Link",
    size: "-",
    action: "visit",
    href: "#",
  },
  {
    id: "marketing",
    title: "Event Posters & Marketing Materials",
    description: "High-resolution posters and promotional graphics.",
    format: "ZIP",
    size: "12.4 MB",
    action: "download",
    href: "#",
  },
  {
    id: "networking",
    title: "Networking Directory",
    description: "Contact information for all speakers and attendees (with permission).",
    format: "PDF",
    size: "690 KB",
    action: "download",
    href: "#",
  },
];

const liveEventsMap: Record<string, LiveEventDetail> = {
  future: {
    id: "future",
    title: "Campus Film Screening Tour",
    startsAtISO: "2026-09-02T09:00:00+01:00",
    location: "4 Lawrence Road Lagos, Nigeria",
    heroImage: cardImgOne,
    about: [
      "Embark on an unforgettable cinematic journey at the Campus Film Screening Tour, a vibrant event designed to foster creativity and connection within our university community. This isn't just about watching films; it's an opportunity to engage with diverse narratives, spark conversations, and discover new perspectives right here on campus. Get ready to immerse yourself in compelling storytelling and artistic expression.",
      "Beyond the screen, the tour is a celebration of campus life and shared experiences. It's a chance to bond with fellow students, discuss themes, and perhaps even ignite your own creative passions. We aim to build a stronger, more connected community through the universal language of film, offering a unique blend of entertainment and intellectual stimulation that enriches your university experience.",
    ],
    agenda: [
      {
        time: "9:00 AM - 10:30 AM",
        title: "Opening Remarks & Film Screening 1",
        description: "Kick-off with our keynote speaker followed by the first film.",
        active: true,
      },
      {
        time: "10:30 AM - 11:00 AM",
        title: "Coffee Break & Networking",
        description: "Grab a coffee and connect with fellow attendees.",
      },
      {
        time: "11:00 AM - 12:30 PM",
        title: "Director's Q&A Session",
        description: "An interactive session with the director of the first film.",
      },
      {
        time: "12:30 PM - 1:30 PM",
        title: "Lunch Recess",
        description: "Enjoy a delicious lunch provided by our sponsors.",
      },
    ],
    resources: sharedResources,
    partners: [
      { id: "google", image: googlePartnerLogo, alt: "Google" },
      { id: "netflix", image: netflixPartnerLogo, alt: "Netflix" },
      { id: "microsoft", image: microsoftPartnerLogo, alt: "Microsoft" },
      { id: "imdb", image: imdbPartnerLogo, alt: "IMDb" },
    ],
    gallery: sharedGallery,
    qaMessages: [
      {
        id: "q1",
        name: "You",
        time: "Just now",
        question: "What's the title of the movie?",
        likes: 2,
        avatar: "/placeholder-user.jpg",
      },
      {
        id: "q2",
        name: "Alex Doe",
        time: "3m ago",
        question: "What was the most challenging scene to film?",
        likes: 3,
        avatar: "/placeholder-user.jpg",
      },
      {
        id: "q3",
        name: "Johnson Smith",
        time: "4m ago",
        question: "Will there be a sequel?",
        likes: 1,
        avatar: "/placeholder-user.jpg",
      },
    ],
  },
  taste: {
    id: "taste",
    title: "Taste of Naija - Live Showcase",
    startsAtISO: "2026-09-05T09:00:00+01:00",
    location: "4 Lawrence Road Lagos, Nigeria",
    heroImage: cardImgThree,
    about: [
      "Join our live culinary showcase featuring chefs, storytellers, and creators sharing the flavors and traditions that define modern Naija cuisine.",
      "Attendees can ask real-time questions, access downloadable resources, and connect with fellow food enthusiasts throughout the stream.",
    ],
    agenda: [
      {
        time: "9:00 AM - 10:00 AM",
        title: "Welcome & Kitchen Setup",
        description: "Introduction, ingredients overview, and kitchen prep guidance.",
        active: true,
      },
      {
        time: "10:00 AM - 11:15 AM",
        title: "Live Cooking Session",
        description: "Step-by-step preparation with chef commentary.",
      },
      {
        time: "11:15 AM - 12:00 PM",
        title: "Q&A + Tasting Notes",
        description: "Audience questions and pairing recommendations.",
      },
      {
        time: "12:00 PM - 12:30 PM",
        title: "Networking Lounge",
        description: "Virtual networking with hosts and attendees.",
      },
    ],
    resources: sharedResources,
    partners: [
      { id: "google", image: googlePartnerLogo, alt: "Google" },
      { id: "netflix", image: netflixPartnerLogo, alt: "Netflix" },
      { id: "microsoft", image: microsoftPartnerLogo, alt: "Microsoft" },
      { id: "imdb", image: imdbPartnerLogo, alt: "IMDb" },
    ],
    gallery: sharedGallery,
    qaMessages: [
      {
        id: "q1",
        name: "You",
        time: "Just now",
        question: "Can we get a vegetarian option?",
        likes: 2,
        avatar: "/placeholder-user.jpg",
      },
      {
        id: "q2",
        name: "Amina B",
        time: "2m ago",
        question: "Will recipe cards be shared after the stream?",
        likes: 4,
        avatar: "/placeholder-user.jpg",
      },
      {
        id: "q3",
        name: "Kehinde O",
        time: "5m ago",
        question: "Can I rewatch this session later?",
        likes: 1,
        avatar: "/placeholder-user.jpg",
      },
    ],
  },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

const liveTabs = [
  { label: "Live Q&A", Icon: MessageSquareText },
  { label: "Live Chat", Icon: MessageCircle },
  { label: "Polls", Icon: BarChart3 },
  { label: "Notices", Icon: Bell },
  { label: "People", Icon: Users },
];

function ShareEventModal({
  isOpen,
  onClose,
  event,
}: {
  isOpen: boolean;
  onClose: () => void;
  event: Pick<LiveEventDetail, "title" | "startsAtISO" | "location" | "heroImage">;
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
  const shareBody = `${shareTitle}\n${event.location}\n${shareUrl}`;

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
        text: `${event.title} - ${event.location}`,
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

        <h2 className="mt-2 text-[32px] font-semibold leading-tight text-[#1f2533]">Share this event</h2>

        <div className="mt-6 flex items-start gap-3">
          <div className="relative h-[58px] w-[58px] shrink-0 overflow-hidden rounded-[10px]">
            <Image src={event.heroImage} alt={event.title} fill className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="truncate pr-2 text-[16px] font-semibold leading-6 text-[#1f2533]">{shareTitle}</p>
            <p
              className="mt-0.5 text-[14px] font-normal leading-6 text-[#646a76]"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {event.location}
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
            onClick={() => openExternalShare(`sms:?&body=${encodeURIComponent(`${shareTitle}\n${shareUrl}`)}`)}
            className="flex h-[54px] items-center gap-3 rounded-[12px] border border-[#d0d4db] bg-[#f3f4f6] px-4 text-base font-normal text-[#2f3642]"
          >
            <MessageSquare className="h-[18px] w-[18px]" />
            Messages
          </button>

          <button
            type="button"
            onClick={() => openExternalShare(`https://wa.me/?text=${encodeURIComponent(`${shareTitle}\n${shareUrl}`)}`)}
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
            onClick={() => openExternalShare(`https://www.messenger.com/share?link=${encodeURIComponent(shareUrl)}`)}
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
            onClick={() => openExternalShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)}
            className="flex h-[54px] items-center gap-3 rounded-[12px] border border-[#d0d4db] bg-[#f3f4f6] px-4 text-base font-normal text-[#2f3642]"
          >
            <Facebook className="h-[18px] w-[18px]" />
            Facebook
          </button>

          <button
            type="button"
            onClick={() =>
              openExternalShare(
                `https://x.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
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

export default function LiveEventPage() {
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("Live Q&A");
  const [resourcesExpanded, setResourcesExpanded] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const idParam = useMemo(() => {
    if (!params?.id) return "";
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params]);

  const event = liveEventsMap[idParam];

  if (!event) {
    return (
      <main className="min-h-screen bg-[#f2f2f2]">
        <div className={`${horizontalPadding} py-16`}>
          <div className="mx-auto max-w-[960px] rounded-2xl border border-[#e4e4e4] bg-white p-8 text-center">
            <h1 className="text-2xl font-semibold text-[#222]">Live event not found</h1>
            <p className="mt-2 text-sm text-[#666]">
              The live event detail page for this ID is not available.
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
                <Image src="/placeholder-user.jpg" alt="User profile" fill className="object-cover" />
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
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
          <div>
            <section className="border-b border-[#dedede] pb-6">
              <div className="relative h-[220px] overflow-hidden rounded-[16px] md:h-[300px] xl:h-[430px]">
                <Image
                  src={event.heroImage}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1120px"
                  priority
                />
                <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-[#FF4D4F] px-3 py-1 text-xs font-semibold text-white">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  Live Now
                </span>
              </div>

              <h1 className="mt-5 text-[30px] font-semibold leading-tight text-[#1f1f1f]">{event.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#666]">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(event.startsAtISO)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4" />
                  {formatTime(event.startsAtISO)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full bg-[#5f16ff] px-4 py-2 text-sm font-semibold text-white"
                >
                  <Star className="h-4 w-4" />
                  Give Review
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
            </section>

            <section className="border-b border-[#dedede] py-6">
              <h2 className="text-[30px] font-semibold leading-tight text-[#212121] md:text-lg">
                About this event
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-7 text-[#505050]">
                {event.about.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="border-b border-[#dedede] py-6">
              <h2 className="text-lg font-semibold text-[#212121]">Event Agenda</h2>
              <div className="mt-4 space-y-4 border-l border-[#dfdfdf] pl-5">
                {event.agenda.map((item) => (
                  <div key={`${item.time}-${item.title}`} className="relative">
                    <span
                      className={`absolute -left-[28px] top-1.5 h-3 w-3 rounded-full border ${
                        item.active ? "border-[#5f16ff] bg-[#5f16ff]" : "border-[#d7d7d7] bg-white"
                      }`}
                    />
                    <p className={`text-xs font-medium ${item.active ? "text-[#5f16ff]" : "text-[#7d7d7d]"}`}>
                      {item.time}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-[#282828]">{item.title}</h3>
                    <p className="mt-1 text-sm text-[#646464]">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-b border-[#dedede] py-6">
              <button
                type="button"
                onClick={() => setResourcesExpanded((prev) => !prev)}
                className="flex w-full items-center justify-between text-left"
              >
                <h2 className="text-lg font-semibold text-[#212121]">Event Resources</h2>
                <ChevronDown
                  className={`h-4 w-4 text-[#757575] transition-transform ${
                    resourcesExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
              <p className="mt-3 text-sm text-[#5e5e5e]">
                Access all event materials, recordings, and additional resources. Download
                presentations, watch session recordings, and explore supplementary materials.
              </p>
              {resourcesExpanded ? (
                <div className="mt-4 space-y-3">
                  {event.resources.map((resource) => (
                    <article
                      key={resource.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e1e1e1] bg-white p-4"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="mt-1 rounded-lg border border-[#dedede] p-2 text-[#656565]">
                          {resource.action === "visit" ? (
                            <ExternalLink className="h-4 w-4" />
                          ) : (
                            <Monitor className="h-4 w-4" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-[#282828]">{resource.title}</h3>
                          <p className="mt-1 text-xs text-[#6a6a6a]">{resource.description}</p>
                          <p className="mt-1 text-[11px] text-[#8a8a8a]">
                            {resource.format}{" "}
                            {resource.size !== "-" ? <span className="ml-2">{resource.size}</span> : null}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={resource.href}
                        className="inline-flex h-8 items-center gap-1 rounded-md bg-[#5f16ff] px-3 text-xs font-medium text-white"
                      >
                        {resource.action === "visit" ? (
                          <>
                            <ExternalLink className="h-3.5 w-3.5" />
                            Visit
                          </>
                        ) : (
                          <>
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </>
                        )}
                      </Link>
                    </article>
                  ))}
                </div>
              ) : null}
            </section>

            <section className="border-b border-[#dedede] py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[26px] font-semibold text-[#212121] md:text-lg">Our Partners and Sponsor</h2>
                <button type="button" className="text-xs font-medium text-[#5f16ff] underline decoration-[#5f16ff]">
                  See all
                </button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-6 md:flex-nowrap md:justify-start md:gap-x-10">
                {event.partners.map((partner) => (
                  <div key={partner.id} className="flex h-24 w-24 items-center justify-center">
                    <Image
                      src={partner.image}
                      alt={partner.alt}
                      width={96}
                      height={96}
                      className="h-24 w-24 object-contain"
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="py-6">
              <h2 className="text-lg font-semibold text-[#212121]">Moments from the past</h2>
              <div className="mt-4 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {event.gallery.map((image, index) => (
                  <div
                    key={`${event.id}-live-moment-${index + 1}`}
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
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-2xl border border-[#dddddd] bg-white">
              <div className="grid grid-cols-5 border-b border-[#ededed]">
                {liveTabs.map(({ label, Icon }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setActiveTab(label)}
                    className={`flex flex-col items-center gap-1 px-1 py-2 text-[10px] font-medium ${
                      activeTab === label
                        ? "border-b-2 border-[#5f16ff] text-[#5f16ff]"
                        : "text-[#7a7a7a]"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              <div className="h-[420px] overflow-y-auto px-4 py-4">
                <h3 className="text-sm font-semibold text-[#232323]">Live Q&A</h3>
                <p className="mt-1 text-xs text-[#818181]">Ask the speaker a question.</p>

                <div className="mt-4 space-y-4">
                  {event.qaMessages.map((message) => (
                    <article key={message.id} className="flex items-start gap-2.5">
                      <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
                        <Image src={message.avatar} alt={message.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#222]">{message.name}</span>
                          <span className="text-[10px] text-[#9a9a9a]">{message.time}</span>
                        </div>
                        <p className="mt-1 text-xs text-[#555]">{message.question}</p>
                        <p className="mt-2 text-[10px] text-[#8e8e8e]">Likes {message.likes}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#ededed] p-3">
                <div className="flex items-center gap-2 rounded-full border border-[#e2e2e2] bg-[#f9f9f9] px-3 py-2">
                  <input
                    placeholder="Type your question"
                    className="w-full border-0 bg-transparent text-xs text-[#343434] outline-none placeholder:text-[#a2a2a2]"
                  />
                  <button type="button" className="rounded-full bg-[#5f16ff] p-1.5 text-white">
                    <SendHorizontal className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-[11px] text-[#7a7a7a]"
                  >
                    <Paperclip className="h-3.5 w-3.5" />
                    Attach
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-[#dddddd] bg-white p-4">
              <p className="inline-flex items-center gap-2 text-sm text-[#575757]">
                <Users className="h-4 w-4 text-[#5f16ff]" />
                1,204 viewers live now
              </p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-[#575757]">
                <UserCircle2 className="h-4 w-4 text-[#5f16ff]" />
                Host responding in real-time
              </p>
            </div>
          </aside>
        </div>
      </div>

      <ShareEventModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        event={event}
      />
    </main>
  );
}

