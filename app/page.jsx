"use client";

import React, { useState, useMemo, useEffect } from "react";

import { VENUES } from "../lib/venues";

import Calendar from "../components/Calendar";
import VenueInfoCards from "../components/VenueInfoCards";


import useEvents from "../hooks/useEvents";
import usePinnedEvent from "../hooks/usePinnedEvent";


// SVG Icon Components
const Instagram = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth="2" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Youtube = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const Sparkles = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const MapPin = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ChevronDown = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

const XMark = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Clock = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShareIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const MailIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
); const SunIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const CalendarIcon = ({ className = "w-10 h-10" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" strokeLinecap="round" />
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
  </svg>
);



const isEventEnded = (evtDateStr, startTimeStr) => {
  const now = new Date();
  const [year, month, day] = evtDateStr.split('-').map(Number);
  const [hours, minutes] = (startTimeStr || "23:59").split(':').map(Number);
  const eventTime = new Date(year, month - 1, day, hours, minutes);
  return now > eventTime;
};

const getDdayText = (evtDateStr) => {

  const now = new Date();
  const todayMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const [y, m, d] = evtDateStr.split("-").map(Number);
  const evtMidnight = new Date(y, m - 1, d);

  const diffDays = Math.round(
    (evtMidnight - todayMidnight) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "D-Day (오늘)";
  if (diffDays > 0) return `D-${diffDays} (${diffDays}일 남음)`;

  return null;
};

function Header({ nextShow, onShare, darkMode, setDarkMode, profileImage }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <>
      <header className="flex flex-col items-center text-center pt-0 relative">

        <button
          type="button"
          onClick={onShare}
          className="absolute left-3 top-3 z-20
             w-8 h-8 rounded-full
             bg-neutral-100/80 dark:bg-neutral-800/80
             backdrop-blur-sm
             border border-neutral-200 dark:border-neutral-700
             flex items-center justify-center
             text-neutral-600 dark:text-neutral-300
             hover:bg-neutral-200 dark:hover:bg-neutral-700
             active:scale-95 transition"
          aria-label="공유하기"
        >
          <ShareIcon className="w-3.5 h-3.5" />
        </button>


        

{/* Artist Hero */}
<div className="relative w-full max-w-2xl mx-auto -mt-10">

  {/* Main Visual */}
  <div className="relative h-[310px] sm:h-[470px] overflow-hidden">

    {/* Subtle Red Glow */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(130,20,30,0.22),transparent_65%)]" />

    {/* Artist Image */}
    <img
      src="/taehyun-profile.png"
      alt="스탠드업 코미디언 김태현"
      className="absolute bottom-0 left-1/2 h-[85%] sm:h-[80%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_45%,transparent_100%)]"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = "/image.png";
      }}
    />

    {/* Bottom Fade */}
    

    {/* Name Overlay */}
    <div className="absolute bottom-0 left-0 right-0 z-10 text-center px-4">
      <p className="text-[9px] sm:text-xs tracking-[0.3em] font-medium text-neutral-300 uppercase mb-2 sm:mb-3">
        STAND-UP COMEDIAN
      </p>

      <h1 className="text-[42px] sm:text-[66px] font-black tracking-[-0.06em] leading-none text-white">
        김태현
      </h1>

      <div className="w-10 h-[2px] bg-red-600 mx-auto mt-5" />
    </div>
  </div>

  {/* Contact & Social */}
  <div className="mt-5 sm:mt-6 flex flex-col items-center gap-3 sm:gap-4 px-3">

    
<a
  href="mailto:taehyun@metacomedy.net"
  className="inline-flex items-center gap-1.5 rounded-full bg-neutral-800/70 px-3 py-1.5 text-[11px] text-neutral-300 transition-colors hover:bg-neutral-700 hover:text-white"
>
  <MailIcon className="h-3.5 w-3.5 text-neutral-400" />
  taehyun@metacomedy.net
</a>


    <div className="flex items-center justify-center gap-6">
      <a
        href="https://www.instagram.com/choo_sen?igsh=MWRsbXQydXFncmI2"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 text-xs text-neutral-300 hover:text-white transition"
      >
        <Instagram className="w-4 h-4" />
        Instagram
      </a>

      <span className="h-4 w-px bg-neutral-700" />

      <a
        href="https://www.youtube.com/channel/UC67dXWw4xqqQQDzg5bWyObA?si=kB5Xmp2MeeuVJHIL"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 text-xs text-neutral-300 hover:text-white transition"
      >
        <Youtube className="w-4 h-4" />
        YouTube
      </a>
    </div>
  </div>
</div>

      </header>

      {nextShow && (
        <div className="mt-4 mb-3 rounded-2xl bg-[#1c1c1c] border-2 border-red-900/70 p-4 flex justify-between items-center shadow-lg shadow-red-900/10">
          <div className="space-y-1 pr-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-[11px] font-extrabold text-red-400 flex items-center gap-1 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" /> NEXT SHOW
              </p>
              {mounted && getDdayText(nextShow.date) && (
                <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                  {getDdayText(nextShow.date)}
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {nextShow.date.split('-')[1]}월 {nextShow.date.split('-')[2]}일 {nextShow.startTime}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 text-xs font-semibold flex items-center gap-1 flex-wrap">
              📍 {(nextShow.venueKey && VENUES[nextShow.venueKey]?.name) || nextShow.customVenue || "온라인"} <span className="text-neutral-900 dark:text-white font-bold">{nextShow.title}</span>
            </p>
          </div>

          {nextShow.booking && (
            <div className="shrink-0 pl-2">
              <a
                href={nextShow.booking}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black transition shadow-lg shadow-red-600/30 block text-center animate-pulse"
              >
                🔗 예매
              </a>
            </div>
          )}
        </div>
      )}
    </>
  );
}


export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
  events,
  setEvents,
  eventsLoaded,
  addEvent,
  updateEvent,
  deleteEvent,
} = useEvents();

  const {
  pinnedEventId,
  pinnedLoaded,
  togglePin,
  clearPin,
} = usePinnedEvent();

  const [activeCategory, setActiveCategory] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();

    return {
      year: now.getFullYear(),
      month: now.getMonth(),
    };
  });
  const [toastMessage, setToastMessage] = useState(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);





  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleShare = async () => {
    const shareData = {
      title: '김태현 스탠드업 코미디 일정',
      text: '코미디언 김태현의 공연 및 유튜브 업로드 일정을 확인하세요!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name !== 'AbortError') executeClipboardCopy(shareData.url);
      }
    } else {
      executeClipboardCopy(shareData.url);
    }
  };

  const executeClipboardCopy = (url) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showToast("링크가 클립보드에 복사되었습니다! 📋");
      }).catch(() => fallbackCopy(url));
    } else {
      fallbackCopy(url);
    }
  };

  const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast("링크가 클립보드에 복사되었습니다! 📋");
    } catch (err) {
      showToast("링크 복사에 실패했습니다.");
    }
    document.body.removeChild(textArea);
  };

  const handleAddEvent = async (newEvt) => {
  const success = await addEvent(newEvt);

  if (success) {
    showToast("새로운 일정이 추가되었습니다! 🎉");
  } else {
    showToast("Firebase 저장에 실패했습니다.");
  }
};

const handleUpdateEvent = async (updatedEvt) => {
  const success = await updateEvent(updatedEvt);

  if (success) {
    showToast("일정이 수정되었습니다! ✨");
  } else {
    showToast("Firebase 수정에 실패했습니다.");
  }
};

const handleDeleteEvent = async (eventId) => {
  const success = await deleteEvent(eventId);

  if (!success) {
    showToast("Firebase 삭제에 실패했습니다.");
    return;
  }

  if (pinnedEventId === eventId) {
  const cleared = await clearPin();

  if (!cleared) {
    showToast("일정은 삭제됐지만 Next Show 고정 해제에 실패했습니다.");
    return;
  }
}

  showToast("일정이 삭제되었습니다.");
};
  

const handleTogglePin = async (eventId) => {
  const result = await togglePin(eventId);

  if (!result.success) {
    showToast("Next Show 저장에 실패했습니다.");
    return;
  }

  if (result.pinned) {
    showToast("선택한 일정이 Next Show로 고정되었습니다! 📌");
  } else {
    showToast("Next Show 고정이 해제되었습니다.");
  }
};

  const sortedEvents = useMemo(() => {
  return [...(Array.isArray(events) ? events : [])].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
}, [events]);

  const filteredEvents = useMemo(() => {
    return sortedEvents.filter((e) => {
      if (activeCategory !== "all" && e.category !== activeCategory) {
        return false;
      }
      return true;
    });
  }, [sortedEvents, activeCategory]);

  const nextShow = useMemo(() => {
    if (pinnedEventId) {
      const pinned = sortedEvents.find(e => e.id === pinnedEventId);
      if (pinned && !isEventEnded(pinned.date, pinned.startTime)) {
        return pinned;
      }
    }
    const upcoming = sortedEvents.filter(
      (e) => !isEventEnded(e.date, e.startTime)
    );
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [sortedEvents, pinnedEventId]);

  return (
    <div className="dark">
      <div className="min-h-screen bg-[#080808] text-white font-sans antialiased py-3 px-3 relative flex flex-col justify-between">
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 dark:bg-white dark:text-neutral-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold animate-bounce">
            {toastMessage}
          </div>
        )}

        <div className="max-w-md mx-auto w-full">
          {mounted && (
            <Header
              nextShow={nextShow}
              onShare={handleShare}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              profileImage="/image.jpg"
            />
          )}

          <Calendar
            events={filteredEvents}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />

          <VenueInfoCards />
        </div>



        <footer className="mt-6 mb-2 text-center text-[10px] text-neutral-400 font-semibold space-y-0.5">
          <p>© 2026 KIM TAE HYUN. All rights reserved.</p>
        </footer>

        
      </div>
    </div>
  );
}
