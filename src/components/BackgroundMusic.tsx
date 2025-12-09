import React, { useEffect, useRef, useState } from 'react';
import { Music, Pause, Play, Volume2, VolumeX, Settings } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import MusicEditModal from './MusicEditModal';

const BackgroundMusic: React.FC = () => {
  const { bgMusic, isAdmin } = useAdmin();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 데이터 안전장치
  const safeMusic = bgMusic || { url: '', isPlaying: false };

  useEffect(() => {
    if (safeMusic.url && audioRef.current) {
      if (safeMusic.isPlaying && isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [safeMusic.url, safeMusic.isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current || !safeMusic.url) {
      if (isAdmin) setIsModalOpen(true); // 음악 없으면 설정창 열기
      return;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // 음악이 없고 관리자가 아니면 숨김
  if (!safeMusic.url && !isAdmin) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[990] flex items-center gap-1 bg-black/60 backdrop-blur-xl pl-1 pr-1 py-1 rounded-full border border-white/10 shadow-2xl hover:border-[#D9F99D]/30 transition-colors group">
        <audio ref={audioRef} src={safeMusic.url} loop />
        
        {/* 재생/일시정지 버튼 (메인) */}
        <button 
          onClick={togglePlay}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${safeMusic.url ? 'bg-[#D9F99D] text-black hover:bg-[#bef264]' : 'bg-zinc-800 text-zinc-500'}`}
        >
          {safeMusic.url ? (
            isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />
          ) : (
            <Music size={18} />
          )}
        </button>

        {/* 확장 컨트롤 (소리, 설정) */}
        {safeMusic.url && (
          <div className="flex items-center overflow-hidden w-0 group-hover:w-auto transition-all duration-300">
            <button onClick={toggleMute} className="p-2 text-zinc-400 hover:text-white mx-1">
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        )}

        {/* 관리자 설정 버튼 */}
        {isAdmin && (
          <button onClick={() => setIsModalOpen(true)} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white ml-1">
            <Settings size={16} />
          </button>
        )}
      </div>

      <MusicEditModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default BackgroundMusic;