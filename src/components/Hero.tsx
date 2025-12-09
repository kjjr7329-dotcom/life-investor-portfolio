import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Save, X, Upload } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

const Hero: React.FC = () => {
  const { heroData, updateHeroData, isAdmin } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(heroData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTempData(heroData); }, [heroData]);

  const handleSave = () => {
    updateHeroData(tempData);
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempData({ ...tempData, bgImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // 기본 배경 이미지 (JJin님이 보여주신 서재 이미지와 비슷한 분위기)
  const defaultBgImage = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop';
  const currentBgImage = isEditing ? (tempData.bgImage || defaultBgImage) : (heroData.bgImage || defaultBgImage);

  return (
    <section className="h-screen flex flex-col justify-center items-start relative overflow-hidden px-6 md:px-20">
      {/* ★ 배경 이미지 적용 부분 */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-700"
        style={{ backgroundImage: `url(${currentBgImage})` }}
      />
      {/* 글씨가 잘 보이도록 어두운 막 씌우기 */}
      <div className="absolute inset-0 bg-black/60 z-0" />
      
      {isAdmin && (
        <div className="absolute top-24 right-10 z-50">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="p-2 bg-zinc-800 rounded-full text-lime-400 hover:bg-zinc-700"><Edit2 size={20} /></button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSave} className="p-2 bg-lime-400 text-black rounded-full"><Save size={20} /></button>
              <button onClick={() => setIsEditing(false)} className="p-2 bg-red-500 text-white rounded-full"><X size={20} /></button>
            </div>
          )}
        </div>
      )}

      {/* 수정 모드일 때 배경 이미지 변경 버튼 표시 */}
      {isEditing && (
        <div className="absolute top-36 right-10 z-50 flex flex-col items-end gap-2 animate-fade-in">
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-zinc-800/80 hover:bg-zinc-700 text-white text-sm rounded-full backdrop-blur-md transition-colors">
            <Upload size={16} /> 배경 이미지 변경
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      )}

      <div className="relative z-10 max-w-5xl space-y-8">
        {isEditing ? (
          <div className="flex flex-col gap-4 w-full animate-fade-in">
            <textarea 
              value={tempData.mainText} 
              onChange={(e) => setTempData({...tempData, mainText: e.target.value})}
              className="text-5xl md:text-7xl font-bold bg-zinc-900/80 border border-lime-400/50 rounded-xl p-4 text-white w-full focus:outline-none resize-none h-48"
            />
            <textarea 
              value={tempData.subText} 
              onChange={(e) => setTempData({...tempData, subText: e.target.value})}
              className="text-xl md:text-2xl font-light bg-zinc-900/80 border border-lime-400/50 rounded-xl p-4 text-gray-300 w-full focus:outline-none h-32"
            />
          </div>
        ) : (
          <>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-sans font-bold leading-tight text-white whitespace-pre-wrap drop-shadow-lg"
            >
              {heroData.mainText}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100px' }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-1 bg-[#D9F99D] my-6"
            />

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg md:text-2xl text-gray-200 font-serif-KR leading-relaxed whitespace-pre-wrap drop-shadow-md"
            >
              {heroData.subText}
            </motion.p>
          </>
        )}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 text-sm tracking-widest"
      >
        아래로 스크롤
      </motion.div>
    </section>
  );
};

export default Hero;