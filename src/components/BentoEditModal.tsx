import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Link as LinkIcon } from 'lucide-react';
import type { BentoGridItem } from '../types';
import { useAdmin } from '../contexts/AdminContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: BentoGridItem | null;
}

const BentoEditModal: React.FC<Props> = ({ isOpen, onClose, item }) => {
  const { bentoItems, updateBentoItems } = useAdmin();
  const [formData, setFormData] = useState<BentoGridItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item) setFormData(item);
    else setFormData({ id: Date.now(), title: '', description: '', header: '', className: 'md:col-span-1', img: '' });
  }, [item, isOpen]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newItems = [...bentoItems];
    if (item) newItems = newItems.map(i => (i.id === item.id ? formData : i));
    else newItems.push({ ...formData, id: Date.now() });
    
    updateBentoItems(newItems);
    onClose();
  };

  const handleDelete = () => {
    if (!item) return;
    if (window.confirm('정말 삭제하시겠습니까?')) {
      updateBentoItems(bentoItems.filter(i => i.id !== item.id));
      onClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, img: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#111] border border-zinc-800 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={24} /></button>
        <h2 className="text-2xl font-bold text-white mb-6">{item ? '포트폴리오 수정' : '새 포트폴리오 추가'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이미지 미리보기 */}
          <div className="w-full h-40 bg-zinc-900 rounded-lg border border-zinc-700 overflow-hidden flex items-center justify-center mb-4 relative group">
            {formData.img ? (
              <img src={formData.img} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-zinc-600 text-sm">이미지 없음</span>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
               <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white text-black rounded-full font-bold text-sm">이미지 변경</button>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block font-bold">이미지 업로드 방식 선택</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-gray-300 transition-colors"
              >
                <Upload size={16} /> PC 파일 선택
              </button>
              <div className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 border border-zinc-700 focus-within:border-lime-400">
                <LinkIcon size={16} className="text-gray-500" />
                <input 
                  value={formData.img || ''} 
                  onChange={e => setFormData({...formData, img: e.target.value})} 
                  className="w-full bg-transparent py-3 text-sm text-white focus:outline-none" 
                  placeholder="URL 입력" 
                />
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">소제목 (Header)</label>
            <input value={formData.header} onChange={e => setFormData({...formData, header: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" placeholder="예: Youtube" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">제목 (Title)</label>
            <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white" placeholder="제목 입력" required />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">설명 (Description)</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white h-24 resize-none" placeholder="내용 입력" required />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 bg-lime-400 text-black font-bold py-3 rounded-xl hover:bg-lime-300">저장하기</button>
            {item && <button type="button" onClick={handleDelete} className="px-4 py-3 bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500/30">삭제</button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BentoEditModal;