"use client";

import { useState, useMemo, useEffect, useRef } from "react";

import { VENUES } from "../lib/venues";

import Calendar from "../components/Calendar";
import VenueInfoCards from "../components/VenueInfoCards";


import useEvents from "../hooks/useEvents";
import usePinnedEvent from "../hooks/usePinnedEvent";

// 겨울 효과는 리뉴얼 완료 후 다시 적용


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



const MapPin = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
);

const SunIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
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

function NextShow({ nextShow }) {
  if (!nextShow) return null;
  const [year, month, day] = nextShow.date.split("-").map(Number);
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][new Date(year, month - 1, day).getDay()];
  const dday = getDdayText(nextShow.date);
  return (
    <div className="home-next-show mt-5 rounded-2xl border border-red-700/50 bg-gradient-to-br from-red-50 to-white dark:from-[#30191b] dark:to-[#171717] p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-sm font-bold tracking-widest text-red-700 dark:text-red-400">NEXT SHOW</p>
        {dday && <span className="ml-auto rounded-full bg-red-100 dark:bg-red-950 px-2 py-1 text-[10px] font-bold text-red-800 dark:text-red-300">{dday}</span>}
      </div>
      <div className="mt-2 text-lg font-semibold leading-snug tracking-tight sm:text-xl">{nextShow.title}</div>
      <div className="mt-2 border-t border-red-700/20 dark:border-red-400/20 pt-2 space-y-1.5">
        <div className="flex items-center gap-2 text-sm font-medium">
          <svg className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>
          <span>{month}월 {day}일 ({weekday}){nextShow.startTime ? ` · ${nextShow.startTime}` : ""}</span>
        </div>
        <div className="flex items-start gap-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
          <MapPin className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
          <span>{(nextShow.venueKey && VENUES[nextShow.venueKey]?.name) || nextShow.customVenue || "온라인"}</span>
        </div>
      </div>
      {nextShow.booking && (
        <a href={nextShow.booking} target="_blank" rel="noreferrer" className="mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-red-700 hover:bg-red-800 px-4 py-2 text-sm font-medium text-white transition">
          예매하기 <span aria-hidden="true">→</span>
        </a>
      )}
    </div>
  );
}

function SocialLinks() {
  return (
        <div className="home-social px-3 mt-5 flex flex-col items-center gap-3">
          <div className="flex items-center justify-center gap-6">
            <a href="https://www.instagram.com/choo_sen?igsh=MWRsbXQydXFncmI2" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-base font-medium hover:text-red-600 transition">
              <Instagram className="w-6 h-6 text-red-600 dark:text-red-400" /> Instagram
            </a>
            <span className="h-5 w-px bg-neutral-300 dark:bg-neutral-700" />
            <a href="https://www.youtube.com/channel/UC67dXWw4xqqQQDzg5bWyObA?si=kB5Xmp2MeeuVJHIL" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-base font-medium hover:text-red-600 transition">
              <Youtube className="w-6 h-6 text-red-600 dark:text-red-400" /> YouTube
            </a>
          </div>
          <a href="mailto:taehyun@metacomedy.net" className="inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-red-600 transition">
            <MailIcon /> taehyun@metacomedy.net
          </a>
        </div>
  );
}

function Header({ nextShow }) {
  return (
    <>
      <header className="relative w-full home-profile">
        <div className="relative overflow-hidden home-portrait">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(130,20,30,0.14),transparent_70%)]" />
          <img
            src="/taehyun-profile.png"
            alt="스탠드업 코미디언 김태현"
            className="absolute top-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 object-contain [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]"
            onError={(e) => {
              if (!e.currentTarget.src.endsWith("/image.png")) {
                e.currentTarget.src = "/image.png";
              }
            }}
          />
          <div className="home-identity absolute bottom-0 left-0 right-0 px-3 pt-12 bg-gradient-to-t from-[var(--site-bg)] via-[var(--site-bg)]/70 to-transparent">
            <h1 className="text-[clamp(44px,12vw,64px)] font-black tracking-[-0.06em] leading-none text-neutral-900 dark:text-white">김태현</h1>
            <p className="mt-2 font-serif italic text-xl text-neutral-600 dark:text-neutral-300">Stand-up Comedian</p>
            <div className="mt-4 h-[3px] w-12 bg-red-600" />
          </div>
        </div>
        <SocialLinks />
      </header>
      <NextShow nextShow={nextShow} />
    </>
  );
}

function DesktopHeader({ nextShow }) {
  return (
    <div className="desktop-home-grid">
      <div className="desktop-portrait">
        <div className="desktop-portrait-glow" />
          <img
            src="/taehyun-profile.png"
            alt="스탠드업 코미디언 김태현"
            className="desktop-portrait-image"
            onError={(e) => {
              if (!e.currentTarget.src.endsWith("/image.png")) {
                e.currentTarget.src = "/image.png";
              }
            }}
          />
      </div>
      <div className="desktop-home-details">
          <div className="desktop-identity">
            <h1 className="text-[clamp(44px,12vw,64px)] font-black tracking-[-0.06em] leading-none text-neutral-900 dark:text-white">김태현</h1>
            <p className="mt-2 font-serif italic text-xl text-neutral-600 dark:text-neutral-300">Stand-up Comedian</p>
            <div className="mt-4 h-[3px] w-12 bg-red-600" />
          </div>
        <SocialLinks />
        <NextShow nextShow={nextShow} />
      </div>
    </div>
  );
}

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const wheelState = useRef({ time: 0, sum: 0 });
  const goTo = (id) => {
    setActivePage(id);
  };

  useEffect(() => {
    const root = document.querySelector(".fullpage-container");
    if (!root) return;
    const ids = ["home", "calendar", "venues"];
    const gesture = wheelState.current;
    let start = null;
    const move = (direction) => {
      const next = ids[ids.indexOf(activePage) + direction];
      if (next) setActivePage(next);
    };
    const panel = () => root.querySelector(".fullpage-section.is-active");
    const canScroll = (el, direction) => el && (direction > 0
      ? el.scrollTop + el.clientHeight < el.scrollHeight - 3
      : el.scrollTop > 3);
    const wheel = (e) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const now = Date.now();
      const direction = Math.sign(e.deltaY);
      if (!direction) return;
      if (now - gesture.time > 220) gesture.sum = 0;
      gesture.time = now;
      if (gesture.sum === Infinity) { e.preventDefault(); return; }
      if (canScroll(panel(), direction)) { gesture.sum = 0; return; }
      e.preventDefault();
      gesture.sum += e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      if (Math.abs(gesture.sum) >= 24) {
        gesture.sum = Infinity;
        move(Math.sign(e.deltaY));
      }
    };
    const touchStart = (e) => {
      if (e.touches.length !== 1) { start = null; return; }
      const el = panel();
      start = { x: e.touches[0].clientX, y: e.touches[0].clientY,
        down: canScroll(el, 1), up: canScroll(el, -1) };
    };
    const touchEnd = (e) => {
      if (!start) return;
      const dy = start.y - e.changedTouches[0].clientY;
      const dx = start.x - e.changedTouches[0].clientX;
      const initial = start;
      start = null;
      if (Math.abs(dy) < 45 || Math.abs(dx) > Math.abs(dy)) return;
      if (dy > 0 ? initial.down : initial.up) return;
      move(Math.sign(dy));
    };
    const cancel = () => { start = null; };
    root.addEventListener("wheel", wheel, { passive: false });
    root.addEventListener("touchstart", touchStart, { passive: true });
    root.addEventListener("touchend", touchEnd, { passive: true });
    root.addEventListener("touchcancel", cancel);
    return () => {
      root.removeEventListener("wheel", wheel);
      root.removeEventListener("touchstart", touchStart);
      root.removeEventListener("touchend", touchEnd);
      root.removeEventListener("touchcancel", cancel);
    };
  }, [activePage]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { events } = useEvents();
  const { pinnedEventId } = usePinnedEvent();

  const [activeCategory, setActiveCategory] = useState("all");
  
const [darkMode, setDarkMode] = useState(true);

useEffect(() => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    setDarkMode(false);
  } else {
    setDarkMode(true);
  }
}, []);

const toggleTheme = () => {
  const nextMode = !darkMode;
  setDarkMode(nextMode);
  localStorage.setItem("theme", nextMode ? "dark" : "light");
};

  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();

    return {
      year: now.getFullYear(),
      month: now.getMonth(),
    };
  });
  const [toastMessage, setToastMessage] = useState(null);






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
      if (!document.execCommand('copy')) throw new Error('Copy failed');
      showToast("링크가 클립보드에 복사되었습니다! 📋");
    } catch {
      showToast("링크 복사에 실패했습니다.");
    }
    document.body.removeChild(textArea);
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
  <div className={darkMode ? "dark" : ""}>
    <main className="fullpage-container site-theme font-sans antialiased">
    

<div className="site-header">
  <div className="site-header-inner">
    <a href="#home" onClick={(e) => { e.preventDefault(); goTo("home"); }} className="site-brand">
      <span className="text-xl font-black tracking-tight">
        김태현
      </span>
      <span className="text-[11px] font-serif italic opacity-60">
        Stand-up Comedian
      </span>
    </a>

    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        aria-label="공유하기"
        className="header-icon-button"
      >
        <ShareIcon className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={toggleTheme}
        aria-label={darkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
        className="header-icon-button"
      >
        {darkMode ? (
          <SunIcon className="w-5 h-5" />
        ) : (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.9 13.35A9 9 0 0 1 10.65 3.1 9 9 0 1 0 20.9 13.35Z" />
          </svg>
        )}
      </button>
    </div>
  </div>
</div>



        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-white text-neutral-900 px-4 py-2.5 rounded-2xl shadow-xl text-xs font-bold">
            {toastMessage}
          </div>
        )}

        <nav aria-label="페이지 이동" className="fixed bottom-0 left-0 right-0 z-40 flex justify-center bg-[var(--site-bg)]/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center gap-5 py-2">
            {[["home", "홈"], ["calendar", "공연 일정"], ["venues", "공연장"]].map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); goTo(id); }} aria-current={activePage === id ? "location" : undefined} className={`flex min-h-9 flex-col items-center justify-center gap-1 text-[11px] ${activePage === id ? "font-bold text-red-700 dark:text-red-400" : "text-neutral-600 dark:text-neutral-400"}`}>
                <span className={`h-1 rounded-full transition-all ${activePage === id ? "w-5 bg-red-600" : "w-1.5 bg-neutral-400 dark:bg-neutral-600"}`} />
                {label}
              </a>
            ))}
          </div>
        </nav>

        {/* 01. HOME */}
        <section id="home" className={`fullpage-section ${activePage === "home" ? "is-active" : ""}`} data-active={activePage === "home"}>
          <div className="fullpage-content home-content">
  {mounted && (
    <>
      <div className="mobile-home"><Header nextShow={nextShow} /></div>
      <div className="desktop-home"><DesktopHeader nextShow={nextShow} /></div>
    </>
  )}
</div>
        </section>

        {/* 02. CALENDAR */}
        <section id="calendar" className={`fullpage-section ${activePage === "calendar" ? "is-active" : ""}`} data-active={activePage === "calendar"}>
          <div className="fullpage-content">

            <Calendar
              events={filteredEvents}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
            />

          </div>
        </section>

        {/* 03. VENUES & CHANNELS */}
        <section id="venues" className={`fullpage-section ${activePage === "venues" ? "is-active" : ""}`} data-active={activePage === "venues"}>
          <div className="fullpage-content">

            <VenueInfoCards />

            <footer className="mt-6 mb-2 text-center text-[10px] text-neutral-400 font-semibold">
              <p>© 2026 KIM TAE HYUN. All rights reserved.</p>
            </footer>

          </div>
        </section>

      </main>
    </div>
  );
}

