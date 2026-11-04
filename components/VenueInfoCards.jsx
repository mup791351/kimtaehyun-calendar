import { VENUES } from "../lib/venues";

const Youtube = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z" />
  </svg>
);

export default function VenueInfoCards() {
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
              className="w-14 h-14 object-contain"
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
                className="w-14 h-14 object-contain"
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
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">김태현, 이제규, 문성준의 대한민국 최고의 팟캐스트.</p>
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
