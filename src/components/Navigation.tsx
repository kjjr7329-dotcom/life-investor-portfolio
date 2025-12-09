import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import LoginModal from './LoginModal';

const Navigation: React.FC = () => {
  const { sectionTitles, isAdmin, logout } = useAdmin();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleAdminClick = () => {
    if (isAdmin) {
      if (confirm("관리자 모드를 종료하시겠습니까?")) logout();
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold tracking-tighter text-white cursor-pointer hover:text-lime-400 transition-colors">
          {/* 로고는 영어 유지 */}
          {sectionTitles?.navTitle || "The Life Investor"}
        </div>

        <div className="flex gap-6 items-center">
          {/* 메뉴 한글화 */}
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <a href="#about" className="hover:text-white transition-colors">소개</a>
            <a href="#portfolio" className="hover:text-white transition-colors">포트폴리오</a>
            <a href="#activities" className="hover:text-white transition-colors">활동</a>
            <a href="#guestbook" className="hover:text-white transition-colors">방명록</a>
          </div>

          <button 
            onClick={handleAdminClick}
            className={`p-2 rounded-full transition-all duration-300 ${isAdmin ? 'bg-lime-400 text-black shadow-[0_0_15px_rgba(163,230,53,0.5)]' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
          >
            {isAdmin ? <Unlock size={18} /> : <Lock size={18} />}
          </button>
        </div>
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Navigation;