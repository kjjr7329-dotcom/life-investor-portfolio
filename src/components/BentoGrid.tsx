import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../contexts/AdminContext';
import BentoEditModal from './BentoEditModal';
import type { BentoGridItem } from '../types';
import { Plus, Edit2, Save, X, FolderOpen, Trash2 } from 'lucide-react';

const BentoGrid: React.FC = () => {
  const { bentoItems, sectionTitles, updateSectionTitles, deleteBentoItem, isAdmin } = useAdmin();
  const [selectedItem, setSelectedItem] = useState<BentoGridItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(sectionTitles.bentoTitle);

  const handleTitleSave = () => { updateSectionTitles({ ...sectionTitles, bentoTitle: tempTitle }); setIsEditingTitle(false); };
  const handleEditClick = (item: BentoGridItem) => { if (!isAdmin) return; setSelectedItem(item); setIsModalOpen(true); };
  const handleAddClick = () => { setSelectedItem(null); setIsModalOpen(true); };
  
  // ★ 진짜 삭제 함수 호출
  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // 카드 클릭 이벤트 막기
    if (window.confirm("정말 삭제하시겠습니까? (복구할 수 없습니다)")) {
      deleteBentoItem(id);
    }
  };

  return (
    <section className="py-16 md:py-32 px-6 max-w-7xl mx-auto w-full relative z-10" id="portfolio">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          {isEditingTitle ? (
            <div className="flex items-center gap-2 w-full">
              <input value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} className="text-3xl md:text-5xl font-bold bg-zinc-900 border border-[#D9F99D] text-white rounded-lg px-2 py-1 w-full" autoFocus />
              <button onClick={handleTitleSave} className="p-2 bg-[#D9F99D] text-black rounded-full flex-shrink-0"><Save size={18}/></button>
              <button onClick={() => setIsEditingTitle(false)} className="p-2 bg-red-500 text-white rounded-full flex-shrink-0"><X size={18}/></button>
            </div>
          ) : (
            <div className="flex items-center gap-3 group">
              <FolderOpen className="text-[#D9F99D] hidden md:block" size={36} />
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                {sectionTitles.bentoTitle || '나의 여정'}
              </h2>
              {isAdmin && <button onClick={() => setIsEditingTitle(true)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-zinc-500 hover:text-white"><Edit2 size={18} /></button>}
            </div>
          )}
        </div>
        {/* ★ 3개 이상이면 추가 버튼 숨김 (1줄 강제 유지) */}
        {isAdmin && bentoItems.length < 3 && (
          <button onClick={handleAddClick} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-[#D9F99D] rounded-full hover:bg-zinc-700 text-sm font-bold"><Plus size={18} /> 추가</button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bentoItems.map((item, i) => (
          <motion.div
            key={item.id || i}
            onClick={() => handleEditClick(item)}
            className={`rounded-2xl group/bento hover:shadow-2xl transition duration-300 shadow-input dark:shadow-none p-5 bg-zinc-900/50 border border-white/5 flex flex-col space-y-4 cursor-pointer relative overflow-hidden min-h-[24rem] ${item.className || ''} ${isAdmin ? 'hover:border-[#D9F99D]' : ''}`}
          >
            {/* ★ 관리자용 삭제 버튼 추가 (카드 안에 쓰레기통) */}
            {isAdmin && (
              <button 
                onClick={(e) => handleDeleteClick(e, item.id)} 
                className="absolute top-4 right-4 z-20 p-2 bg-black/60 rounded-full text-white hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover/bento:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            )}

            {item.img && (
              <div className="flex-1 w-full h-48 rounded-xl overflow-hidden relative">
                <img src={item.img} alt={item.title} className="object-cover w-full h-full absolute inset-0 opacity-80 group-hover/bento:opacity-100 transition-opacity duration-500" />
              </div>
            )}
            <div className="group-hover/bento:translate-x-2 transition duration-200 relative z-10 flex-shrink-0">
              {item.header && <div className="text-[#D9F99D] text-xs font-bold mb-2 uppercase tracking-wider">{item.header}</div>}
              <div className="font-sans font-bold text-white text-xl mb-2">{item.title}</div>
              <div className="font-sans font-normal text-sm text-gray-400 line-clamp-3 whitespace-pre-wrap leading-relaxed">
                {item.description}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>{isModalOpen && <BentoEditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={selectedItem} />}</AnimatePresence>
    </section>
  );
};

export default BentoGrid;