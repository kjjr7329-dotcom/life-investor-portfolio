import React, { useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import BentoGrid from './components/BentoGrid';
import Activities from './components/Activities';
import Guestbook from './components/Guestbook';
import Footer from './components/Footer';
import BackgroundMusic from './components/BackgroundMusic'; // 음악 불러오기
import { AdminProvider, useAdmin } from './contexts/AdminContext';

const Content: React.FC = () => {
  const { sectionTitles } = useAdmin();

  useEffect(() => {
    // 탭 제목 설정
    document.title = sectionTitles?.navTitle || "The Life Investor";
  }, [sectionTitles]);

  return (
    <main className="min-h-screen bg-[#1A1A1A] text-[#F3F4F6] selection:bg-[#D9F99D] selection:text-black">
      {/* 1. 상단 네비게이션 & 히어로 섹션 */}
      <Navigation />
      <Hero />
      
      {/* 2. 메인 콘텐츠 섹션들 */}
      <About />
      <BentoGrid />
      <Activities />
      <Guestbook />

      {/* 3. 하단 푸터 & 배경음악 */}
      <Footer />
      <BackgroundMusic /> {/* ★ 여기 있어야 음악 버튼이 보입니다! */}
    </main>
  );
};

export default function App() {
  return (
    <AdminProvider>
      <Content />
    </AdminProvider>
  );
}