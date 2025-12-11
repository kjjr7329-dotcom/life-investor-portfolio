import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Edit2, Plus, Trash2, Save, X, Heart, Image as ImageIcon } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { supabase } from '../supabaseClient';

// 독립형 인터페이스 (안전 장치)
interface InterestItem { id: string; title: string; description: string; category: 'TECH' | 'HOBBY'; icon: string; color: string; imageUrl?: string; }

const Interests: React.FC = () => {
  const { interests, updateInterests, isAdmin, sectionTitles, updateSectionTitles } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [tempItems, setTempItems] = useState<InterestItem[]>(interests as InterestItem[]);
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(sectionTitles.interestsTitle || '관심사 및 취미');

  useEffect(() => { setTempItems(interests as InterestItem[]); }, [interests]);

  const handleTitleSave = () => { updateSectionTitles({ ...sectionTitles, interestsTitle: tempTitle }); setIsEditingTitle(false); };
  const handleSave = () => { updateInterests(tempItems); setIsEditing(false); };
  const handleChange = (id: string, field: keyof InterestItem, value: string) => { setTempItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item)); };
  const handleDelete = (id: string) => { setTempItems(prev => prev.filter(item => item.id !== id)); };
  const handleAdd = () => { setTempItems([...tempItems, { id: Date.now().toString(), title: '새 항목', description: '설명', category: 'TECH', icon: 'book', color: 'bg-zinc-800' }]); };
  const handleImageChange = async (id: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
    if (!uploadError) {
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      setTempItems(prev => prev.map(item => item.id === id ? { ...item, imageUrl: data.publicUrl } : item));
    }
  };
  const handleImageRemove = (id: string) => { setTempItems(prev => prev.map(item => item.id === id ? { ...item, imageUrl: undefined } : item)); };

  const techItems = tempItems.filter(item => item.category === 'TECH');
  const hobbyItems = tempItems.filter(item => item.category === 'HOBBY');

  return (
    <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto" id="interests">
      <div className="flex items-center gap-4 mb-10">
        {isEditingTitle ? (
          <div className="flex items-center gap-2">
            <input value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} className="text-3xl md:text-5xl font-bold bg-zinc-900 border border-[#D9F99D] text-white rounded-lg px-2 py-1" autoFocus />
            <button onClick={handleTitleSave} className="p-2 bg-[#D9F99D] text-black rounded-full"><Save size={18}/></button>
            <button onClick={() => setIsEditingTitle(false)} className="p-2 bg-red-500 text-white rounded-full"><X size={18}/></button>
          </div>
        ) : (
          <div className="flex items-center gap-3 group">
            <Heart className="text-pink-500 hidden md:block" size={36} />
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{sectionTitles.interestsTitle || '관심사 및 취미'}</h2>
            {isAdmin && !isEditing && <button onClick={() => setIsEditingTitle(true)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-zinc-500 hover:text-white"><Edit2 size={18} /></button>}
          </div>
        )}
        {isAdmin && !isEditing && <button onClick={() => setIsEditing(true)} className="text-pink-500 hover:text-pink-400 flex items-center gap-1 text-sm font-bold ml-auto"><Edit2 size={16} /> 내용 수정</button>}
      </div>

      {isEditing ? (
        <div className="bg-zinc-900 p-6 rounded-xl border border-pink-500/30 space-y-6">
          {tempItems.map(item => (
            <div key={item.id} className="flex flex-col md:flex-row gap-4 border-b border-zinc-800 pb-6">
              <div className="w-full md:w-32 flex-shrink-0">
                <div className={`relative aspect-square rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700 flex items-center justify-center group ${!item.imageUrl && 'hover:border-pink-500 cursor-pointer'}`}>
                  {item.imageUrl ? (
                    <>
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      <button onClick={() => handleImageRemove(item.id)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><X size={14} /></button>
                    </>
                  ) : (
                    <ImageUploader onImageSelected={(file) => handleImageChange(item.id, file)}><div className="flex flex-col items-center text-zinc-500"><ImageIcon size={24} /><span className="text-xs mt-1">추가</span></div></ImageUploader>
                  )}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <input value={item.title} onChange={e => handleChange(item.id, 'title', e.target.value)} className="bg-black/30 text-white p-3 rounded-lg font-bold" />
                {/* ★ 3줄 입력 가능하도록 rows={3} 설정 */}
                <textarea 
                  rows={3}
                  value={item.description} 
                  onChange={e => handleChange(item.id, 'description', e.target.value)} 
                  className="bg-black/30 text-white p-3 rounded-lg resize-none" 
                  placeholder="설명을 입력하세요 (엔터로 줄바꿈 가능)"
                />
                <select value={item.category} onChange={e => handleChange(item.id, 'category', e.target.value as any)} className="bg-black/30 text-white p-3 rounded-lg w-full md:w-auto"><option value="TECH">INTERESTS</option><option value="HOBBY">HOBBY</option></select>
              </div>
              <button onClick={() => handleDelete(item.id)} className="text-red-500 p-2"><Trash2 size={20}/></button>
            </div>
          ))}
          <div className="flex gap-2 pt-4">
            <button onClick={handleAdd} className="flex-1 py-3 bg-zinc-800 text-pink-400 rounded-lg font-bold"><Plus size={18}/> 추가</button>
            <button onClick={handleSave} className="px-8 py-3 bg-pink-500 text-black font-bold rounded-lg"><Save size={18}/> 저장</button>
            <button onClick={() => setIsEditing(false)} className="px-6 py-3 bg-zinc-700 text-white rounded-lg"><X size={18}/> 취소</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 h-full">
            <h3 className="text-xl font-bold text-zinc-500 mb-6 uppercase tracking-widest border-b border-zinc-800 pb-4">INTERESTS</h3>
            <div className="space-y-8">
              {techItems.map(item => (
                <div key={item.id} className="flex gap-4 items-start group">
                  {item.imageUrl ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"><img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" /></div>
                  ) : (
                    <div className="w-2 h-2 mt-2.5 rounded-full bg-pink-500 flex-shrink-0 group-hover:scale-150 transition-transform"></div>
                  )}
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1 group-hover:text-pink-400 transition-colors">{item.title}</h4>
                    {/* ★ 줄바꿈 적용: whitespace-pre-wrap */}
                    <p className="text-zinc-400 text-sm whitespace-pre-wrap leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 h-full">
            <h3 className="text-xl font-bold text-zinc-500 mb-6 uppercase tracking-widest border-b border-zinc-800 pb-4">HOBBY</h3>
            <div className="space-y-8">
              {hobbyItems.map(item => (
                <div key={item.id} className="flex gap-4 items-start group">
                  {item.imageUrl ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"><img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" /></div>
                  ) : (
                    <div className="w-2 h-2 mt-2.5 rounded-full bg-orange-500 flex-shrink-0 group-hover:scale-150 transition-transform"></div>
                  )}
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">{item.title}</h4>
                    {/* ★ 줄바꿈 적용: whitespace-pre-wrap */}
                    <p className="text-zinc-400 text-sm whitespace-pre-wrap leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
export default Interests;