import React, { createContext, useContext, useState } from 'react';
import type { 
  SectionTitles, HeroData, AboutData, ActivityItem, 
  BentoGridItem, GuestbookMessage, BackgroundMusicSettings
} from '../types';

interface AdminContextType {
  sectionTitles: SectionTitles;
  heroData: HeroData;
  aboutData: AboutData;
  bentoItems: BentoGridItem[];
  activities: ActivityItem[];
  guestbookMessages: GuestbookMessage[];
  bgMusic: BackgroundMusicSettings;

  updateSectionTitles: (data: SectionTitles) => void;
  updateHeroData: (data: HeroData) => void;
  updateAboutData: (data: AboutData) => void;
  updateBentoItems: (data: BentoGridItem[]) => void;
  updateActivities: (data: ActivityItem[]) => void;
  updateBgMusic: (data: BackgroundMusicSettings) => void;
  addGuestbookMessage: (msg: Omit<GuestbookMessage, 'id'>) => void;
  deleteGuestbookMessage: (id: string) => void;
  
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

// ★ 제목 한글화 및 통일
const defaultSectionTitles = { 
  navTitle: 'The Life Investor',
  aboutTitle: '나의 이야기', // "About Me" -> "나의 이야기"
  bentoTitle: '나의 작업물',
  activitiesTitle: '활동 내역',
  activitiesSubtitle: '가끔, 소소한 일상을 전합니다.',
  guestbookTitle: '방명록'
};

const defaultHeroData = { mainText: '시간에 투자하고,\n이야기를 만듭니다.', subText: '차트 너머의 세상.\n퇴직 후, 투자의 눈으로 일상을 다시 기록합니다.' };
const defaultAboutData = { 
  title: '제이진을 소개합니다', 
  description: '30년 간의 숨 가쁜 직장 생활을 마치고, 이제는 전업 투자자로서 제2의 인생을 항해합니다.\n\n매일 아침 냉철한 이성으로 차트를 분석하며 하루를 시작하지만, 오후에는 카메라를 들고 따뜻한 시선으로 세상의 틈을 기록합니다.', 
  imageUrl: 'https://images.unsplash.com/photo-1555601568-c99da687ffe7?q=80&w=1000&auto=format&fit=crop', 
  skills: ['전업 투자', '유튜브 크리에이터', '콘텐츠 자동화', '동기부여'] 
};
const defaultBentoItems: BentoGridItem[] = [
  { id: 1, title: '유튜브 채널', description: '차트에서 예술로, 제이진의 시선', className: 'md:col-span-2 md:row-span-2', header: '유튜브', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop' },
  { id: 2, title: '투자 인사이트', description: '"투자는 삶을 대하는 태도입니다."', className: 'md:col-span-1', header: '투자 철학' },
  { id: 3, title: '독서 기록', description: '최근 읽은 책: 돈의 심리학', className: 'md:col-span-1', header: '서재' },
  { id: 4, title: '여행 사진', description: '길 위에서 마주친 순간들', className: 'md:col-span-1', header: '여행', img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop' },
];
const defaultActivities: ActivityItem[] = [
  { id: '1', title: 'Life Investor 시작', date: '2025.12', description: '새로운 브랜딩과 함께 포트폴리오 사이트 오픈' },
  { id: '2', title: '정보처리기사 합격', date: '2025.11', description: 'IT 역량 강화 및 끊임없는 자기계발' },
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [sectionTitles, setSectionTitles] = useState(defaultSectionTitles);
  const [heroData, setHeroData] = useState(defaultHeroData);
  const [aboutData, setAboutData] = useState(defaultAboutData);
  const [bentoItems, setBentoItems] = useState<BentoGridItem[]>(defaultBentoItems);
  const [activities, setActivities] = useState<ActivityItem[]>(defaultActivities);
  const [guestbookMessages, setGuestbookMessages] = useState<GuestbookMessage[]>([]);
  const [bgMusic, setBgMusic] = useState({ 
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3', 
    isPlaying: false 
  });

  const login = (password: string) => { if (password === '1234') { setIsAdmin(true); return true; } return false; };
  const logout = () => setIsAdmin(false);
  
  const updateBgMusic = (data: BackgroundMusicSettings) => setBgMusic(data);
  const updateSectionTitles = (data: SectionTitles) => setSectionTitles(data);
  const updateHeroData = (data: HeroData) => setHeroData(data);
  const updateAboutData = (data: AboutData) => setAboutData(data);
  const updateBentoItems = (data: BentoGridItem[]) => setBentoItems(data);
  const updateActivities = (data: ActivityItem[]) => setActivities(data);

  const addGuestbookMessage = (msg: Omit<GuestbookMessage, 'id'>) => {
    const newMessage = { ...msg, id: Date.now().toString() };
    setGuestbookMessages(prev => [...prev, newMessage]);
  };
  const deleteGuestbookMessage = (id: string) => {
    setGuestbookMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const safeAboutData = { ...defaultAboutData, ...aboutData, skills: aboutData?.skills || [] };

  return (
    <AdminContext.Provider value={{ 
        sectionTitles, updateSectionTitles,
        heroData, updateHeroData,
        aboutData: safeAboutData, updateAboutData,
        bentoItems, updateBentoItems,
        activities, updateActivities,
        guestbookMessages, addGuestbookMessage, deleteGuestbookMessage,
        bgMusic, updateBgMusic,
        isAdmin, login, logout
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
}