"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { db, auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  collection,
  getDocs,

  setDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { VENUES } from "../lib/venues";
import { EVENT_PRESETS } from "../lib/eventPresets";
import { CATEGORY_COLORS } from "../lib/categoryColors";
import Calendar from "../components/Calendar";
import VenueInfoCards from "../components/VenueInfoCards";

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

const INITIAL_EVENTS = [
  {
    id: "aug-1",
    date: "2026-08-01",
    day: 1,
    category: "seoul",
    venueKey: "seoul",
    title: "서울코미디클럽 올스타즈",
    startTime: "21:30",
    lineup: ["김태현", "대니초", "손동훈", "신승수", "홍승상"],
    price: 33000,
    booking: "https://booking.naver.com/booking/12/bizes/627353/items/4217612",
    description: "서울코미디클럽 최고의 라인업으로 펼쳐지는 올스타즈 쇼!"
  },
  {
    id: "aug-2",
    date: "2026-08-02",
    day: 2,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 스탠드업어셈블 SE",
    startTime: "19:00",
    lineup: ["김태현", "외"],
    price: 22000,
    booking: "https://booking.naver.com/booking/12/bizes/1037135/items/6849154",
    description: "특별 에디션으로 진행되는 메타코미디클럽 스탠드업 어셈블!"
  },
  {
    id: "aug-3",
    date: "2026-08-03",
    day: 3,
    category: "samgak",
    venueKey: "samgak",
    title: "삼각지대 오픈마이크",
    startTime: "20:00",
    lineup: ["김태현", "외"],
    price: 5000,
    booking: "https://docs.google.com/forms/d/e/1FAIpQLSfGHLErwl5c7N2qSkrenXqVm0OV1HXRKuhZ3wb1xxOSO06Osw/viewform",
    description: "신작 조크 테스트와 익스트림한 웃음이 오가는 삼각지대 오픈마이크."
  },
  {
    id: "aug-5",
    date: "2026-08-05",
    day: 5,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 오픈마이크",
    startTime: "20:00",
    lineup: ["김태현", "외"],
    price: 5000,
    booking: "https://booking.naver.com/booking/12/bizes/1037135?utm_source=ig&utm_medium=social&utm_content=link_in_bio",
    description: "홍대에서 만나는 날카롭고 솔직한 수요일 정기 오픈마이크."
  },
  {
    id: "aug-6",
    date: "2026-08-06",
    day: 6,
    category: "seoul",
    venueKey: "seoul",
    title: "서울코미디클럽 올스타즈",
    startTime: "20:00",
    lineup: ["김태현", "송하빈", "김영구", "원소윤", "문지완"],
    price: 33000,
    booking: "https://booking.naver.com/booking/12/bizes/627353/items/4217612",
    description: "서울코미디클럽 올스타즈 라이브 무대."
  },
  {
    id: "aug-8",
    date: "2026-08-08",
    day: 8,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 스탠드업어셈블",
    startTime: "20:30",
    lineup: ["김태현", "김종찬", "손동훈", "김영구", "대니초"],
    price: 33000,
    booking: "https://booking.naver.com/booking/12/bizes/1037135/items/6775565",
    description: "메타코미디클럽 대표 스탠드업 어셈블."
  },
  {
    id: "aug-9",
    date: "2026-08-09",
    day: 9,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 크라우드워크 어셈블",
    startTime: "19:00",
    lineup: ["김태현", "김종찬", "여준영", "박철현", "배꼽사냥꾼(이제규,조훈)"],
    price: 33000,
    booking: "https://booking.naver.com/booking/12/bizes/1037135/items/7586165",
    description: "관객과 실시간 소통하는 크라우드워크 어셈블 쇼!"
  },
  {
    id: "aug-11",
    date: "2026-08-11",
    day: 11,
    category: "samgak",
    venueKey: "samgak",
    title: "삼각지대 쇼케이스",
    startTime: "20:00",
    lineup: ["김태현", "임명환", "국원준", "김용준", "도준혁", "강태훈", "홍승상", "문성준"],
    price: 10000,
    booking: "https://docs.google.com/forms/d/e/1FAIpQLSfl_KvPNeGqiuhRcp5WlfW8RG9yepEI8Os4i1aHEnPM1MbQyQ/viewform",
    description: "삼각지대 쇼케이스 무대."
  },
  {
    id: "aug-12",
    date: "2026-08-12",
    day: 12,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 오픈마이크",
    startTime: "20:00",
    lineup: ["김태현", "외"],
    price: 5000,
    booking: "https://booking.naver.com/booking/12/bizes/1037135?utm_source=ig&utm_medium=social&utm_content=link_in_bio",
    description: "메타코미디클럽 수요일 오픈마이크."
  },
  {
    id: "aug-13",
    date: "2026-08-13",
    day: 13,
    category: "seoul",
    venueKey: "seoul",
    title: "서울코미디클럽 올스타즈",
    startTime: "20:00",
    lineup: ["김태현", "대니초", "손동훈", "김영구", "여준영"],
    price: 33000,
    booking: "https://booking.naver.com/booking/12/bizes/627353/items/4217612",
    description: "서울코미디클럽 올스타즈."
  },
  {
    id: "aug-15-1",
    date: "2026-08-15",
    day: 15,
    category: "seoul",
    venueKey: "seoul",
    title: "서울코미디클럽 올스타즈",
    startTime: "18:00",
    lineup: ["김태현", "대니초", "송하빈", "이제규", "김주환"],
    price: 33000,
    booking: "https://booking.naver.com/booking/12/bizes/627353/items/4217612",
    description: "광복절 특집 서울코미디클럽 올스타즈."
  },
  {
    id: "aug-16",
    date: "2026-08-16",
    day: 16,
    category: "seoul",
    venueKey: "seoul",
    title: "서울코미디클럽 올스타즈",
    startTime: "15:00",
    lineup: ["김태현", "이제규", "김주환", "김영구", "여준영"],
    price: 33000,
    booking: "https://booking.naver.com/booking/12/bizes/627353/items/4217612",
    description: "일요일 낮 서울코미디클럽 올스타즈."
  },
  {
    id: "aug-17",
    date: "2026-08-17",
    day: 17,
    category: "seoul",
    venueKey: "seoul",
    title: "서울코미디클럽 올스타즈",
    startTime: "18:30",
    lineup: ["김태현", "이제규", "김종찬", "여준영", "신승수"],
    price: 33000,
    booking: "https://booking.naver.com/booking/12/bizes/627353/items/4217612",
    description: "월요일 저녁 서울코미디클럽 올스타즈."
  },
  {
    id: "aug-18",
    date: "2026-08-18",
    day: 18,
    category: "seoul",
    venueKey: "seoul",
    title: "서울코미디클럽 드래프트",
    startTime: "20:00",
    lineup: ["김태현", "외"],
    price: 10000,
    booking: "https://booking.naver.com/booking/12/bizes/627353/items/7783146",
    description: "신예와 베테랑이 함께하는 드래프트 무대."
  },
  {
    id: "aug-19",
    date: "2026-08-19",
    day: 19,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 오픈마이크",
    startTime: "20:00",
    lineup: ["김태현", "외"],
    price: 5000,
    booking: "https://booking.naver.com/booking/12/bizes/1037135?utm_source=ig&utm_medium=social&utm_content=link_in_bio",
    description: "메타코미디클럽 수요일 오픈마이크."
  },
  {
    id: "aug-20",
    date: "2026-08-20",
    day: 20,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 크라우드워크 어셈블",
    startTime: "20:00",
    lineup: ["김태현", "김동하", "김종찬", "배꼽사냥꾼(이제규,조훈)", "여준영"],
    price: 33000,
    booking: "https://booking.naver.com/booking/12/bizes/1037135/items/7586165",
    description: "크라우드워크 어셈블 라이브 쇼!"
  },
  {
    id: "aug-22-1",
    date: "2026-08-22",
    day: 22,
    category: "seoul",
    venueKey: "seoul",
    title: "서울코미디클럽 올스타즈",
    startTime: "14:30",
    lineup: ["김태현", "손동훈", "박철현", "여준영", "신승수"],
    price: 33000,
    booking: "https://booking.naver.com/booking/12/bizes/627353/items/4217612",
    description: "토요일 낮 서울코미디클럽 올스타즈."
  },
  {
    id: "aug-22-2",
    date: "2026-08-22",
    day: 22,
    category: "seoul",
    venueKey: "seoul",
    title: "서울코미디클럽 올스타즈",
    startTime: "18:00",
    lineup: ["김태현", "김주환", "문성준", "문지완", "홍승상"],
    price: 33000,
    booking: "https://booking.naver.com/booking/12/bizes/627353/items/4217612",
    description: "토요일 저녁 서울코미디클럽 올스타즈."
  },
  {
    id: "aug-22-3",
    date: "2026-08-22",
    day: 22,
    category: "seoul",
    venueKey: "seoul",
    title: "서울코미디클럽 올스타즈",
    startTime: "21:30",
    lineup: ["김태현", "손동훈", "김주환", "문성준", "여준영"],
    price: 33000,
    booking: "https://booking.naver.com/booking/12/bizes/627353/items/4217612",
    description: "토요일 밤 서울코미디클럽 올스타즈."
  },
  {
    id: "aug-23",
    date: "2026-08-23",
    day: 23,
    category: "solo",
    venueKey: "seoul",
    title: "김태현 단독쇼 [트래쉬토크]",
    startTime: "18:30",
    lineup: ["김태현"],
    price: 22000,
    booking: "https://booking.naver.com/booking/12/bizes/627353/items/7888209",
    description: "김태현의 거침없고 폭발적인 입담을 만날 수 있는 단독 스페셜 라이브 쇼 [트래쉬토크]!"
  },
  {
    id: "aug-25",
    date: "2026-08-25",
    day: 25,
    category: "samgak",
    venueKey: "samgak",
    title: "삼각지대 기획공연 [장르를 이탈하였습니다]",
    startTime: "20:00",
    lineup: ["미국식만담(김태현,문성준)", "영구쇼(김영구,손예린)", "광팔이 구정모", "주원빈", "김학영", "종이호랑이(국원준,홍승상)", "보케모드"],
    price: 10000,
    booking: "https://docs.google.com/forms/d/e/1FAIpQLSemMs1ujFYpWDnlSUVEeFdSzcmJfVzxi3ybhOP_ODuDCSZWUw/viewform?pli=1",
    description: "삼각지대 특별 기획공연 [장르를 이탈하였습니다]."
  },
  {
    id: "aug-26",
    date: "2026-08-26",
    day: 26,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 오픈마이크",
    startTime: "20:00",
    lineup: ["김태현", "외"],
    price: 5000,
    booking: "https://booking.naver.com/booking/12/bizes/1037135?utm_source=ig&utm_medium=social&utm_content=link_in_bio",
    description: "메타코미디클럽 수요일 오픈마이크."
  },
  {
    id: "aug-27",
    date: "2026-08-27",
    day: 27,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 스탠드업어셈블",
    startTime: "20:00",
    lineup: ["김태현", "손동훈", "송하빈", "이제규", "김종찬"],
    price: 33000,
    booking: "https://booking.naver.com/booking/12/bizes/1037135/items/6775565",
    description: "메타코미디클럽 스탠드업 어셈블."
  },
  {
    id: "aug-28",
    date: "2026-08-28",
    day: 28,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 스탠드업어셈블",
    startTime: "20:00",
    lineup: ["김태현", "김영구", "김주환", "박철현", "이제규"],
    price: 33000,
    booking: "https://booking.naver.com/booking/12/bizes/1037135/items/6775565",
    description: "메타코미디클럽 스탠드업 어셈블."
  },
  {
    id: "aug-29-1",
    date: "2026-08-29",
    day: 29,
    category: "seoul",
    venueKey: "seoul",
    title: "서울코미디클럽 올스타즈",
    startTime: "14:30",
    lineup: ["김태현", "김주환", "김영구", "문성준", "여준영"],
    price: 33000,
    booking: "https://booking.naver.com/booking/12/bizes/627353/items/4217612",
    description: "서울코미디클럽 올스타즈."
  },
  {
    id: "aug-29-2",
    date: "2026-08-29",
    day: 29,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 스탠드업어셈블",
    startTime: "20:30",
    lineup: ["김태현", "김영구", "김주환", "박성균", "박철현"],
    price: 33000,
    booking: "https://booking.naver.com/booking/12/bizes/1037135/items/6775565",
    description: "메타코미디클럽 스탠드업 어셈블."
  },
  {
    id: "aug-29-3",
    date: "2026-08-29",
    day: 29,
    category: "seoul",
    venueKey: "seoul",
    title: "서울코미디클럽 올스타즈",
    startTime: "21:30",
    lineup: ["김태현", "손동훈", "문성준", "여준영", "홍승상"],
    price: 33000,
    booking: "https://booking.naver.com/booking/12/bizes/627353/items/4217612",
    description: "서울코미디클럽 올스타즈 심야 쇼."
  },
  {
    id: "aug-30",
    date: "2026-08-30",
    day: 30,
    category: "seoul",
    venueKey: "seoul",
    title: "미국식농담 온스테이지",
    startTime: "15:00",
    lineup: ["김태현", "이제규", "문성준"],
    price: 33000,
    booking: "https://booking.naver.com/booking/12/bizes/627353/items/5020472",
    description: "유튜브 [미국식농담] 오프라인 확장판! 생생한 라이브로 만나는 특별 온스테이지."
  },
  {
    id: "sep-2",
    date: "2026-09-02",
    day: 2,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 오픈마이크",
    startTime: "20:00",
    price: 5000,
  },

  {
    id: "sep-3",
    date: "2026-09-03",
    day: 3,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 스탠드업어셈블",
    startTime: "20:00",
    price: 33000,
  },

  {
    id: "sep-4",
    date: "2026-09-04",
    day: 4,
    category: "etc",
    venueKey: "gangnam",
    title: "강남코미디라운지",
    startTime: "20:00",
    price: 33000,
  },

  {
    id: "sep-5",
    date: "2026-09-05",
    day: 5,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 스탠드업어셈블",
    startTime: "20:30",
    price: 33000,
  },

  {
    id: "sep-6-seoul",
    date: "2026-09-06",
    day: 6,
    category: "seoul",
    venueKey: "seoul",
    title: "서울코미디클럽 올스타즈",
    startTime: "15:00",
    price: 33000,
  },

  {
    id: "sep-6-meta",
    date: "2026-09-06",
    day: 6,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 크라우드워크 어셈블",
    startTime: "19:00",
    price: 33000,
  },

  {
    id: "sep-7",
    date: "2026-09-07",
    day: 7,
    category: "samgak",
    venueKey: "samgak",
    title: "삼각지대 오픈마이크",
    startTime: "20:00",
    price: 5000,
  },

  {
    id: "sep-10",
    date: "2026-09-10",
    day: 10,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 스탠드업어셈블",
    startTime: "20:00",
    price: 33000,
  },

  {
    id: "sep-14",
    date: "2026-09-14",
    day: 14,
    category: "etc",
    venueKey: "namgeukjang",
    title: "스탠드업 코미디 클럽",
    startTime: "19:30",
    price: 27000,
  },

  {
    id: "sep-16",
    date: "2026-09-16",
    day: 16,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 오픈마이크",
    startTime: "20:00",
    price: 5000,
  },

  {
    id: "sep-17",
    date: "2026-09-17",
    day: 17,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 크라우드워크 어셈블",
    startTime: "20:00",
    price: 33000,
  },

  {
    id: "sep-18",
    date: "2026-09-18",
    day: 18,
    category: "etc",
    venueKey: "gangnam",
    title: "강남 코미디 라운지",
    startTime: "20:00",
    price: 33000,
  },

  {
    id: "sep-19-18",
    date: "2026-09-19",
    day: 19,
    category: "seoul",
    venueKey: "seoul",
    title: "서울코미디클럽 올스타즈",
    startTime: "18:00",
    price: 33000,
  },

  {
    id: "sep-19-2130",
    date: "2026-09-19",
    day: 19,
    category: "seoul",
    venueKey: "seoul",
    title: "서울코미디클럽 올스타즈",
    startTime: "21:30",
    price: 33000,
  },

  {
    id: "sep-20",
    date: "2026-09-20",
    day: 20,
    category: "seoul",
    venueKey: "seoul",
    title: "서울코미디클럽 올스타즈",
    startTime: "15:00",
    price: 33000,
  },

  {
    id: "sep-21",
    date: "2026-09-21",
    day: 21,
    category: "samgak",
    venueKey: "samgak",
    title: "삼각지대 오픈마이크",
    startTime: "20:00",
    price: 5000,
  },

  {
    id: "sep-23",
    date: "2026-09-23",
    day: 23,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 오픈마이크",
    startTime: "20:00",
    price: 5000,
  },

  {
    id: "sep-24",
    date: "2026-09-24",
    day: 24,
    category: "seoul",
    venueKey: "seoul",
    title: "서울코미디클럽 올스타즈",
    startTime: "17:00",
    price: 33000,
  },

  {
    id: "sep-26",
    date: "2026-09-26",
    day: 26,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 스탠드업어셈블",
    startTime: "20:30",
    price: 33000,
  },

  {
    id: "sep-27-meta",
    date: "2026-09-27",
    day: 27,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 스탠드업어셈블 SE",
    startTime: "19:00",
    price: 22000,
  },

  {
    id: "sep-27-seoul",
    date: "2026-09-27",
    day: 27,
    category: "seoul",
    venueKey: "seoul",
    title: "서울코미디클럽 올스타즈",
    startTime: "15:00",
    price: 33000,
  },

  {
    id: "sep-28",
    date: "2026-09-28",
    day: 28,
    category: "samgak",
    venueKey: "samgak",
    title: "삼각지대 오픈마이크",
    startTime: "20:00",
    price: 5000,
  },

  {
    id: "sep-30",
    date: "2026-09-30",
    day: 30,
    category: "meta",
    venueKey: "meta",
    title: "메타코미디클럽 오픈마이크",
    startTime: "20:00",
    price: 5000,
  }
];

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


        {/* Profile Image - Slim horizontal layout with 4-side gradient fade */}
        <div className="w-full max-w-xs mb-2 mt-0 px-4">
          <div
            className="w-full h-32 sm:h-40 relative overflow-hidden flex items-center justify-center"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'destination-in'
            }}
          >
            <img
              src={profileImage}
              alt="코미디언 김태현"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/image.png";
              }}
            />
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 dark:text-white">
          김태현
        </h1>

        <p className="mt-1 text-sm font-medium text-neutral-500 dark:text-neutral-400">
          Stand-up Comedian
        </p>

        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3.5 py-1.5 rounded-full">
          <MailIcon className="w-3.5 h-3.5" />
          <a href="mailto:taehyun@metacomedy.net" className="hover:underline">taehyun@metacomedy.net</a>
        </div>

        <div className="flex gap-2.5 mt-4">
          <a
            href="https://www.instagram.com/choo_sen?igsh=MWRsbXQydXFncmI2"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-neutral-700 bg-[#151515] px-4 py-2 shadow-sm active:scale-95 text-neutral-200 text-xs font-semibold"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-500" />
            <span>Instagram</span>
          </a>

          <a
            href="https://www.youtube.com/channel/UC67dXWw4xqqQQDzg5bWyObA?si=kB5Xmp2MeeuVJHIL"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-neutral-700 bg-[#151515] px-4 py-2 shadow-sm active:scale-95 text-neutral-200 text-xs font-semibold"
          >
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            <span>YouTube</span>
          </a>
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
              📍 {(nextShow.venueKey && VENUES[nextShow.venueKey]?.name) || nextShow.customVenue || "온라인"} — <span className="text-neutral-900 dark:text-white font-bold">{nextShow.title}</span>
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


  const [events, setEvents] = useState(INITIAL_EVENTS);

  const [eventsLoaded, setEventsLoaded] = useState(false);

  const [pinnedEventId, setPinnedEventId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('taehyun_pinned_event_id') || null;
    }
    return null;
  });

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




  useEffect(() => {
    const loadEventsFromFirebase = async () => {
      try {
        const snapshot = await getDocs(collection(db, "events"));
        const deletedIds = new Set(
          snapshot.docs
            .filter((docSnap) => docSnap.data().deleted === true)
            .map((docSnap) => docSnap.data().id || docSnap.id)
        );

        const firebaseEventMap = new Map();

        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();

          // 예전 데이터에 저장돼 있던 id가 있으면 그걸 일정의 원래 ID로 사용
          const logicalId = data.id || docSnap.id;

          if (!data.date || deletedIds.has(logicalId)) return;

          const event = {
            ...data,
            id: logicalId,
          };

          const existing = firebaseEventMap.get(logicalId);

          // 같은 일정이 Firebase에 두 개 있다면
          // 문서 ID와 일정 ID가 같은 최신 방식의 문서를 우선 사용
          if (!existing || docSnap.id === logicalId) {
            firebaseEventMap.set(logicalId, event);
          }
        });

        const firebaseEvents = [...firebaseEventMap.values()];

        const merged = INITIAL_EVENTS.filter(
          (event) => !deletedIds.has(event.id)
        );

        firebaseEvents.forEach((firebaseEvent) => {
          const index = merged.findIndex(
            (event) => event.id === firebaseEvent.id
          );

          if (index !== -1) {
            // Firebase에 수정된 일정이 있으면 Firebase 버전 우선
            merged[index] = firebaseEvent;
          } else {
            // 사이트에서 새로 추가한 일정
            merged.push(firebaseEvent);
          }
        });

        setEvents(merged);
      } catch (error) {
        console.error("Firebase 일정 불러오기 오류:", error);

        // Firebase 연결 실패 시에만 localStorage 백업 사용
        const saved = localStorage.getItem("taehyun_events_final_v8");

        if (saved) {
          try {
            setEvents(JSON.parse(saved));
          } catch (e) {
            setEvents(INITIAL_EVENTS);
          }
        } else {
          setEvents(INITIAL_EVENTS);
        }
      } finally {
        setEventsLoaded(true);
      }
    };

    loadEventsFromFirebase();
  }, []);

  useEffect(() => {
    if (!eventsLoaded) return;

    localStorage.setItem(
      "taehyun_events_final_v8",
      JSON.stringify(events)
    );
  }, [events, eventsLoaded]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (pinnedEventId) {
        localStorage.setItem('taehyun_pinned_event_id', pinnedEventId);
      } else {
        localStorage.removeItem('taehyun_pinned_event_id');
      }
    }
  }, [pinnedEventId]);

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
    try {
      await setDoc(
        doc(db, "events", newEvt.id),
        newEvt
      );

      setEvents((prev) => {
        const exists = prev.some((event) => event.id === newEvt.id);

        if (exists) {
          return prev.map((event) =>
            event.id === newEvt.id ? newEvt : event
          );
        }

        return [newEvt, ...prev];
      });

      showToast("새로운 일정이 추가되었습니다! 🎉");
    } catch (error) {
      console.error("Firebase 저장 오류:", error);
      showToast("Firebase 저장에 실패했습니다.");
    }
  };

  const handleUpdateEvent = async (updatedEvt) => {
    try {
      await setDoc(
        doc(db, "events", updatedEvt.id),
        updatedEvt
      );

      setEvents((prev) =>
        prev.map((e) =>
          e.id === updatedEvt.id ? updatedEvt : e
        )
      );

      showToast("일정이 수정되었습니다! ✨");
    } catch (error) {
      console.error("Firebase 수정 오류:", error);
      showToast("Firebase 수정에 실패했습니다.");
    }
  };

  const handleDeleteEvent = async (eventId) => {
  try {
    // 예전 방식으로 중복 생성된 문서가 있으면 먼저 정리
    const q = query(
      collection(db, "events"),
      where("id", "==", eventId)
    );

    const snapshot = await getDocs(q);

    for (const document of snapshot.docs) {
      if (document.id !== eventId) {
        await deleteDoc(document.ref);
      }
    }

    // 삭제된 일정이라는 기록을 events 안에 남김
    await setDoc(
      doc(db, "events", eventId),
      {
        id: eventId,
        deleted: true,
        deletedAt: new Date().toISOString(),
      }
    );

    // 화면에서 제거
    setEvents((prev) =>
      prev.filter((e) => e.id !== eventId)
    );

    // Next Show 고정 일정이었다면 해제
    if (pinnedEventId === eventId) {
      setPinnedEventId(null);
    }

    showToast("일정이 삭제되었습니다.");
  } catch (error) {
    console.error("Firebase 삭제 오류:", error);
    showToast("Firebase 삭제에 실패했습니다.");
  }
};
  useEffect(() => {
    const loadPinnedEvent = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "settings")
        );

        const mainDoc = snapshot.docs.find(
          (item) => item.id === "main"
        );

        if (mainDoc) {
          const data = mainDoc.data();

          if (data.pinnedEventId) {
            setPinnedEventId(data.pinnedEventId);
          }
        }
      } catch (error) {
        console.error("Next Show 불러오기 오류:", error);
      }
    };

    loadPinnedEvent();
  }, []);

  const handleTogglePin = async (eventId) => {
    try {
      const newPinnedId = pinnedEventId === eventId ? null : eventId;

      await setDoc(
        doc(db, "settings", "main"),
        {
          pinnedEventId: newPinnedId,
        },
        { merge: true }
      );

      setPinnedEventId(newPinnedId);

      if (newPinnedId === null) {
        showToast("Next Show 고정이 해제되었습니다.");
      } else {
        showToast("선택한 일정이 Next Show로 고정되었습니다! 📌");
      }
    } catch (error) {
      console.error("Next Show 저장 오류:", error);
      showToast("Next Show 저장에 실패했습니다.");
    }
  };

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
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

        {/* Admin Button placed at the very bottom */}
        <div className="max-w-md mx-auto w-full mt-6 text-center">
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="text-[11px] font-semibold text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 underline underline-offset-4 py-2 transition"
          >
            ⚙️ 관리자 설정
          </button>
        </div>

        <footer className="mt-6 mb-2 text-center text-[10px] text-neutral-400 font-semibold space-y-0.5">
          <p>© 2026 KIM TAE HYUN. All rights reserved.</p>
        </footer>

        <AdminModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          events={sortedEvents}
          onAddEvent={handleAddEvent}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
          pinnedEventId={pinnedEventId}
          onTogglePin={handleTogglePin}
        />
      </div>
    </div>
  );
}
