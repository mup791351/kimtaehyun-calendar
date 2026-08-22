"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

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
);const SunIcon = ({ className = "w-4 h-4" }) => (
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

const VENUES = {
  seoul: {
    name: "서울코미디클럽",
    address: "서울 종로구 대학로8가길 64 김동진빌딩 지하1층",
    instagram: "https://www.instagram.com/seoul_comedy_club?igsh=cWZveXQ0aG81anp4",
    booking: "https://booking.naver.com/booking/12/bizes/627353/items/4217612?fbclid=PAdGRleATyt0pwZG9mAmZkaWQWUMwb1rO4dGWtGIea1jx85sDCaR3SSWV4dG4DYWVtAjExAHNydGMGYXBwX2lkDzEyNDAyNDU3NDI4NzQxNAABpxDRVrVcbauqZdhg6cWmCGCBm1NVPzlaOZf26bsjTblr0gztxWKW-LnQMMz0_aem_mGBCEGWFCh1lQPax-xj5Ng&startDateTime=2026-08-20T00%3A00%3A00%2B09%3A00&utm_content=link_in_bio&utm_medium=social&utm_source=ig"
  },
  meta: {
    name: "메타코미디클럽 홍대",
    address: "서울 마포구 와우산로 76-1 2층",
    instagram: "https://www.instagram.com/metacomedyclub.hongdae?igsh=aGRiYnV3MzM1cWFx",
    booking: "https://booking.naver.com/booking/12/bizes/1037135?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAdGRleATytoVwZG9mAmZkaWQWUMynm2LHxJgXoFL8TmePJZx_WEBOmGV4dG4DYWVtAjExAHNydGMGYXBwX2lkDzEyNDAyNDU3NDI4NzQxNAABp3XnY9qsenRavhFeY9BTzyuvSwqnAQfHG3xz6Q_vTw0uA-spsUUB8unFo2fm_aem_9NyteJgKrnxk15suUhFAMw"
  },
  samgak: {
    name: "삼각지대",
    address: "서울 용산구 한강대로48길 17-6 펀타스틱 씨어터",
    instagram: "https://www.instagram.com/comedy_samgakjidae?igsh=MXdnbDE2dG1mcG11dQ==",
    booking: "https://docs.google.com/forms/d/e/1FAIpQLSfGHLErwl5c7N2qSkrenXqVm0OV1HXRKuhZ3wb1xxOSO06Osw/viewform"
  }
};

const CATEGORY_COLORS = {
  solo: {
    label: "단독쇼",
    color: "bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-neutral-950 font-black animate-pulse shadow-lg shadow-amber-400/50 border border-yellow-200",
    icon: "/icons/taehyun.png",
  },

  seoul: {
    label: "서울코미디클럽",
    color: "bg-blue-600",
    icon: "/icons/seococl.png",
  },

  meta: {
    label: "메타코미디클럽",
    color: "bg-orange-500",
    icon: "/icons/metacocl.png",
  },

  samgak: {
    label: "삼각지대",
    color: "bg-emerald-600",
    icon: "/icons/samgakjidae.png",
  },

  etc: {
    label: "기타",
    color: "bg-purple-600",
    icon: "🎸",
  },
};

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
    booking: "https://docs.google.com/forms/d/e/1FAIpQLSfGHLErwl5c7N2qSkrenXqVm0OV1HXRKuhZ3wb1xxOSO06Osw/viewform",
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
    booking: "https://docs.google.com/forms/d/e/1FAIpQLSfGHLErwl5c7N2qSkrenXqVm0OV1HXRKuhZ3wb1xxOSO06Osw/viewform",
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
              📍 {(nextShow.venueKey && VENUES[nextShow.venueKey]?.name) || "온라인"} — <span className="text-neutral-900 dark:text-white font-bold">{nextShow.title}</span>
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
                🎟 예매
              </a>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function VenueInfoCards() {
  return (
    <div className="space-y-3 my-5">
      <h3 className="text-base font-black text-neutral-900 dark:text-white flex items-center gap-1.5 px-0.5">
        <span>📍</span> 공연장 및 채널 안내
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 서울코미디클럽 */}
        <div className="p-4 rounded-2xl bg-[#111111] border border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center gap-3">
  <img
    src="/icons/seococl.png"
    alt="서울코미디클럽"
    className="w-10 h-10 object-contain"
  />
  <div>
    <span className="text-[10px] font-bold text-blue-400">
      서울코미디클럽
    </span>
    <h4 className="font-black text-sm text-white">
      서울코미디클럽 올스타즈
    </h4>
  </div>
</div>
        
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">주소: 서울 종로구 대학로8가길 64 김동진빌딩 지하1층</p>
          <div className="flex gap-2 pt-1">
            <a 
              href={VENUES.seoul.instagram} 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 py-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white rounded-xl text-xs font-bold text-center transition"
            >
              인스타 보기
            </a>
            <a 
              href={VENUES.seoul.booking} 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold text-center transition"
            >
              예매하기
            </a>
          </div>
        </div>

        {/* 메타코미디클럽 홍대 */}
        <div className="p-4 rounded-2xl bg-[#111111] border border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center gap-3">
  <img
    src="/icons/metacocl.png"
    alt="메타코미디클럽"
    className="w-10 h-10 object-contain"
  />
  <div>
    <span className="text-[10px] font-bold text-orange-400">
      메타코미디클럽
    </span>
    <h4 className="font-black text-sm text-white">
      메타코미디클럽 홍대
    </h4>
  </div>
</div>
          
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">주소: 서울 마포구 와우산로 76-1 2층</p>
          <div className="flex gap-2 pt-1">
            <a 
              href={VENUES.meta.instagram} 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 py-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white rounded-xl text-xs font-bold text-center transition"
            >
              인스타 보기
            </a>
            <a 
              href={VENUES.meta.booking} 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold text-center transition"
            >
              예매하기
            </a>
          </div>
        </div>

        {/* 삼각지대 */}
        <div className="p-4 rounded-2xl bg-[#111111] border border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center gap-3">
  <img
    src="/icons/samgakjidae.png"
    alt="삼각지대"
    className="w-10 h-10 object-contain"
  />
  <div>
    <span className="text-[10px] font-bold text-emerald-400">
      삼각지대
    </span>
    <h4 className="font-black text-sm text-white">
      삼각지대 오픈마이크 & 쇼케이스
    </h4>
  </div>
</div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">주소: 서울 용산구 한강대로48길 17-6 펀타스틱 씨어터</p>
          <div className="flex gap-2 pt-1">
            <a 
              href={VENUES.samgak.instagram} 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 py-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white rounded-xl text-xs font-bold text-center transition"
            >
              인스타 보기
            </a>
            <a 
              href={VENUES.samgak.booking} 
              target="_blank" 
              rel="noreferrer"
              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold text-center transition"
            >
              예매하기
            </a>
          </div>
        </div>

        {/* 미국식 농담 */}
        <div className="p-4 rounded-2xl bg-[#111111] border border-neutral-800 shadow-sm space-y-2">
          <div className="flex items-center gap-3">
  <div className="w-10 h-10 flex items-center justify-center">
  <img
    src="/icons/us.png"
    alt="미국 국기"
    className="w-8 h-8 object-contain"
  />
</div>
  <div>
    <span className="text-[10px] font-bold text-red-400">
      미국식농담
    </span>
    <h4 className="font-black text-sm text-white">
      매주 목금 유튜브 업로드
    </h4>
  </div>
</div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">출연: 김태현, 이제규, 문성준 등 최고의 만담 콘텐츠.</p>
          <div className="pt-1">
            <a 
              href="https://www.youtube.com/@americanjoke0" 
              target="_blank" 
              rel="noreferrer"
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Youtube className="w-4 h-4 text-white" /> 보러가기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({ catKey, cat, isActive, onClick }) {
  return (
    <button
      onClick={() => onClick(catKey)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
        isActive
          ? `${cat.color} ${catKey === 'solo' ? 'text-neutral-950 ring-4 ring-amber-300' : 'text-white'} shadow-sm ring-2 ring-offset-1 ring-neutral-300 dark:ring-neutral-600 scale-105`
          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 active:bg-neutral-200 dark:active:bg-neutral-700"
      }`}
    >
      {catKey === "etc" ? (
  <span className="text-sm leading-none">🎸</span>
) : (
  <img
  src={cat.icon}
  alt=""
  className={`w-5 h-5 object-contain ${
    catKey === "solo"
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
                    {venueInfo && <p className="flex items-center gap-1">📍 {venueInfo.name}</p>}
                    {evt.lineup && evt.lineup.length > 0 && <p className="flex items-center gap-1">👤 {evt.lineup.join(" · ")}</p>}
                    {evt.price > 0 && <p className="font-bold text-neutral-900 dark:text-white pt-0.5">💰 ₩ {evt.price.toLocaleString()}</p>}
                  </div>

                  <div className="flex gap-1.5 pt-1.5 border-t border-neutral-200 dark:border-neutral-700/60">
                    {evt.booking && (
                      <a
                        href={evt.booking}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 bg-neutral-950 dark:bg-white dark:text-neutral-900 text-white rounded-xl text-[11px] font-bold text-center block"
                      >
                        🎟 예매하기
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

function Calendar({ events, activeCategory, onCategoryChange, currentDate, setCurrentDate }) {
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
            className="w-7 h-7 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-300 font-black text-sm active:bg-neutral-800"
          >
            ‹
          </button>
          <div className="text-center">
            <h2 className="text-base sm:text-xl font-black text-neutral-900 dark:text-white">{year}년 {month + 1}월</h2>
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
            <div key={day} className={`font-extrabold text-[11px] py-1 ${index === 5 ? "text-blue-500" : index === 6 ? "text-red-500" : "text-neutral-400"}`}>
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
            const hasEvents = dayEvents.length > 0;
            const isToday = currentYear === year && currentMonth === month && currentDay === day;
            const isPast = new Date(year, month, day) < new Date(currentYear, currentMonth, currentDay);

            return (
              <div key={day} className="relative">
                <button
                  onClick={() => handleDayClick(day)}
                  className={`w-full h-16 sm:h-20 rounded-xl p-1 flex flex-col justify-between transition-all text-left border overflow-hidden ${
                    hasEvents
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
  {dayEvents.map((evt, index) => {
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
        className="w-5 h-5 flex-shrink-0"
      >
        {icon.startsWith("/") ? (
          <img
            src={icon}
            alt=""
            className={`w-full h-full object-contain ${
  evt.category === "solo"
    ? "animate-pulse drop-shadow-[0_0_5px_rgba(250,204,21,0.9)]"
    : ""
}`}
          />
        ) : (
          <span className="text-base leading-none">{icon}</span>
        
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
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center">
            <button
              onClick={() => onCategoryChange("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                activeCategory === "all"
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

function AdminModal({ isOpen, onClose, events, onDeleteEvent, onAddEvent, onUpdateEvent, pinnedEventId, onTogglePin }) {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [date, setDate] = useState("2026-08-01");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("seoul");
  const [venueKey, setVenueKey] = useState("seoul");
  const [startTime, setStartTime] = useState("20:00");
  const [lineup, setLineup] = useState("김태현");
  const [price, setPrice] = useState(33000);
  const [booking, setBooking] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "0103") {
      setIsAdminLoggedIn(true);
      setErrorMsg("");
    } else {
      setErrorMsg("비밀번호가 올바르지 않습니다.");
    }
  };

  const handleStartEdit = (evt) => {
    setEditingId(evt.id);
    setDate(evt.date);
    setTitle(evt.title);
    setCategory(evt.category || "seoul");
    setVenueKey(evt.venueKey || "seoul");
    setStartTime(evt.startTime || "20:00");
    setLineup(evt.lineup ? evt.lineup.join(", ") : "");
    setPrice(evt.price || 0);
    setBooking(evt.booking || "");
    setDescription(evt.description || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDate("2026-08-01");
    setTitle("");
    setCategory("seoul");
    setVenueKey("seoul");
    setStartTime("20:00");
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
      venueKey: venueKey === "none" ? null : venueKey,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-neutral-100 dark:border-neutral-800 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
        >
          <XMark className="w-4 h-4" />
        </button>

        {!isAdminLoggedIn ? (
          <div>
            <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-1">관리자 로그인</h3>
            <p className="text-xs text-neutral-400 mb-4">관리자 비밀번호를 입력해주세요.</p>
            <form onSubmit={handleLogin} className="space-y-3">
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
            <div>
              <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-1">
                {editingId ? "일정 수정하기" : "새 일정 추가"}
              </h3>
              <p className="text-xs text-neutral-400 mb-4">
                {editingId ? "선택한 일정을 수정합니다." : "새로운 공연 또는 업로드 일정을 등록합니다."}
              </p>

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
                      <option value="none">온라인 / 기타</option>
                    </select>
                  </div>
                </div>

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
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {events.map((evt) => {
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
                        <span className="font-bold">{evt.date}</span> — <span className="text-neutral-600 dark:text-neutral-300">{evt.title}</span>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => handleStartEdit(evt)}
                          className="px-2 py-1 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg font-bold hover:opacity-80"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => onDeleteEvent(evt.id)}
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
  const [currentDate, setCurrentDate] = useState({ year: 2026, month: 7 });
  const [toastMessage, setToastMessage] = useState(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  useEffect(() => {
  const saved = localStorage.getItem('taehyun_events_final_v8');

  if (saved) {
    setEvents(JSON.parse(saved));
  }
}, []);

useEffect(() => {
  const saved = localStorage.getItem("taehyun_events_final_v8");

  if (saved) {
    setEvents(JSON.parse(saved));
  }

  setEventsLoaded(true);
}, []);

useEffect(() => {
  const loadEventsFromFirebase = async () => {
    try {
      const snapshot = await getDocs(collection(db, "events"));

      const firebaseEvents = snapshot.docs
  .map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  .filter((event) => event.date);

     if (firebaseEvents.length > 0) {
  setEvents(firebaseEvents);
}
    } catch (error) {
      console.error("Firebase 일정 불러오기 오류:", error);
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
    const docRef = await addDoc(collection(db, "events"), newEvt);

    const savedEvent = {
      ...newEvt,
      id: docRef.id,
    };

    setEvents((prev) => [savedEvent, ...prev]);

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
    // 1. eventId와 같은 문서 ID가 있으면 삭제
    const directRef = doc(db, "events", eventId);

    try {
      await deleteDoc(directRef);
    } catch (error) {
      console.log("직접 삭제 실패, id 필드로 검색합니다.");
    }

    // 2. 문서 ID가 다른 기존 일정이면
    // 문서 안의 id 필드로 찾아서 삭제
    const q = query(
      collection(db, "events"),
      where("id", "==", eventId)
    );

    const snapshot = await getDocs(q);

    for (const document of snapshot.docs) {
      await deleteDoc(document.ref);
    }

    // 3. 화면에서도 삭제
    setEvents((prev) => prev.filter((e) => e.id !== eventId));

    // 4. 고정 일정이었다면 고정 해제
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