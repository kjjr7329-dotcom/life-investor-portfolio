import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
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

const defaultSectionTitles = { 
  navTitle: 'The Life Investor',
  aboutTitle: '나의 이야기',
  bentoTitle: '나의 작업물',
  activitiesTitle: '활동 내역',
  activitiesSubtitle: '가끔, 소소한 일상을 전합니다.',
  guestbookTitle: '방명록'
};
const defaultHeroData = { mainText: '시간에 투자하고,\n이야기를 만듭니다.', subText: '차트 너머의 세상.\n퇴직 후, 투자의 눈으로 일상을 다시 기록합니다.', bgImage: '' };
const defaultAboutData = { 
  title: '제이진을 소개합니다', 
  description: '30년 간의 숨 가쁜 직장 생활을 마치고, 이제는 전업 투자자로서 제2의 인생을 항해합니다.\n\n매일 아침 냉철한 이성으로 차트를 분석하며 하루를 시작하지만, 오후에는 카메라를 들고 따뜻한 시선으로 세상의 틈을 기록합니다.', 
  imageUrl: 'https://images.unsplash.com/photo-1555601568-c99da687ffe7?q=80&w=1000&auto=format&fit=crop', 
  skills: ['전업 투자', '유튜브 크리에이터', '콘텐츠 자동화', '동기부여'] 
};
const defaultBgMusic = { url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3', isPlaying: false };

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [sectionTitles, setSectionTitles] = useState(defaultSectionTitles);
  const [heroData, setHeroData] = useState(defaultHeroData);
  const [aboutData, setAboutData] = useState(defaultAboutData);
  const [bentoItems, setBentoItems] = useState<BentoGridItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [guestbookMessages, setGuestbookMessages] = useState<GuestbookMessage[]>([]);
  const [bgMusic, setBgMusic] = useState(defaultBgMusic);

  const loadData = async () => {
    try {
      const { data: configData } = await supabase.from('site_config').select('*');
      
      if (configData && configData.length > 0) {
        configData.forEach(item => {
          if (item.key === 'titles') setSectionTitles(item.data);
          if (item.key === 'hero') setHeroData(item.data);
          if (item.key === 'about') setAboutData(item.data);
          if (item.key === 'music') setBgMusic(item.data);
        });
      } else {
        await supabase.from('site_config').insert([
          { key: 'titles', data: defaultSectionTitles },
          { key: 'hero', data: defaultHeroData },
          { key: 'about', data: defaultAboutData },
          { key: 'music', data: defaultBgMusic }
        ]);
      }

      const { data: bento } = await supabase.from('bento_items').select('*').order('created_at', { ascending: true });
      if (bento) setBentoItems(bento);

      // ★ [핵심 수정 부분] 활동 내역 불러올 때 이름표 바꿔주기 (image_url -> imageUrl)
      const { data: acts } = await supabase.from('activities').select('*').order('date', { ascending: false });
      if (acts) {
        const mappedActivities = acts.map((item: any) => ({
          ...item,
          imageUrl: item.image_url // DB의 image_url을 앱이 쓰는 imageUrl로 연결!
        }));
        setActivities(mappedActivities);
      }

      const { data: msgs } = await supabase.from('guestbook').select('*').order('created_at', { ascending: true });
      if (msgs) setGuestbookMessages(msgs);

    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateSectionTitles = async (data: SectionTitles) => {
    setSectionTitles(data);
    await supabase.from('site_config').upsert({ key: 'titles', data });
  };
  const updateHeroData = async (data: HeroData) => {
    setHeroData(data);
    await supabase.from('site_config').upsert({ key: 'hero', data });
  };
  const updateAboutData = async (data: AboutData) => {
    setAboutData(data);
    await supabase.from('site_config').upsert({ key: 'about', data });
  };
  const updateBgMusic = async (data: BackgroundMusicSettings) => {
    setBgMusic(data);
    await supabase.from('site_config').upsert({ key: 'music', data });
  };

  const updateBentoItems = async (items: BentoGridItem[]) => {
    setBentoItems(items);
    for (const item of items) {
        await supabase.from('bento_items').upsert({
            id: item.id,
            title: item.title, description: item.description,
            header: item.header, img: item.img, class_name: item.className
        });
    }
  };

  // ★ 저장할 때도 확실하게 image_url로 보내기
  const updateActivities = async (items: ActivityItem[]) => {
    setActivities(items);
    for (const item of items) {
        await supabase.from('activities').upsert({
            id: item.id,
            title: item.title, date: item.date,
            description: item.description, 
            image_url: item.imageUrl // 앱의 imageUrl을 DB의 image_url로 변환
        });
    }
  };

  const addGuestbookMessage = async (msg: Omit<GuestbookMessage, 'id'>) => {
    const { data } = await supabase.from('guestbook').insert(msg).select();
    if (data) {
      setGuestbookMessages(prev => [...prev, ...data]);
    }
  };

  const deleteGuestbookMessage = async (id: string) => {
    await supabase.from('guestbook').delete().eq('id', id);
    setGuestbookMessages(prev => prev.filter(msg => msg.id.toString() !== id.toString()));
  };

  const login = (password: string) => { if (password === '1234') { setIsAdmin(true); return true; } return false; };
  const logout = () => setIsAdmin(false);

  return (
    <AdminContext.Provider value={{ 
        sectionTitles, updateSectionTitles,
        heroData, updateHeroData,
        aboutData, updateAboutData,
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