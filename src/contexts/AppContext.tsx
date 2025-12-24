import React, { createContext, useContext, useState, useEffect } from 'react';
import { CompanyInfo, PortfolioItem, Inquiry, HeroContent, ServiceItem, AboutContent, WhyUsContent, HomeSectionsContent } from '../types';
import { 
  COMPANY_INFO as INITIAL_COMPANY_INFO, 
  PORTFOLIO_ITEMS as INITIAL_PORTFOLIO,
  HERO_CONTENT_DEFAULT,
  SERVICES_DEFAULT,
  ABOUT_CONTENT_DEFAULT,
  WHY_US_DEFAULT,
  HOME_SECTIONS_DEFAULT
} from '../constants';
import { supabase } from '../src/lib/supabaseClient';

interface AppContextType {
  companyInfo: CompanyInfo;
  updateCompanyInfo: (info: CompanyInfo) => void;
  
  heroContent: HeroContent;
  updateHeroContent: (content: HeroContent) => void;

  homeSectionsContent: HomeSectionsContent;
  updateHomeSectionsContent: (content: HomeSectionsContent) => void;

  whyUsContent: WhyUsContent;
  updateWhyUsContent: (content: WhyUsContent) => void;

  aboutContent: AboutContent;
  updateAboutContent: (content: AboutContent) => void;

  services: ServiceItem[];
  addService: (service: ServiceItem) => void;
  updateServices: (services: ServiceItem[]) => void;
  deleteService: (id: string) => void;

  portfolioItems: PortfolioItem[];
  addPortfolioItem: (item: PortfolioItem) => void;
  updatePortfolioItem: (item: PortfolioItem) => void;
  deletePortfolioItem: (id: string) => void;
  
  inquiries: Inquiry[];
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;
  deleteInquiry: (id: string) => void;

  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // State initialization with defaults
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(INITIAL_COMPANY_INFO);
  const [heroContent, setHeroContent] = useState<HeroContent>(HERO_CONTENT_DEFAULT);
  const [homeSectionsContent, setHomeSectionsContent] = useState<HomeSectionsContent>(HOME_SECTIONS_DEFAULT);
  const [whyUsContent, setWhyUsContent] = useState<WhyUsContent>(WHY_US_DEFAULT);
  const [aboutContent, setAboutContent] = useState<AboutContent>(ABOUT_CONTENT_DEFAULT);
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_DEFAULT);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('da_auth') === 'true';
  });

  // Fetch initial data from Supabase & Auto-Seed if empty
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 1. Hero Content Check
        const { data: heroData } = await supabase.from('hero_content').select('*').single();
        
        // AUTO-SEEDING LOGIC:
        const needsSeeding = !heroData || heroData.headline === '기본 헤드라인';

        if (needsSeeding) {
          console.log("Database appears empty or default. Auto-seeding with rich content...");
          
          await supabase.from('hero_content').upsert({ id: 1, ...HERO_CONTENT_DEFAULT });
          setHeroContent(HERO_CONTENT_DEFAULT);
          
          await supabase.from('home_sections').upsert({ id: 1, ...HOME_SECTIONS_DEFAULT });
          setHomeSectionsContent(HOME_SECTIONS_DEFAULT);
          
          await supabase.from('why_us').upsert({ id: 1, ...WHY_US_DEFAULT });
          setWhyUsContent(WHY_US_DEFAULT);

          await supabase.from('company_info').upsert({ id: 1, ...INITIAL_COMPANY_INFO });
          setCompanyInfo(INITIAL_COMPANY_INFO);

          try {
            await supabase.from('about_content').upsert({ id: 1, ...ABOUT_CONTENT_DEFAULT });
            setAboutContent(ABOUT_CONTENT_DEFAULT);
          } catch (e) { console.warn("About table might be missing", e); }

          for (const s of SERVICES_DEFAULT) {
            await supabase.from('services').upsert(s);
          }
          setServices(SERVICES_DEFAULT);

          for (const p of INITIAL_PORTFOLIO) {
            await supabase.from('portfolio').upsert(p);
          }
          setPortfolioItems(INITIAL_PORTFOLIO);

        } else {
          // Normal Fetch
          setHeroContent(heroData);

          const { data: homeSectionsData } = await supabase.from('home_sections').select('*').single();
          if (homeSectionsData) setHomeSectionsContent(homeSectionsData);

          const { data: whyUsData } = await supabase.from('why_us').select('*').single();
          if (whyUsData) setWhyUsContent(whyUsData);

          const { data: companyData } = await supabase.from('company_info').select('*').single();
          if (companyData) setCompanyInfo(companyData);

          const { data: aboutData } = await supabase.from('about_content').select('*').single();
          if (aboutData) setAboutContent(aboutData);

          const { data: servicesData } = await supabase.from('services').select('*').order('id');
          if (servicesData && servicesData.length > 0) setServices(servicesData);

          const { data: portfolioData } = await supabase.from('portfolio').select('*');
          if (portfolioData) setPortfolioItems(portfolioData);
        }

        const { data: inquiryData } = await supabase.from('inquiries').select('*').order('date', { ascending: false });
        if (inquiryData) setInquiries(inquiryData as Inquiry[]);

      } catch (error) {
        console.error('Error fetching data from Supabase:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Authentication persistence
  useEffect(() => {
    localStorage.setItem('da_auth', String(isAuthenticated));
  }, [isAuthenticated]);


  // --- Action Handlers (Update DB & State) ---

  const updateCompanyInfo = async (info: CompanyInfo) => {
    setCompanyInfo(info);
    await supabase.from('company_info').upsert({ id: 1, ...info });
  };

  const updateHeroContent = async (content: HeroContent) => {
    setHeroContent(content);
    await supabase.from('hero_content').upsert({ id: 1, ...content });
  };

  const updateHomeSectionsContent = async (content: HomeSectionsContent) => {
    setHomeSectionsContent(content);
    await supabase.from('home_sections').upsert({ id: 1, ...content });
  };

  const updateWhyUsContent = async (content: WhyUsContent) => {
    setWhyUsContent(content);
    await supabase.from('why_us').upsert({ id: 1, ...content });
  };

  const updateAboutContent = async (content: AboutContent) => {
    setAboutContent(content);
    await supabase.from('about_content').upsert({ id: 1, ...content });
  };

  const addService = async (service: ServiceItem) => {
    setServices(prev => [...prev, service]);
    await supabase.from('services').upsert(service);
  };

  const updateServices = async (newServices: ServiceItem[]) => {
    setServices(newServices);
    for (const service of newServices) {
      await supabase.from('services').upsert(service);
    }
  };

  const deleteService = async (id: string) => {
    setServices(prev => prev.filter(item => item.id !== id));
    await supabase.from('services').delete().eq('id', id);
  };

  const addPortfolioItem = async (item: PortfolioItem) => {
    setPortfolioItems(prev => [item, ...prev]);
    await supabase.from('portfolio').insert(item);
  };

  const updatePortfolioItem = async (updatedItem: PortfolioItem) => {
    setPortfolioItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    await supabase.from('portfolio').update(updatedItem).eq('id', updatedItem.id);
  };

  const deletePortfolioItem = async (id: string) => {
    setPortfolioItems(prev => prev.filter(item => item.id !== id));
    await supabase.from('portfolio').delete().eq('id', id);
  };

  const addInquiry = async (data: Omit<Inquiry, 'id' | 'date' | 'status'>) => {
    const newInquiry: Inquiry = {
      ...data,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'new'
    };
    setInquiries(prev => [newInquiry, ...prev]);
    await supabase.from('inquiries').insert(newInquiry);
  };

  const updateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    setInquiries(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    await supabase.from('inquiries').update({ status }).eq('id', id);
  };

  const deleteInquiry = async (id: string) => {
    setInquiries(prev => prev.filter(item => item.id !== id));
    await supabase.from('inquiries').delete().eq('id', id);
  };

  const login = (password: string) => {
    if (password === 'admin1234') { 
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AppContext.Provider value={{
      companyInfo, updateCompanyInfo,
      heroContent, updateHeroContent,
      homeSectionsContent, updateHomeSectionsContent,
      whyUsContent, updateWhyUsContent,
      aboutContent, updateAboutContent,
      services, addService, updateServices, deleteService,
      portfolioItems, addPortfolioItem, updatePortfolioItem, deletePortfolioItem,
      inquiries, addInquiry, updateInquiryStatus, deleteInquiry,
      isAuthenticated, login, logout, isLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};