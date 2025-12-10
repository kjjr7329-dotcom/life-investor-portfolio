import React from 'react';
import { Mail, Youtube, Instagram, Phone, ArrowUp, Share2 } from 'lucide-react'; // Share2 추가

const Footer: React.FC = () => {
  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // ★ 주소 복사 기능
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("주소가 복사되었습니다! \n친구에게 '붙여넣기'해서 자랑해보세요! 😎");
  };

  return (
    <footer className="py-16 px-6 border-t border-white/5 bg-[#1A1A1A] relative" id="contact">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        <div className="text-center md:text-left">
          <h2 onClick={scrollToTop} className="text-lg font-bold text-white tracking-tight cursor-pointer hover:text-[#D9F99D] transition-colors">The Life Investor</h2>
          <p className="text-zinc-600 text-xs mt-1">© 2025 JJin. All rights reserved.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* ★ 공유하기 버튼 추가 */}
          <button 
            onClick={handleShare}
            className="w-10 h-10 flex items-center justify-center bg-zinc-900 rounded-full border border-zinc-800 hover:bg-[#D9F99D] hover:border-[#D9F99D] text-zinc-400 hover:text-black transition-all"
            title="주소 복사"
          >
            <Share2 size={18} />
          </button>

          <div className="group flex items-center bg-zinc-900 rounded-full border border-zinc-800 hover:border-[#D9F99D] transition-all overflow-hidden cursor-default h-10">
            <div className="pl-3 pr-3 text-zinc-400 group-hover:text-[#D9F99D]"><Phone size={18} /></div>
            <span className="w-0 group-hover:w-auto overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500 text-sm text-zinc-300 whitespace-nowrap pr-0 group-hover:pr-4">010-6690-1019</span>
          </div>

          <a href="mailto:kjjr7329@gmail.com" className="group flex items-center bg-zinc-900 rounded-full border border-zinc-800 hover:border-[#D9F99D] transition-all overflow-hidden h-10">
            <div className="pl-3 pr-3 text-zinc-400 group-hover:text-[#D9F99D]"><Mail size={18} /></div>
            <span className="w-0 group-hover:w-auto overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500 text-sm text-zinc-300 whitespace-nowrap pr-0 group-hover:pr-4">kjjr7329@gmail.com</span>
          </a>

          <a href="#" className="w-10 h-10 flex items-center justify-center bg-zinc-900 rounded-full border border-zinc-800 hover:bg-red-600 hover:border-red-600 text-zinc-400 hover:text-white transition-all"><Youtube size={18} /></a>
          <a href="#" className="w-10 h-10 flex items-center justify-center bg-zinc-900 rounded-full border border-zinc-800 hover:bg-pink-600 hover:border-pink-600 text-zinc-400 hover:text-white transition-all"><Instagram size={18} /></a>
        </div>
      </div>

      <button onClick={scrollToTop} className="absolute bottom-8 right-6 md:right-10 p-3 bg-zinc-800 text-zinc-500 rounded-full hover:bg-[#D9F99D] hover:text-black transition-all shadow-lg border border-zinc-700 hover:border-[#D9F99D]" title="Top">
        <ArrowUp size={18} />
      </button>
    </footer>
  );
};

export default Footer;