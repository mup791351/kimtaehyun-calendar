"use client";

import React, { useState, useMemo } from "react";

import { VENUES } from "../lib/venues";
import { CATEGORY_COLORS } from "../lib/categoryColors";

const XMark = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

function Legend({ catKey, cat, isActive, onClick }) {
  return (
    <button
      onClick={() => onClick(catKey)}
      className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${isActive
        ? `${cat.color} ${catKey === 'solo' ? 'text-neutral-950 ring-4 ring-amber-300' : 'text-white'} shadow-sm ring-2 ring-offset-1 ring-neutral-300 dark:ring-neutral-600 scale-105`
        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 active:bg-neutral-200 dark:active:bg-neutral-700"
        }`}
    >
      {catKey === "etc" ? (
        <span className="text-xs leading-none">
          🎸
        </span>
      ) : (
        <img
          src={cat.icon}
          alt=""
          className={`w-4 h-4 sm:w-5 sm:h-5 object-contain ${catKey === "solo"
            ? "animate-pulse drop-shadow-[0_0_5px_rgba(250,204,21,0.9)]"
            : ""
            }`}
        />
      )}
      <span>{cat.label}</span>
    </button>
  );
}

function EventModal({ isOpen, onClose, dayString, events }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-neutral-100 dark:border-neutral-800 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
        >
          <XMark className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-0.5">
          {dayString} 일정
        </h3>
        <p className="text-[11px] text-neutral-400 font-semibold mb-4">
          해당 일자에 등록된 공식 일정입니다.
        </p>

        {events && events.length > 0 ? (
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {events.map((evt) => {
              const cat = CATEGORY_COLORS[evt.category] || CATEGORY_COLORS.etc;
              const venueInfo = evt.venueKey ? VENUES[evt.venueKey] : null;

              return (
                <div key={evt.id} className="p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/80 space-y-2">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${evt.category === 'solo' ? '' : 'text-white'} ${cat.color}`}>
                    {cat.label}
                  </span>

                  <h4 className="font-bold text-xs text-neutral-900 dark:text-white">{evt.title}</h4>

                  <div className="space-y-0.5 text-[11px] text-neutral-600 dark:text-neutral-300 font-medium">
                    <p className="flex items-center gap-1">🕒 {evt.startTime}</p>
                    {(venueInfo || evt.customVenue) && (
                      <p className="flex items-center gap-1">
                        📍 {venueInfo?.name || evt.customVenue}
                      </p>
                    )}
                    {evt.lineup && evt.lineup.length > 0 && <p className="flex items-center gap-1">👤 {evt.lineup.join(" · ")}</p>}
                    {evt.price > 0 && <p className="font-bold text-neutral-900 dark:text-white pt-0.5">💰 ₩ {evt.price.toLocaleString()}</p>}
                    {evt.description && (
                      <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700/60">
                        <p className="text-[10px] font-black text-neutral-400 mb-1">
                          공연 소개
                        </p>
                        <p className="text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-300">
                          {evt.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1.5 pt-1.5 border-t border-neutral-200 dark:border-neutral-700/60">
                    {(evt.booking || venueInfo?.booking) && (
                      <a
                        href={evt.booking || venueInfo.booking}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 bg-neutral-950 dark:bg-white dark:text-neutral-900 text-white rounded-xl text-[11px] font-bold text-center block"
                      >
                        🔗 예매하기
                      </a>
                    )}
                    {venueInfo && venueInfo.instagram && (
                      <a
                        href={venueInfo.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-xl text-[11px] font-bold text-center block"
                      >
                        📷 인스타
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-neutral-400">
            <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">등록된 일정이 없습니다.</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full py-2.5 bg-neutral-950 dark:bg-white dark:text-neutral-900 text-white rounded-xl font-bold text-xs"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default function Calendar({ events, activeCategory, onCategoryChange, currentDate, setCurrentDate }) {
  const [selectedDayNum, setSelectedDayNum] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const year = currentDate.year;
  const month = currentDate.month;

  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const blanks = Array.from({ length: startOffset });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
  const today = new Date();

  if (
    year < today.getFullYear() ||
    (year === today.getFullYear() && month <= today.getMonth())
  ) {
    return;
  }

  if (month === 0) {
    setCurrentDate({ year: year - 1, month: 11 });
  } else {
    setCurrentDate({ year, month: month - 1 });
  }
};

  const handleNextMonth = () => {
    if (month === 11) {
      setCurrentDate({ year: year + 1, month: 0 });
    } else {
      setCurrentDate({ year, month: month + 1 });
    }
  };


  const eventsByDay = useMemo(() => {
  const map = {};

  events.forEach((evt) => {
    const [eYear, eMonth, eDay] = evt.date.split('-').map(Number);

    if (eYear === year && eMonth === month + 1) {
      if (!map[eDay]) map[eDay] = [];
      map[eDay].push(evt);
    }
  });

  // 같은 날짜의 일정은 시작 시간 빠른 순으로 정렬
  Object.values(map).forEach((dayEvents) => {
    dayEvents.sort((a, b) =>
      (a.startTime || "23:59").localeCompare(b.startTime || "23:59")
    );
  });

  return map;
}, [events, year, month]);

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const handleDayClick = (day) => {
    setSelectedDayNum(day);
    setIsModalOpen(true);
  };

  return (
    <>
      <section id="calendar" className="rounded-2xl bg-[#111111] p-3 sm:p-5 shadow-sm border border-neutral-800 my-3 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <button
  onClick={handlePrevMonth}
  disabled={
    year < new Date().getFullYear() ||
    (year === new Date().getFullYear() &&
      month <= new Date().getMonth())
  }
  className="w-7 h-7 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-300 font-black text-sm active:bg-neutral-800 disabled:opacity-20 disabled:cursor-not-allowed"
>
  ‹
</button>
          <div className="text-center">
            <h2 className="text-base sm:text-xl font-black text-white">
              {month + 1}월
            </h2>
          </div>
          <button
            onClick={handleNextMonth}
            className="w-7 h-7 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-300 font-black text-sm active:bg-neutral-800"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1.5 text-center">
          {["월", "화", "수", "목", "금", "토", "일"].map((day, index) => (
            <div key={day} className={`font-extrabold text-[15px] py-1 ${index === 5 ? "text-blue-500" : index === 6 ? "text-red-500" : "text-neutral-400"}`}>
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {blanks.map((_, i) => (
            <div key={`blank-${i}`} className="h-16 sm:h-20 opacity-0" />
          ))}

          {days.map((day) => {
            const dayEvents = eventsByDay[day] || [];

            const uniqueDayEvents = dayEvents.filter(
              (evt, index, self) =>
                index === self.findIndex((e) => e.category === evt.category)
            );



            const hasEvents = dayEvents.length > 0;
            const isToday = currentYear === year && currentMonth === month && currentDay === day;
            const isPast = new Date(year, month, day) < new Date(currentYear, currentMonth, currentDay);

            return (
              <div key={day} className="relative">
                <button
                  onClick={() => handleDayClick(day)}
                  className={`w-full h-16 sm:h-20 rounded-xl p-1 flex flex-col justify-between transition-all text-left border overflow-hidden ${hasEvents
                    ? "bg-[#191919] border-neutral-800 active:border-red-500 shadow-sm"
                    : "border-transparent active:bg-[#151515]"
                    } ${isToday ? "ring-2 ring-black dark:ring-white bg-orange-50/60 dark:bg-orange-950/30" : ""}`}
                >
                  <div className="flex flex-col w-full">
                    <span className={`font-black text-xs leading-none ${isToday ? "text-red-500 font-extrabold" : isPast ? "text-neutral-600 font-normal" : hasEvents ? "text-white" : "text-neutral-500"}`}>
                      {day}
                    </span>
                    {isToday && (
                      <span className="text-[7px] font-black text-red-400 bg-red-950 px-1 py-0.5 rounded font-sans tracking-tighter w-max mt-0.5 scale-90 origin-left">
                        TODAY
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-center gap-0 mb-0.5">
                    {uniqueDayEvents.map((evt, index) => {

                      const iconMap = {
                        seoul: "/icons/seococl.png",
                        meta: "/icons/metacocl.png",
                        samgak: "/icons/samgakjidae.png",
                        solo: "/icons/taehyun.png",
                        etc: "🎸",
                      };

                      const icon = iconMap[evt.category] || "🎸";


                      return (
                        <span
                          key={index}
                          title={evt.title}
                          className="w-5 h-5 flex-shrink-0 flex items-center justify-center"
                        >
                          {icon.startsWith("/") ? (
                            <img
                              src={icon}
                              alt=""
                              className={`w-full h-full object-contain ${evt.category === "solo"
                                ? "animate-pulse drop-shadow-[0_0_5px_rgba(250,204,21,0.9)]"
                                : evt.category === "meta"
                                  ? "scale-125"
                                  : ""
                                }`}
                            />
                          ) : (
                            <span className="text-xs leading-none">
                              {icon}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {Object.keys(eventsByDay).length === 0 && (
          <div className="py-6 text-center text-neutral-400">
            <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">이 달에 등록된 일정이 없습니다.</p>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-700">
          <p className="text-[10px] font-bold text-neutral-400 text-center uppercase tracking-wider mb-2">
            카테고리 필터
          </p>
          <div className="flex gap-1.5 overflow-x-auto py-2 scrollbar-none justify-start sm:justify-center">
            <button
              onClick={() => onCategoryChange("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${activeCategory === "all"
                ? "bg-neutral-950 dark:bg-white dark:text-neutral-900 text-white shadow-sm ring-2 ring-offset-1 ring-neutral-300 dark:ring-neutral-600 scale-105"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                }`}
            >
              전체 보기
            </button>
            {Object.entries(CATEGORY_COLORS).map(([key, cat]) => (
              <Legend
                key={key}
                catKey={key}
                cat={cat}
                isActive={activeCategory === key}
                onClick={onCategoryChange}
              />
            ))}
          </div>
        </div>
      </section>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dayString={`${month + 1}월 ${selectedDayNum}`}
        events={selectedDayNum ? (eventsByDay[selectedDayNum] || []) : []}
      />
    </>
  );
}

