import { VENUES } from "../lib/venues";

const venues = [
  { key: "seoul", logo: "/icons/seococl.png", label: "서울코미디클럽", title: "서울코미디클럽 올스타즈", description: "서울 종로구 대학로8가길 64 김동진빌딩 지하1층" },
  { key: "meta", logo: "/icons/metacocl.png", label: "메타코미디클럽", title: "메타코미디클럽 홍대", description: "서울 마포구 와우산로 76-1 2층" },
  { key: "samgak", logo: "/icons/samgakjidae.png", label: "삼각지대", title: "삼각지대 오픈마이크 & 쇼케이스", description: "서울 용산구 한강대로48길 17-6 펀타스틱 씨어터" },
  { key: "youtube", logo: "/icons/us.png", label: "미국식농담", title: "매주 목금 유튜브 업로드", description: "김태현, 이제규, 문성준의 대한민국 최고의 팟캐스트.", url: "https://www.youtube.com/@americanjoke0" },
];

const colors = {
  seoul: { label: "text-blue-700 dark:text-blue-400", button: "bg-linear-to-r from-blue-600 to-blue-800" },
  meta: { label: "text-orange-700 dark:text-orange-400", button: "bg-linear-to-r from-orange-600 to-orange-800" },
  samgak: { label: "text-emerald-700 dark:text-emerald-400", button: "bg-linear-to-r from-emerald-600 to-emerald-800" },
  youtube: { label: "text-red-700 dark:text-red-400", button: "bg-linear-to-r from-red-600 to-red-800" },
};

function Instagram() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Youtube() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z" />
    </svg>
  );
}

export default function VenueInfoCards() {
  return (
    <section className="w-full text-[var(--site-text)]">
      <h2 className="mb-5 lg:mb-4 text-2xl font-black tracking-tight">공연장 및 채널 안내</h2>
      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2 lg:gap-5">
        {venues.map((venue) => {
          const isYoutube = venue.key === "youtube";
          const color = colors[venue.key];
          const info = isYoutube ? null : VENUES[venue.key];
          const url = isYoutube ? venue.url : info?.booking;
          return (
            <article key={venue.key} className="flex items-stretch rounded-xl border border-[var(--site-border)] bg-[var(--site-card)] p-3 shadow-sm lg:p-5 lg:rounded-2xl">
              <div className="flex w-[23%] max-w-24 shrink-0 items-center justify-center border-r border-[var(--site-border)] pr-3 lg:w-[26%] lg:max-w-28 lg:pr-5">
                <img
  src={venue.logo}
  alt={venue.label}
  className={`w-full max-h-16 object-contain ${
    venue.key === "meta"
      ? "invert dark:invert-0 lg:scale-125"
      : ""
  }`}
/>
              </div>
              <div className="min-w-0 flex-1 pl-3">
                <p className={`text-[10px] font-bold ${color.label}`}>{venue.label}</p>
                <h3 className="text-sm font-bold leading-snug tracking-tight lg:text-base">{venue.title}</h3>
                <p className="mt-1 text-[11px] leading-snug text-[var(--site-muted)] break-keep lg:text-xs">{venue.description}</p>
                <div className="mt-2 flex items-center gap-1.5 lg:mt-4 lg:justify-end lg:gap-2">
                  {info?.instagram && (
                    <a href={info.instagram} target="_blank" rel="noopener noreferrer" aria-label={`${venue.label} 인스타그램`} className="inline-flex h-9 w-10 lg:h-10 shrink-0 items-center justify-center rounded-lg border border-[var(--site-border)] text-[var(--site-text)] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                      <Instagram />
                    </a>
                  )}
                  {url && (
                    <a href={url} target="_blank" rel="noopener noreferrer" className={`flex min-h-9 min-w-0 flex-1 items-center justify-between gap-1.5 rounded-lg ${color.button} px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:brightness-110 transition lg:flex-none lg:w-36 lg:min-h-10`}>
                      <span className="flex items-center gap-1.5">{isYoutube && <Youtube />}{isYoutube ? "보러가기" : "예매하기"}</span>
                      <span aria-hidden="true">→</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
