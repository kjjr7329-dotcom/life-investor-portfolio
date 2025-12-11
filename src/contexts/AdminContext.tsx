import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { 
  HeroData, AboutData, ActivityItem, 
  BentoGridItem, GuestbookMessage, BackgroundMusicSettings
} from '../types';

// ★ 섹션 제목 타입 확장 (자격증, 관심사, 포트폴리오 제목 추가)
interface SectionTitles {
  navTitle: string;
  aboutTitle: string;
  bentoTitle: string;
  activitiesTitle: string;
  activitiesSubtitle: string;
  guestbookTitle: string;
  certificationsTitle: string; // 추가됨
  interestsTitle: string;      // 추가됨
}

// 독립형 인터페이스
interface CertificationItem { id: string; title: string; description: string; icon: string; color: string; imageUrl?: string; }
interface InterestItem { id: string; title: string; description: string; category: 'TECH' | 'HOBBY'; icon: string; color: string; imageUrl?: string; }

interface AdminContextType {
  sectionTitles: SectionTitles;
  heroData: HeroData;
  aboutData: AboutData;
  bentoItems: BentoGridItem[];
  activities: ActivityItem[];
  guestbookMessages: GuestbookMessage[];
  bgMusic: BackgroundMusicSettings;
  certifications: CertificationItem[];
  interests: InterestItem[];

  updateSectionTitles: (data: SectionTitles) => void;
  updateHeroData: (data: HeroData) => void;
  updateAboutData: (data: AboutData) => void;
  updateBentoItems: (data: BentoGridItem[]) => void;
  updateActivities: (data: ActivityItem[]) => void;
  updateBgMusic: (data: BackgroundMusicSettings) => void;
  updateCertifications: (items: CertificationItem[]) => void;
  updateInterests: (items: InterestItem[]) => void;
  addGuestbookMessage: (msg: Omit<GuestbookMessage, 'id'>) => void;
  deleteGuestbookMessage: (id: string) => void;
  reorderActivities: (items: ActivityItem[]) => void;

  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

// ★ 기본값 설정 (새로운 제목들 추가)
const defaultSectionTitles: SectionTitles = { 
  navTitle: 'The Life Investor',
  aboutTitle: '나의 이야기',
  bentoTitle: '나의 작업물',
  activitiesTitle: '최신 근황',
  activitiesSubtitle: '가끔, 소소한 일상을 전합니다.',
  guestbookTitle: '방명록',
  certificationsTitle: '보유 자격증', // 기본값
  interestsTitle: '관심사 및 취미'    // 기본값
};

const defaultHeroData = { mainText: '시간에 투자하고,\n이야기를 만듭니다.', subText: '차트 너머의 세상.\n퇴직 후, 투자의 눈으로 일상을 다시 기록합니다.', bgImage: '' };
const defaultAboutData = { title: '제이진을 소개합니다', description: '전업 투자자로서 제2의 인생을 항해합니다.', imageUrl: '', skills: ['전업 투자', '유튜브 크리에이터', '콘텐츠 자동화', '동기부여'] };
const defaultBgMusic = { url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3', isPlaying: false };

const defaultCertifications: CertificationItem[] = [
  { id: '1', title: '공인중개사', description: '부동산 자산 권리 분석 및 투자 중개 실무', icon: 'home', color: 'bg-purple-500/20 text-purple-400' },
  { id: '2', title: '정보처리산업기사', description: '데이터 시스템 구조 이해 및 프로세스 최적화', icon: 'database', color: 'bg-blue-500/20 text-blue-400' },
  { id: '3', title: '행정사', description: '행정 기관 인허가 및 서류 작성 대행 전문 자격', icon: 'file', color: 'bg-red-500/20 text-red-400' },
];
const defaultInterests: InterestItem[] = [
  { id: '1', title: 'AI 연구', description: '미래를 이끌어 갈 최신 AI 트렌드 및 LLM 활용', category: 'TECH', icon: 'chip', color: 'bg-indigo-500/20 text-indigo-400' },
  { id: '2', title: '업무 자동화', description: '생산성 향상을 위한 프로세스 최적화', category: 'TECH', icon: 'robot', color: 'bg-cyan-500/20 text-cyan-400' },
  { id: '3', title: '테니스', description: '즐거운 테니스, 건강한 신체', category: 'HOBBY', icon: 'activity', color: 'bg-orange-500/20 text-orange-400' },
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [sectionTitles, setSectionTitles] = useState<SectionTitles>(defaultSectionTitles);
  const [heroData, setHeroData] = useState(defaultHeroData);
  const [aboutData, setAboutData] = useState(defaultAboutData);
  const [bentoItems, setBentoItems] = useState<BentoGridItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [guestbookMessages, setGuestbookMessages] = useState<GuestbookMessage[]>([]);
  const [bgMusic, setBgMusic] = useState(defaultBgMusic);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [interests, setInterests] = useState<InterestItem[]>([]);

  const loadData = async () => {
    try {
      const { data: configData } = await supabase.from('site_config').select('*');
      if (configData && configData.length > 0) {
        configData.forEach(item => {
          if (item.key === 'titles') {
            // 기존 데이터와 합치기 (새로 추가된 키가 없을 경우 대비)
            setSectionTitles({ ...defaultSectionTitles, ...item.data });
          }
          if (item.key === 'hero') setHeroData(item.data);
          if (item.key === 'about') setAboutData(item.data);
          if (item.key === 'music') setBgMusic(item.data);
          if (item.key === 'certifications') setCertifications(item.data);
          if (item.key === 'interests') setInterests(item.data);
        });
      } else {
        await supabase.from('site_config').insert([
          { key: 'titles', data: defaultSectionTitles }, { key: 'hero', data: defaultHeroData },
          { key: 'about', data: defaultAboutData }, { key: 'music', data: defaultBgMusic },
          { key: 'certifications', data: defaultCertifications }, { key: 'interests', data: defaultInterests }
        ]);
        setCertifications(defaultCertifications);
        setInterests(defaultInterests);
      }
      const { data: bento } = await supabase.from('bento_items').select('*').order('created_at', { ascending: true });
      if (bento) setBentoItems(bento);
      const { data: acts } = await supabase.from('activities').select('*').order('sort_order', { ascending: true });
      if (acts) setActivities(acts.map((item: any) => ({ ...item, imageUrl: item.image_url })));
      const { data: msgs } = await supabase.from('guestbook').select('*').order('created_at', { ascending: true });
      if (msgs) setGuestbookMessages(msgs);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { loadData(); }, []);

  const updateSectionTitles = async (data: SectionTitles) => { setSectionTitles(data); await supabase.from('site_config').upsert({ key: 'titles', data }); };
  const updateHeroData = async (data: HeroData) => { setHeroData(data); await supabase.from('site_config').upsert({ key: 'hero', data }); };
  const updateAboutData = async (data: AboutData) => { setAboutData(data); await supabase.from('site_config').upsert({ key: 'about', data }); };
  const updateBgMusic = async (data: BackgroundMusicSettings) => { setBgMusic(data); await supabase.from('site_config').upsert({ key: 'music', data }); };
  const updateCertifications = async (items: CertificationItem[]) => { setCertifications(items); await supabase.from('site_config').upsert({ key: 'certifications', data: items }); };
  const updateInterests = async (items: InterestItem[]) => { setInterests(items); await supabase.from('site_config').upsert({ key: 'interests', data: items }); };
  const updateBentoItems = async (items: BentoGridItem[]) => { setBentoItems(items); for (const item of items) { await supabase.from('bento_items').upsert({ id: item.id, title: item.title, description: item.description, header: item.header, img: item.img, class_name: item.className }); } };
  
  const updateActivities = async (items: ActivityItem[]) => { 
    setActivities(items); 
    for (const item of items) { 
      await supabase.from('activities').upsert({ 
        id: item.id, title: item.title, date: item.date, description: item.description, image_url: item.imageUrl, sort_order: item.sort_order 
      }); 
    } 
  };

  const reorderActivities = async (items: ActivityItem[]) => {
    setActivities(items);
    const updates = items.map((item, index) => ({
      id: item.id, title: item.title, date: item.date, description: item.description, image_url: item.imageUrl, sort_order: index
    }));
    const { error } = await supabase.from('activities').upsert(updates);
    if (error) console.error("순서 저장 실패:", error);
  };

  const addGuestbookMessage = async (msg: Omit<GuestbookMessage, 'id'>) => { const { data } = await supabase.from('guestbook').insert(msg).select(); if (data) setGuestbookMessages(prev => [...prev, ...data]); };
  const deleteGuestbookMessage = async (id: string) => { await supabase.from('guestbook').delete().eq('id', id); setGuestbookMessages(prev => prev.filter(msg => msg.id.toString() !== id.toString())); };
  const login = (password: string) => { if (password === '1234') { setIsAdmin(true); return true; } return false; };
  const logout = () => setIsAdmin(false);

  return (
    <AdminContext.Provider value={{ 
      sectionTitles, updateSectionTitles, heroData, updateHeroData, aboutData, updateAboutData, 
      bentoItems, updateBentoItems, activities, updateActivities, reorderActivities,
      guestbookMessages, addGuestbookMessage, deleteGuestbookMessage, 
      bgMusic, updateBgMusic, certifications, updateCertifications, interests, updateInterests, 
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