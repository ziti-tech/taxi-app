import { siteConfig } from "@/config/site";

export function HeroMotionBackground() {
  return (
    <div className="hero-motion pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 size-full" viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#061d33" />
            <stop offset="1" stopColor="#041426" />
          </linearGradient>
          <linearGradient id="hero-road" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#071a2d" />
            <stop offset=".5" stopColor="#0b2942" />
            <stop offset="1" stopColor="#071a2d" />
          </linearGradient>
          <filter id="route-glow" x="-30%" y="-80%" width="160%" height="260%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width="1440" height="760" fill="url(#hero-sky)" />
        <g className="hero-grid" stroke="#8aa2b7" strokeOpacity=".075" strokeWidth="1">
          {Array.from({ length: 19 }, (_, index) => <path key={`v-${index}`} d={`M${index * 80} 0V760`} />)}
          {Array.from({ length: 11 }, (_, index) => <path key={`h-${index}`} d={`M0 ${index * 76}H1440`} />)}
        </g>

        <g fill="#0b2942" opacity=".55">
          <path d="M0 470V390h82v36h54V337h90v133h62V378h78v92h74V321h102v149h74V354h74v116h82V401h92v69h70V368h83v102h79V343h96v127h40v290H0Z" />
          <path opacity=".5" d="M0 510V450h122v60h66V414h112v96h83v-54h91v54h126v-78h84v78h96v-46h108v46h112v-72h126v72h98V420h110v90h106v250H0Z" />
        </g>

        <path d="M-80 654C270 548 486 690 746 610c233-72 389-59 790 54v170H-80Z" fill="url(#hero-road)" />
        <g className="hero-road-lines" fill="none" stroke="#d8e1e8" strokeDasharray="42 48" strokeOpacity=".18" strokeWidth="3">
          <path d="M-120 715C254 601 490 741 769 658c246-73 425-43 800 57" />
        </g>

        <path className="hero-route-glow" d="M-90 652C195 553 403 668 647 625c222-39 380-90 613-12" fill="none" stroke="#fbbf24" strokeLinecap="round" strokeWidth="5" filter="url(#route-glow)" />

        <g className="hero-pin hero-pin-one" transform="translate(312 612)">
          <path d="M0-19c-11 0-19 8-19 19 0 14 19 33 19 33S19 14 19 0C19-11 11-19 0-19Z" fill="#fbbf24" />
          <circle cy="0" r="6" fill="#061d33" />
        </g>
        <g className="hero-pin hero-pin-two" transform="translate(742 602)">
          <path d="M0-17c-10 0-17 7-17 17 0 12 17 29 17 29S17 12 17 0C17-10 10-17 0-17Z" fill="#fbbf24" />
          <circle cy="0" r="5" fill="#061d33" />
        </g>

        <g className="hero-taxi">
          <ellipse cx="0" cy="28" rx="95" ry="13" fill="#020b14" opacity=".42" />
          <path d="M-101 4c3-18 13-31 31-37l27-38c8-11 18-17 31-17h49c14 0 25 6 33 18l25 38c15 5 25 16 29 32l2 22H-104Z" fill="#fbbf24" />
          <path d="m-35-70-24 37h62v-37Zm47 0v37h67L56-68c-2-2-5-2-9-2Z" fill="#173b55" />
          <path d="M-20-102h48c5 0 9 4 9 9v7h-66v-7c0-5 4-9 9-9Z" fill="#f5a800" />
          <path d="M-83-4h33M71-4h38" stroke="#fff1a8" strokeLinecap="round" strokeWidth="8" />
          <path d="M-103 18h228" stroke="#d88f00" strokeWidth="5" />
          <g transform="translate(-65 23)"><g className="hero-wheel"><circle r="23" fill="#020b14" /><circle r="11" fill="#718296" /><path d="M0-9V9M-9 0H9" stroke="#dce4e9" strokeWidth="3" /></g></g>
          <g transform="translate(82 23)"><g className="hero-wheel"><circle r="23" fill="#020b14" /><circle r="11" fill="#718296" /><path d="M0-9V9M-9 0H9" stroke="#dce4e9" strokeWidth="3" /></g></g>
        </g>
      </svg>
      <div className="hero-video-scene absolute inset-0 hidden overflow-hidden xl:block">
        <video className="hero-device-video absolute left-1/2 top-[9rem] h-auto w-[48rem] max-w-none -translate-x-1/2 opacity-100 md:top-[7rem] md:w-[72rem] xl:inset-0 xl:size-full xl:translate-x-0 xl:object-cover xl:object-center xl:opacity-70" autoPlay muted loop playsInline preload="auto" tabIndex={-1}>
          <source src="/media/taxi-hero/taxi-hero.mp4" type="video/mp4" media="(min-width: 1280px)" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#061d33_0%,#061d33_24%,rgba(6,29,51,.04)_47%,rgba(6,29,51,.18)_82%,rgba(6,29,51,.56)_100%)] md:bg-[linear-gradient(180deg,#061d33_0%,#061d33_20%,rgba(6,29,51,.04)_45%,rgba(6,29,51,.30)_100%)] xl:bg-[linear-gradient(90deg,#061d33_0%,rgba(6,29,51,.98)_30%,rgba(6,29,51,.58)_58%,rgba(6,29,51,.24)_100%),linear-gradient(180deg,#061d33_0%,rgba(6,29,51,.82)_24%,transparent_58%,rgba(6,29,51,.28)_100%)]" />
        <span className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-navy-950/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.12em] text-amber-500 shadow-lg">{siteConfig.shortName}</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/35 via-transparent to-navy-950/25 xl:bg-gradient-to-r xl:from-navy-950 xl:via-navy-950/35 xl:to-navy-950/10" />
    </div>
  );
}

export function HeroTopVideo() {
  return <div className="hero-top-video relative mb-7 aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-navy-900 shadow-[0_14px_38px_rgba(0,8,18,.24)] xl:hidden" aria-hidden="true">
    <video className="absolute inset-0 size-full object-contain" autoPlay muted loop playsInline preload="auto" tabIndex={-1}>
      <source src="/media/taxi-hero/taxi-hero.mp4" type="video/mp4" media="(max-width: 1279px)" />
    </video>
    <div className="absolute inset-0 bg-gradient-to-b from-navy-950/25 via-transparent to-navy-950/20" />
    <span className="absolute bottom-2.5 right-2.5 rounded-full border border-white/10 bg-navy-950/95 px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[.1em] text-amber-500 shadow-lg sm:bottom-3 sm:right-3 sm:px-3 sm:text-[10px]">{siteConfig.shortName}</span>
  </div>;
}
