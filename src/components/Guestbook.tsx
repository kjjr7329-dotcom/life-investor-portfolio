import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, Edit2, Save, X } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

const Guestbook: React.FC = () => {
  const { guestbookMessages, addGuestbookMessage, deleteGuestbookMessage, sectionTitles, updateSectionTitles, isAdmin } = useAdmin();
  const [newMessage, setNewMessage] = useState('');
  const [author, setAuthor] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(sectionTitles.guestbookTitle);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [guestbookMessages]);

  const handleTitleSave = () => { updateSectionTitles({ ...sectionTitles, guestbookTitle: tempTitle }); setIsEditingTitle(false); };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!newMessage.trim() || !author.trim()) return; addGuestbookMessage({ text: newMessage, author: author }); setNewMessage(''); setAuthor(''); };
  const handleDelete = (id: string) => { if (window.confirm('정말 삭제하시겠습니까?')) deleteGuestbookMessage(id); };

  return (
    <section className="py-24 md:py-32 px-6 max-w-4xl mx-auto w-full relative z-10" id="guestbook">
      <div className="flex items-center gap-4 mb-10">
        {isEditingTitle ? (
          <div className="flex items-center gap-2">
            <input value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} className="text-3xl md:text-5xl font-bold bg-zinc-900 border border-[#D9F99D] text-white rounded-lg px-2 py-1" autoFocus />
            <button onClick={handleTitleSave} className="p-2 bg-[#D9F99D] text-black rounded-full"><Save size={20}/></button>
            <button onClick={() => setIsEditingTitle(false)} className="p-2 bg-red-500 text-white rounded-full"><X size={20}/></button>
          </div>
        ) : (
          <div className="flex items-center gap-3 group">
            {/* ★ 점 삭제 완료 & 색상 통일 */}
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              {sectionTitles.guestbookTitle}
            </h2>
            {isAdmin && <button onClick={() => setIsEditingTitle(true)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-zinc-500 hover:text-white"><Edit2 size={18} /></button>}
          </div>
        )}
      </div>

      <div className="bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[600px]">
        <form onSubmit={handleSubmit} className="p-6 bg-black/40 border-b border-white/10 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="이름 (닉네임)" className="w-full md:w-1/3 bg-zinc-800/80 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D9F99D] transition-colors" required />
            <div className="flex-1 flex gap-2">
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="따뜻한 응원 메시지를 남겨주세요..." className="flex-1 bg-zinc-800/80 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D9F99D] transition-colors" required />
              <button type="submit" className="bg-[#D9F99D] text-black px-6 rounded-lg font-bold hover:bg-[#bef264] transition-colors flex items-center justify-center"><Send size={20} /></button>
            </div>
          </div>
        </form>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700" ref={scrollRef}>
          {guestbookMessages.length === 0 && <div className="text-center text-gray-500 py-20"><p>아직 작성된 방명록이 없습니다.</p><p className="text-sm mt-2">첫 번째 메시지의 주인공이 되어주세요!</p></div>}
          <AnimatePresence>
            {[...guestbookMessages].reverse().map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-zinc-800/50 p-4 rounded-xl border border-white/5 relative group">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-[#D9F99D] text-sm">{msg.author}</span>
                  {isAdmin && <button onClick={() => handleDelete(msg.id)} className="text-zinc-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>}
                </div>
                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Guestbook;