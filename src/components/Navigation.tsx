import React, { useState, useEffect } from 'react';
import { Menu, X, Lock, LogOut } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import LoginModal from './LoginModal';

const Navigation: React.FC = () => {
  const { sectionTitles, isAdmin, logout } = useAdmin();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ★ 메뉴명 변경 완료 ("나의 여정")
  const navItems = [
    { id: 'about', label: '소개' },
    { id: 'portfolio', label: '나의 여정' },
    { id: 'certs', label: '자격증' },
    { id: 'interests', label: '취미' },
    { id: 'activities', label: '활동' },
    { id: 'guestbook', label: '방명록' },
  ];

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const handleAdminClick = () => {
    if (isAdmin) {
      if (window.confirm('로그아웃 하시겠습니까?')) logout();
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#1A1A1A]/90 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div onClick={scrollToTop} className="text-2xl font-bold text-white tracking-tighter cursor-pointer hover:opacity-80 transition-opacity">
            {sectionTitles.navTitle}
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => scrollToSection(item.id)} className="text-sm font-medium text-gray-400 hover:text-[#D9F99D] transition-colors tracking-widest">
                {item.label}
              </button>
            ))}
            <button onClick={handleAdminClick} className={`p-2 rounded-full transition-colors ${isAdmin ? 'bg-[#D9F99D] text-black' : 'text-gray-400 hover:text-white'}`} title={isAdmin ? "관리자 로그아웃" : "관리자 로그인"}>
              {isAdmin ? <LogOut size={18} /> : <Lock size={18} />}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={handleAdminClick} className={isAdmin ? 'text-[#D9F99D]' : 'text-gray-400'}>
              {isAdmin ? <LogOut size={20} /> : <Lock size={20} />}
            </button>
            <button className="text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#1A1A1A] border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => scrollToSection(item.id)} className="text-left text-gray-300 hover:text-[#D9F99D] py-2 tracking-widest font-bold border-b border-white/5 pb-2">
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default Navigation;