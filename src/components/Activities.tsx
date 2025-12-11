import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Save, X, CalendarClock, GripVertical } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import type { ActivityItem } from '../types';
import ActivityFormModal from './ActivityFormModal';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableActivityCard = ({ activity, isAdmin, onEdit, onDelete }: { activity: ActivityItem; isAdmin: boolean; onEdit: (item: ActivityItem) => void; onDelete: (id: string) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: activity.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      // ★ 중요: 여기서 'touch-none'을 제거했습니다! (이제 스크롤 잘 됨)
      className="snap-center flex-shrink-0 w-[85vw] md:w-[350px] relative group"
    >
      <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 hover:border-[#D9F99D]/50 transition-colors h-full flex flex-col shadow-lg relative">
        
        {/* ★ 드래그 손잡이: 여기만 'touch-none' 적용 (이걸 잡아야만 드래그 됨) */}
        {isAdmin && (
          <div {...attributes} {...listeners} className="absolute top-3 left-3 z-30 p-2 bg-black/70 rounded-full cursor-grab active:cursor-grabbing text-white hover:text-[#D9F99D] touch-none shadow-md border border-white/10">
            <GripVertical size={18} />
          </div>
        )}

        {/* ★ 수정/삭제 버튼: z-index를 30으로 높여서 무조건 보이게 함 */}
        {isAdmin && (
          <div className="absolute top-3 right-3 flex gap-2 z-30">
            <button onClick={(e) => { e.stopPropagation(); onEdit(activity); }} className="p-2 bg-black/70 text-white rounded-full hover:bg-[#D9F99D] hover:text-black shadow-md border border-white/10"><Edit2 size={16} /></button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(activity.id); }} className="p-2 bg-black/70 text-white rounded-full hover:bg-red-500 shadow-md border border-white/10"><Trash2 size={16} /></button>
          </div>
        )}
        
        <div className="h-64 md:h-48 bg-zinc-800 relative overflow-hidden">
          {activity.imageUrl ? <img src={activity.imageUrl} alt={activity.title} className="w-full h-full object-cover" draggable={false} /> : <div className="w-full h-full flex items-center justify-center text-zinc-600">No Image</div>}
        </div>
        <div className="p-6 md:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#D9F99D] text-sm mb-3"><Calendar size={14} /><span>{activity.date}</span></div>
            <h3 className="text-xl md:text-xl font-bold text-white mb-2 line-clamp-1">{activity.title}</h3>
            <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">{activity.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Activities: React.FC = () => {
  const { activities, updateActivities, reorderActivities, sectionTitles, updateSectionTitles, isAdmin } = useAdmin();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ActivityItem | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(sectionTitles.activitiesTitle);
  const [tempSubtitle, setTempSubtitle] = useState(sectionTitles.activitiesSubtitle);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = activities.findIndex((item) => item.id === active.id);
      const newIndex = activities.findIndex((item) => item.id === over?.id);
      const newOrder = arrayMove(activities, oldIndex, newIndex);
      reorderActivities(newOrder);
    }
  };

  const handleTitleSave = () => { updateSectionTitles({ ...sectionTitles, activitiesTitle: tempTitle, activitiesSubtitle: tempSubtitle }); setIsEditingTitle(false); };
  const handleDelete = (id: string) => { if (window.confirm('정말 삭제하시겠습니까?')) updateActivities(activities.filter(a => a.id !== id)); };
  const handleEdit = (item: ActivityItem) => { setEditingItem(item); setIsFormOpen(true); };
  const handleAdd = () => { setEditingItem(null); setIsFormOpen(true); };
  const scroll = (direction: 'left' | 'right') => { if (scrollRef.current) scrollRef.current.scrollBy({ left: direction === 'left' ? -340 : 340, behavior: 'smooth' }); };

  return (
    <section className="py-16 md:py-32 px-0 md:px-6 w-full bg-[#1A1A1A] relative" id="activities">
      <div className="max-w-7xl mx-auto mb-8 px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
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
                <CalendarClock className="text-[#D9F99D] hidden md:block" size={36} />
                <h2 className="text-2xl md:text-5xl font-bold text-white tracking-tight">
                  {sectionTitles.activitiesTitle}
                </h2>
                {isAdmin && <button onClick={() => setIsEditingTitle(true)} className="text-zinc-500 hover:text-white"><Edit2 size={18} /></button>}
              </div>
              <p className="text-sm md:text-lg text-gray-400 font-serif-KR mt-2 ml-1">{sectionTitles.activitiesSubtitle}</p>
            </div>
          )}
        </div>

        <div className="flex gap-4 items-center self-end px-6 md:px-0">
          {isAdmin && <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-[#D9F99D] text-black rounded-lg hover:bg-[#bef264] font-bold text-sm"><Plus size={18} /> <span className="hidden md:inline">활동 추가</span></button>}
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll('left')} className="p-3 rounded-full bg-zinc-800 text-white hover:bg-zinc-700"><ChevronLeft size={20} /></button>
            <button onClick={() => scroll('right')} className="p-3 rounded-full bg-zinc-800 text-white hover:bg-zinc-700"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef} 
        className="flex gap-4 md:gap-6 overflow-x-auto pb-12 scrollbar-hide px-6 snap-x snap-mandatory"
      >
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={activities.map(a => a.id)} strategy={horizontalListSortingStrategy}>
            {activities.map((activity) => (
              <SortableActivityCard 
                key={activity.id} 
                activity={activity} 
                isAdmin={isAdmin} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <ActivityFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} editItem={editingItem} />
    </section>
  );
};

export default Activities;