export interface SectionTitles {
  navTitle: string;
  aboutTitle: string;
  bentoTitle: string;
  activitiesTitle: string;
  activitiesSubtitle: string;
  guestbookTitle: string;
}

export interface HeroData {
  mainText: string;
  subText: string;
  bgImage?: string;
}

export interface AboutData {
  title: string;
  description: string;
  imageUrl: string | null;
  skills: string[];
}

export interface BentoGridItem {
  id: number;
  title: string;
  description: string;
  header?: string;
  className?: string;
  img?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl?: string;
}

export interface GuestbookMessage {
  id: string;
  text: string;
  author: string;
  created_at?: string;
}

export interface BackgroundMusicSettings {
  url: string;
  isPlaying: boolean;
}

// ★ 이 부분이 에러의 핵심이었습니다. 확실하게 넣어줍니다.
export interface CertificationItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface InterestItem {
  id: string;
  title: string;
  description: string;
  category: 'TECH' | 'HOBBY';
  icon: string;
  color: string;
}