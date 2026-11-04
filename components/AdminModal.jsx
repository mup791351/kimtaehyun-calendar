"use client";


import React, { useState, useEffect } from "react";
import { db, auth } from "../lib/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,

} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";



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

const getTodayDate = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function AdminModal({ isOpen, onClose, events, onDeleteEvent, onAddEvent, onUpdateEvent, pinnedEventId, onTogglePinstandalone = false, }) {
  const ADMIN_UID = "C5nNrpbLzye3VWuaTLr8Wy82Ydo2";

const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [errorMsg, setErrorMsg] = useState("");
const [loginLoading, setLoginLoading] = useState(false);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setIsAdminLoggedIn(user?.uid === ADMIN_UID);
  });

  return () => unsubscribe();
}, []);

  const [editingId, setEditingId] = useState(null);
  const [date, setDate] = useState(getTodayDate);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("seoul");
  const [venueKey, setVenueKey] = useState("seoul");
  const [customVenue, setCustomVenue] = useState("");
  const [startTime, setStartTime] = useState("20:00");
  const [lineup, setLineup] = useState("김태현");
  const [price, setPrice] = useState(33000);
  const [booking, setBooking] = useState("");
  const [description, setDescription] = useState("");

  const [adminDate, setAdminDate] = useState(() => {
    const now = new Date();

    return {
      year: now.getFullYear(),
      month: now.getMonth(),
    };
  });

  const filteredAdminEvents = events
    .filter((evt) => {
      const [eventYear, eventMonth] = evt.date.split("-").map(Number);

      return (
        eventYear === adminDate.year &&
        eventMonth === adminDate.month + 1
      );
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const handleAdminPrevMonth = () => {
    if (adminDate.month === 0) {
      setAdminDate({
        year: adminDate.year - 1,
        month: 11,
      });
    } else {
      setAdminDate({
        year: adminDate.year,
        month: adminDate.month - 1,
      });
    }
  };

  const handleAdminNextMonth = () => {
    if (adminDate.month === 11) {
      setAdminDate({
        year: adminDate.year + 1,
        month: 0,
      });
    } else {
      setAdminDate({
        year: adminDate.year,
        month: adminDate.month + 1,
      });
    }
  };

  const applyPreset = (presetKey) => {
    const preset = EVENT_PRESETS[presetKey];

    if (!preset) return;

    setEditingId(null);
    setTitle(preset.title);
    setCategory(preset.category);
    setVenueKey(preset.venueKey);
    setPrice(preset.price);
    setCustomVenue("");
    setBooking(preset.booking);
    setDescription(preset.description || "");
    setLineup("");
  };

  if (!isOpen) return null;

  const handleLogin = async (e) => {
  e.preventDefault();
  setErrorMsg("");
  setLoginLoading(true);

  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (credential.user.uid !== ADMIN_UID) {
      await signOut(auth);
      setErrorMsg("관리자 권한이 없는 계정입니다.");
      return;
    }

    setIsAdminLoggedIn(true);
    setPassword("");
  } catch (error) {
    setErrorMsg("이메일 또는 비밀번호를 확인해주세요.");
  } finally {
    setLoginLoading(false);
  }
};

const handleLogout = async () => {
  try {
    await signOut(auth);

    setIsAdminLoggedIn(false);
    setEmail("");
    setPassword("");
    setErrorMsg("");

    onClose();
  } catch (error) {
    setErrorMsg("로그아웃에 실패했습니다.");
  }
};


const handleBackup = async () => {
  try {
    // Firebase의 모든 일정 문서 읽기
    const snapshot = await getDocs(
      collection(db, "events")
    );

    // NEXT SHOW 고정 설정 읽기
    const settingsSnapshot = await getDoc(
      doc(db, "settings", "main")
    );

    const backup = {
      exportedAt: new Date().toISOString(),

      events: snapshot.docs.map((document) => ({
        documentId: document.id,
        data: document.data(),
      })),

      settings: settingsSnapshot.exists()
        ? {
            documentId: settingsSnapshot.id,
            data: settingsSnapshot.data(),
          }
        : null,
    };

    const json = JSON.stringify(backup, null, 2);

    const blob = new Blob([json], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `kimtaehyun-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("백업 오류:", error);
    alert("Firebase 백업에 실패했습니다.");
  }
};





  const handleStartEdit = (evt) => {
    setEditingId(evt.id);
    setDate(evt.date);
    setTitle(evt.title);
    setCategory(evt.category || "seoul");
    setVenueKey(evt.customVenue ? "custom" : (evt.venueKey || "none"));
    setCustomVenue(evt.customVenue || "");
    setStartTime(evt.startTime || "20:00");
    setLineup(evt.lineup ? evt.lineup.join(", ") : "");
    setPrice(evt.price || 0);
    setBooking(evt.booking || "");
    setDescription(evt.description || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDate(getTodayDate());
    setTitle("");
    setCategory("seoul");
    setVenueKey("seoul");
    setStartTime("20:00");
    setCustomVenue("");
    setLineup("김태현");
    setPrice(33000);
    setBooking("");
    setDescription("");
  };

  const handleSubmitEvent = (e) => {
    e.preventDefault();
    const dayNum = parseInt(date.split('-')[2], 10);
    const eventData = {
      id: editingId || `custom-${Date.now()}`,
      date,
      day: dayNum,
      category,
      venueKey: venueKey === "none" || venueKey === "custom" ? null : venueKey,
      customVenue: venueKey === "custom" ? customVenue : "",
      title,
      startTime,
      lineup: lineup.split(',').map(s => s.trim()).filter(Boolean),
      price: Number(price) || 0,
      booking,
      description
    };

    if (editingId) {
      onUpdateEvent(eventData);
    } else {
      onAddEvent(eventData);
    }
    handleCancelEdit();
  };

  return (
    
<div
  className={
    standalone
      ? "w-full"
      : "fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm"
  }
>
  <div
    className={
      standalone
        ? "w-full rounded-2xl bg-white p-5 text-neutral-900 dark:bg-neutral-900 dark:text-white"
        : "bg-white dark:bg-neutral-900 rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-neutral-100 dark:border-neutral-800 relative max-h-[90vh] overflow-y-auto"
    }
  >
        {!standalone && (
  <button
    onClick={onClose}
    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
  >
    <XMark className="w-4 h-4" />
  </button>
)}

        {!isAdminLoggedIn ? (
          <div>
            <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-1">관리자 로그인</h3>
            <p className="text-xs text-neutral-400 mb-4">관리자 계정으로 로그인해주세요.</p>
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
  <label className="block text-xs font-bold mb-1">
    이메일
  </label>
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="관리자 이메일"
    required
    autoComplete="username"
    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs dark:text-white"
  />
</div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold dark:text-white"
                />
              </div>
              {errorMsg && <p className="text-xs text-red-500 font-bold">{errorMsg}</p>}
              <button
                type="submit"
                className="w-full py-3 bg-neutral-950 dark:bg-white dark:text-neutral-900 text-white rounded-xl font-bold text-xs shadow"
              >
                로그인
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-end gap-2 mt-6 mb-4">
  <button
    type="button"
    onClick={handleBackup}
    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors text-xs font-medium"
  >
    ↓ 백업
  </button>

  <button
    type="button"
    onClick={handleLogout}
    className="px-3 py-2 rounded-lg border border-neutral-700 text-neutral-400 hover:border-red-500 hover:text-red-400 transition-colors text-xs font-medium"
  >
    로그아웃
  </button>


</div>
            <div>
              <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-1">
                {editingId ? "일정 수정하기" : "새 일정 추가"}
              </h3>
              <p className="text-xs text-neutral-400 mb-4">
                {editingId ? "선택한 일정을 수정합니다." : "새로운 공연 또는 업로드 일정을 등록합니다."}
              </p>


              {!editingId && (
                <div className="mb-4 p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                  <p className="text-xs font-black text-neutral-900 dark:text-white mb-3">
                    ⚡ 빠른 일정 추가
                  </p>

                  {/* 메타코미디클럽 */}
                  <p className="text-[11px] font-black text-neutral-700 dark:text-neutral-200 mb-2">
                    메타코미디클럽
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => applyPreset("meta_assembly")}
                      className="py-2 rounded-xl bg-orange-500 text-white text-[11px] font-bold"
                    >
                      스탠드업어셈블
                    </button>

                    <button
                      type="button"
                      onClick={() => applyPreset("meta_assembly_se")}
                      className="py-2 rounded-xl bg-orange-500 text-white text-[11px] font-bold"
                    >
                      스탠드업어셈블 SE
                    </button>

                    <button
                      type="button"
                      onClick={() => applyPreset("meta_openmic")}
                      className="py-2 rounded-xl bg-orange-500 text-white text-[11px] font-bold"
                    >
                      오픈마이크
                    </button>

                    <button
                      type="button"
                      onClick={() => applyPreset("meta_crowdwork")}
                      className="py-2 rounded-xl bg-orange-500 text-white text-[11px] font-bold"
                    >
                      크라우드워크어셈블
                    </button>
                  </div>

                  {/* 삼각지대 */}
                  <p className="text-[11px] font-black text-neutral-700 dark:text-neutral-200 mb-2 mt-4">
                    삼각지대
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => applyPreset("samgak_openmic")}
                      className="py-2 rounded-xl bg-emerald-600 text-white text-[11px] font-bold"
                    >
                      오픈마이크
                    </button>

                    <button
                      type="button"
                      onClick={() => applyPreset("samgak_comedynight")}
                      className="py-2 rounded-xl bg-emerald-600 text-white text-[11px] font-bold"
                    >
                      코미디나이트
                    </button>
                  </div>

                  {/* 서울코미디클럽 */}
                  <p className="text-[11px] font-black text-neutral-700 dark:text-neutral-200 mb-2 mt-4">
                    서울코미디클럽
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => applyPreset("seoul_allstars")}
                      className="py-2 rounded-xl bg-blue-600 text-white text-[11px] font-bold"
                    >
                      올스타즈
                    </button>

                    <button
                      type="button"
                      onClick={() => applyPreset("seoul_draft")}
                      className="py-2 rounded-xl bg-blue-600 text-white text-[11px] font-bold"
                    >
                      드래프트
                    </button>
                  </div>
                </div>
              )}



              <form onSubmit={handleSubmitEvent} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-0.5">날짜</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-0.5">제목</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="공연 제목 입력"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-0.5">카테고리</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold dark:text-white"
                    >
                      <option value="solo">단독쇼</option>
                      <option value="seoul">서울코미디클럽</option>
                      <option value="meta">메타코미디클럽</option>
                      <option value="samgak">삼각지대</option>
                      <option value="etc">기타</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-0.5">장소</label>
                    <select
                      value={venueKey}
                      onChange={(e) => setVenueKey(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold dark:text-white"
                    >
                      <option value="seoul">서울코미디클럽</option>
                      <option value="meta">메타코미디클럽 홍대</option>
                      <option value="samgak">삼각지대</option>
                      <option value="custom">직접 입력</option>
                      <option value="none">온라인 / 기타</option>
                    </select>
                  </div>
                </div>

                {venueKey === "custom" && (
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-0.5">
                      장소 직접 입력
                    </label>

                    <input
                      type="text"
                      value={customVenue}
                      onChange={(e) => setCustomVenue(e.target.value)}
                      placeholder="공연장 이름 입력"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold dark:text-white"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-0.5">시간</label>
                    <input
                      type="text"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      placeholder="20:00"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-0.5">가격</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="33000"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-0.5">출연진</label>
                  <input
                    type="text"
                    value={lineup}
                    onChange={(e) => setLineup(e.target.value)}
                    placeholder="김태현, 손동훈"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-0.5">예매 링크</label>
                  <input
                    type="url"
                    value={booking}
                    onChange={(e) => setBooking(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-0.5">설명</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="공연 설명..."
                    className="w-full px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold dark:text-white h-14 resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 py-3 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-white rounded-xl font-bold text-xs"
                    >
                      취소
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-bold text-xs hover:bg-orange-700 transition shadow"
                  >
                    {editingId ? "일정 수정 완료" : "일정 추가하기"}
                  </button>
                </div>
              </form>
            </div>

            <hr className="border-neutral-200 dark:border-neutral-800" />

            <div>
              <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-2">등록된 일정 관리 (고정/수정/삭제)</h3>
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={handleAdminPrevMonth}
                  className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800
               text-neutral-700 dark:text-neutral-200 font-black
               hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                >
                  ‹
                </button>

                <p className="text-sm font-black text-neutral-900 dark:text-white">
                  {adminDate.year}년 {adminDate.month + 1}월
                </p>

                <button
                  type="button"
                  onClick={handleAdminNextMonth}
                  className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800
               text-neutral-700 dark:text-neutral-200 font-black
               hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                >
                  ›
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {filteredAdminEvents.map((evt) => {
                  const isPinned = pinnedEventId === evt.id;
                  return (
                    <div key={evt.id} className="flex items-center justify-between p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs">
                      <div className="pr-2 truncate flex items-center gap-1.5">
                        <button
                          onClick={() => onTogglePin(evt.id)}
                          className={`px-2 py-1 rounded text-[10px] font-black ${isPinned ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'}`}
                          title="클릭 시 Next Show로 고정/해제"
                        >
                          {isPinned ? "📌 고정됨" : "📌 고정"}
                        </button>
                        <span className="font-bold">
                          {Number(evt.date.split("-")[1])}/{Number(evt.date.split("-")[2])}
                        </span> — <span className="text-neutral-600 dark:text-neutral-300">{evt.title}</span>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => handleStartEdit(evt)}
                          className="px-2 py-1 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg font-bold hover:opacity-80"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => {
  const [, month, day] = evt.date.split("-");

  const eventName = `${Number(month)}/${Number(day)} ${evt.title}`;

  if (window.confirm(`${eventName} 삭제하시겠습니까?`)) {
    onDeleteEvent(evt.id);
  }
}}
                          className="px-2.5 py-1 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
