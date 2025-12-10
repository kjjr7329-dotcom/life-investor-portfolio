import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Upload, User } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

const About: React.FC = () => {
  const { aboutData, updateAboutData, sectionTitles, updateSectionTitles, isAdmin } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(aboutData);
  const [tempTitle, setTempTitle] = useState(sectionTitles.aboutTitle);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setTempData(aboutData); setTempTitle(sectionTitles.aboutTitle); }, [aboutData, sectionTitles]);

  const handleSave = () => {
    const skillsArray = typeof tempData.skills === 'string' ? (tempData.skills as string).split(',').map(s => s.trim()) : tempData.skills;
    updateAboutData({ ...tempData, skills: skillsArray });
    updateSectionTitles({ ...sectionTitles, aboutTitle: tempTitle });
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempData({ ...tempData, imageUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="py-16 md:py-32 px-6 max-w-7xl mx-auto relative z-10" id="about">
      {isAdmin && (
        <div className="absolute top-4 right-6 z-20">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-3 py-1 bg-zinc-800 rounded-full text-[#D9F99D] hover:bg-zinc-700 text-sm">
              <Edit2 size={14} /> <span>수정</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSave} className="px-3 py-1 bg-[#D9F99D] text-black font-bold rounded-full text-sm">저장</button>
              <button onClick={() => setIsEditing(false)} className="px-3 py-1 bg-red-500 text-white rounded-full text-sm">취소</button>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="w-full md:w-5/12">
          <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800 rounded-2xl shadow-2xl">
            <img src={isEditing ? (tempData.imageUrl || '') : (aboutData.imageUrl || "https://via.placeholder.com/400")} alt="Profile" className="w-full h-full object-cover" />
          </div>
          {isEditing && (
            <div className="mt-4 space-y-2">
              <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 bg-zinc-800 text-white text-sm rounded hover:bg-zinc-700 flex justify-center items-center gap-2"><Upload size={14}/> 사진 변경</button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="w-full md:w-7/12 space-y-6 md:space-y-8 text-center md:text-left">
          {isEditing ? (
            <div className="space-y-4">
              <input value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} className="text-2xl font-bold bg-zinc-900 border border-[#D9F99D] p-3 w-full rounded text-white" placeholder="섹션 제목" />
              <input value={tempData.title} onChange={(e) => setTempData({...tempData, title: e.target.value})} className="text-xl font-bold bg-zinc-900 border border-zinc-700 p-3 w-full rounded text-white" placeholder="소개 제목" />
              <textarea value={tempData.description} onChange={(e) => setTempData({...tempData, description: e.target.value})} className="w-full h-64 bg-zinc-900 border border-zinc-700 p-3 text-base rounded text-white" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {/* ★ 디자인 통일: 아이콘 + 제목 */}
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <User className="text-[#D9F99D]" size={20} />
                  <span className="text-[#D9F99D] text-sm md:text-base font-bold tracking-widest uppercase">{sectionTitles.aboutTitle}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-sans font-bold text-white leading-tight">{aboutData.title}</h2>
              </div>
              <p className="text-base md:text-lg text-gray-300 font-serif-KR leading-loose whitespace-pre-wrap">{aboutData.description}</p>
              <div className="pt-6 border-t border-white/10 flex flex-wrap justify-center md:justify-start gap-2">
                {(aboutData.skills || []).map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-zinc-800 rounded-full text-xs md:text-sm font-medium text-gray-400 border border-white/5">{skill}</span>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default About;