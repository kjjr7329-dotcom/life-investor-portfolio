import React, { useState, useRef } from 'react';
import { X, Upload, Link as LinkIcon, Trash2, Music } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MusicEditModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { bgMusic, updateBgMusic } = useAdmin();
  const [musicUrl, setMusicUrl] = useState(bgMusic.url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    updateBgMusic({ ...bgMusic, url: musicUrl, isPlaying: !!musicUrl });
    onClose();
  };

  const handleDelete = () => {
    setMusicUrl('');
    updateBgMusic({ ...bgMusic, url: '', isPlaying: false });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setMusicUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1A1A1A] border border-zinc-700 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={20} /></button>
        
        <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
          <div className="p-2 bg-zinc-800 rounded-lg text-[#D9F99D]">
            <Music size={20} />
          </div>
          <h2 className="text-lg font-bold text-white">배경음악 설정</h2>
        </div>

        <div className="space-y-6">
          {/* 1. PC 파일 업로드 버튼 */}
          <div className="space-y-2">
            <label className="text-xs text-[#D9F99D] font-bold block uppercase tracking-wider">Option 1. PC 파일 업로드</label>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-3 py-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 rounded-xl text-sm text-gray-200 transition-all group"
            >
              <div className="p-2 bg-black rounded-full group-hover:bg-[#D9F99D] group-hover:text-black transition-colors">
                <Upload size={16} />
              </div>
              내 컴퓨터에서 MP3 선택
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" className="hidden" />
          </div>

          <div className="text-center text-zinc-600 text-xs">- OR -</div>

          {/* 2. URL 입력 */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500 font-bold block uppercase tracking-wider">Option 2. 음악 주소(URL)</label>
            <div className="flex items-center gap-2 bg-zinc-900 rounded-xl px-4 border border-zinc-700 focus-within:border-[#D9F99D] transition-colors">
              <LinkIcon size={16} className="text-gray-500" />
              <input 
                value={musicUrl} 
                onChange={(e) => setMusicUrl(e.target.value)} 
                className="w-full bg-transparent py-3 text-sm text-white focus:outline-none placeholder:text-zinc-700" 
                placeholder="https://..." 
              />
            </div>
          </div>

          {/* 저장 및 삭제 버튼 */}
          <div className="pt-2 flex gap-3">
            <button onClick={handleSave} className="flex-1 bg-[#D9F99D] text-black font-bold py-3 rounded-xl hover:bg-[#bef264] transition-colors shadow-lg shadow-[#D9F99D]/10">
              저장 및 재생
            </button>
            {bgMusic.url && (
              <button onClick={handleDelete} className="px-4 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/20 hover:border-red-500/50 transition-colors">
                <Trash2 size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicEditModal;