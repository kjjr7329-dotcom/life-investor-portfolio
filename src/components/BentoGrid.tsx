import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../contexts/AdminContext';
import BentoEditModal from './BentoEditModal';
import type { BentoGridItem } from '../types';
import { Plus, Edit2, Save, X } from 'lucide-react';

const BentoGrid: React.FC = () => {
  const { bentoItems, sectionTitles, updateSectionTitles, isAdmin } = useAdmin();
  const [selectedItem, setSelectedItem] = useState<BentoGridItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(sectionTitles.bentoTitle);

  const handleTitleSave = () => { updateSectionTitles({ ...sectionTitles, bentoTitle: tempTitle }); setIsEditingTitle(false); };
  const handleEditClick = (item: BentoGridItem) => { if (!isAdmin) return; setSelectedItem(item); setIsModalOpen(true); };
  const handleAddClick = () => { setSelectedItem(null); setIsModalOpen(true); };

  return (
    <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto w-full relative z-10" id="portfolio">
      <div className="flex justify-between items-end mb-10">
        <div className="flex items-center gap-4">
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} className="text-3xl md:text-5xl font-bold bg-zinc-900 border border-[#D9F99D] text-white rounded-lg px-2 py-1" autoFocus />
              <button onClick={handleTitleSave} className="p-2 bg-[#D9F99D] text-black rounded-full"><Save size={20}/></button>
              <button onClick={() => setIsEditingTitle(false)} className="p-2 bg-red-500 text-white rounded-full"><X size={20}/></button>
            </div>
          ) : (
            <div className="flex items-center gap-3 group">
              {/* ★ 점 삭제 완료 */}
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                {sectionTitles.bentoTitle}
              </h2>
              {isAdmin && <button onClick={() => setIsEditingTitle(true)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-zinc-500 hover:text-white"><Edit2 size={18} /></button>}
            </div>
          )}
        </div>
        {isAdmin && <button onClick={handleAddClick} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-[#D9F99D] rounded-full hover:bg-zinc-700"><Plus size={20} /> 추가</button>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[20rem]">
        {bentoItems.map((item, i) => (
          <motion.div
            key={item.id || i}
            onClick={() => handleEditClick(item)}
            className={`row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 bg-zinc-900 border-white/[0.1] border justify-between flex flex-col space-y-4 cursor-pointer relative overflow-hidden ${item.className || ''} ${isAdmin ? 'hover:border-[#D9F99D]' : ''}`}
          >
            {item.img && <div className="flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden relative"><img src={item.img} alt={item.title} className="object-cover w-full h-full absolute inset-0 opacity-60 group-hover/bento:opacity-100 transition-opacity" /></div>}
            <div className="group-hover/bento:translate-x-2 transition duration-200 relative z-10">
              {item.header && <div className="text-[#D9F99D] text-xs font-bold mb-1 uppercase tracking-wider">{item.header}</div>}
              <div className="font-sans font-bold text-neutral-200 mb-2 mt-2">{item.title}</div>
              <div className="font-sans font-normal text-xs text-neutral-400">{item.description}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>{isModalOpen && <BentoEditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={selectedItem} />}</AnimatePresence>
    </section>
  );
};

export default BentoGrid;