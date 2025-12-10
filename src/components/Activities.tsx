import React, { useRef, useState, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Save, X, CalendarClock } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import type { ActivityItem } from '../types';
import ActivityFormModal from './ActivityFormModal';

const Activities: React.FC = () => {
  const { activities, updateActivities, sectionTitles, updateSectionTitles, isAdmin } = useAdmin();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ActivityItem | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(sectionTitles.activitiesTitle);
  const [tempSubtitle, setTempSubtitle] = useState(sectionTitles.activitiesSubtitle);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleTitleSave = () => { updateSectionTitles({ ...sectionTitles, activitiesTitle: tempTitle, activitiesSubtitle: tempSubtitle }); setIsEditingTitle(false); };
  const handleDelete = (id: string) => { if (window.confirm('정말 삭제하시겠습니까?')) updateActivities(activities.filter(a => a.id !== id)); };
  const handleEdit = (item: ActivityItem) => { setEditingItem(item); setIsFormOpen(true); };
  const handleAdd = () => { setEditingItem(null); setIsFormOpen(true); };
  const scroll = (direction: 'left' | 'right') => { if (scrollRef.current) scrollRef.current.scrollBy({ left: direction === 'left' ? -340 : 340, behavior: 'smooth' }); };
  const handleMouseDown = (e: MouseEvent) => { if (scrollRef.current) { setIsDragging(true); setStartX(e.pageX - scrollRef.current.offsetLeft); setScrollLeft(scrollRef.current.scrollLeft); }};
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: MouseEvent) => { if (!isDragging || !scrollRef.current) return; e.preventDefault(); const x = e.pageX - scrollRef.current.offsetLeft; const walk = (x - startX) * 2; scrollRef.current.scrollLeft = scrollLeft - walk; };

  return (
    <section className="py-16 md:py-32 px-6 w-full bg-[#1A1A1A] relative" id="activities">
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex flex-col gap-2 w-full md:w-auto">
          {isEditingTitle ? (
            <div className="flex flex-col gap-2 bg-zinc-900 p-4 rounded-xl border border-[#D9F99D] w-full md:w-96">
              <div className="flex items-center gap-2">
                <input value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} className="text-2xl font-bold bg-zinc-800 text-white rounded p-2 w-full" />
                <button onClick={handleTitleSave} className="p-2 bg-[#D9F99D] text-black rounded"><Save size={18}/></button>
                <button onClick={() => setIsEditingTitle(false)} className="p-2 bg-red-500 text-white rounded"><X size={18}/></button>
              </div>
              <input value={tempSubtitle} onChange={(e) => setTempSubtitle(e.target.value)} className="text-sm bg-zinc-800 rounded p-2 w-full text-white" />
            </div>
          ) : (
            <div className="group relative">
              <div className="flex items-center gap-3">
                {/* ★ 디자인 통일 */}
                <CalendarClock className="text-[#D9F99D] hidden md:block" size={36} />
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                  {sectionTitles.activitiesTitle}
                </h2>
                {isAdmin && <button onClick={() => setIsEditingTitle(true)} className="text-zinc-500 hover:text-white"><Edit2 size={18} /></button>}
              </div>
              <p className="text-base md:text-lg text-gray-400 font-serif-KR mt-2 ml-1">{sectionTitles.activitiesSubtitle}</p>
            </div>
          )}
        </div>

        <div className="flex gap-4 items-center self-end">
          {isAdmin && <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-[#D9F99D] text-black rounded-lg hover:bg-[#bef264] font-bold text-sm"><Plus size={18} /> <span className="hidden md:inline">활동 추가</span></button>}
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="p-3 rounded-full bg-zinc-800 text-white hover:bg-zinc-700"><ChevronLeft size={20} /></button>
            <button onClick={() => scroll('right')} className="p-3 rounded-full bg-zinc-800 text-white hover:bg-zinc-700"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide cursor-grab active:cursor-grabbing px-2" onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
        {activities.map((activity, index) => (
          <motion.div key={activity.id} className="flex-shrink-0 w-[280px] md:w-[350px] bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 group relative hover:border-[#D9F99D]/50 transition-colors">
            <div className="h-40 md:h-48 bg-zinc-800 relative overflow-hidden">
              {activity.imageUrl ? <img src={activity.imageUrl} alt={activity.title} className="w-full h-full object-cover" draggable={false} /> : <div className="w-full h-full flex items-center justify-center text-zinc-600">No Image</div>}
            </div>
            <div className="p-5 md:p-6">
              <div className="flex items-center gap-2 text-[#D9F99D] text-xs md:text-sm mb-3"><Calendar size={14} /><span>{activity.date}</span></div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2 line-clamp-1">{activity.title}</h3>
              <p className="text-gray-400 text-xs md:text-sm line-clamp-3 leading-relaxed">{activity.description}</p>
            </div>
            {isAdmin && (
              <div className="absolute top-3 right-3 flex gap-2">
                <button onClick={() => handleEdit(activity)} className="p-2 bg-black/60 text-white rounded-full hover:bg-[#D9F99D] hover:text-black"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(activity.id)} className="p-2 bg-black/60 text-white rounded-full hover:bg-red-500"><Trash2 size={14} /></button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <ActivityFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} editItem={editingItem} />
    </section>
  );
};

export default Activities;