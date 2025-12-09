// src/types.ts

// 1. 사이트 제목
export interface SectionTitles {
  navTitle: string;
}

// 2. Hero (메인 화면)
export interface HeroData {
  mainText: string;
  subText: string;
}

// 3. About (소개) - ★ 여기에 skills가 없어서 에러가 났던 겁니다!
export interface AboutData {
  title: string;
  description: string;
  imageUrl: string | null;
  skills?: string[]; // (추가됨) 기술 목록
}

// 4. 활동 내역
export interface Activity {
  id: string;
  title: string;
  date: string;
}
export type ActivityItem = Activity;

// 5. 벤토 그리드
export interface BentoGridItem {
  id: number | string;
  title: string | any;
  description: string | any;
  header?: any;
  icon?: any;
  className?: string;
  img?: string;
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
}

// 6. 기타 (에러 방지용)
export interface GuestbookMessage {
  id: string;
  text: string;
  author: string;
}

export interface BackgroundMusicSettings {
  url: string;
  isPlaying: boolean;
}