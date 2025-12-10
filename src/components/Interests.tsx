import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Edit2, Plus, Trash2, Save, X, Heart, Cpu, Activity, Video, Bike, Book, Box, Image as ImageIcon } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { supabase } from '../supabaseClient'; // ★ 창고 열쇠

interface InterestItem { id: string; title: string; description: string; category: 'TECH' | 'HOBBY'; icon: string; color: string; imageUrl?: string; }

const IconMap: { [key: string]: React.ReactNode } = {
  'chip': <Cpu size={24} />, 'robot': <Box size={24} />, 'video': <Video size={24} />, 'activity': <Activity size={24} />, 'bike': <Bike size={24} />, 'book': <Book size={24} />
};

const Interests: React.FC = () => {
  const { interests, updateInterests, isAdmin } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [tempItems, setTempItems] = useState<InterestItem[]>(interests as InterestItem[]);

  useEffect(() => { setTempItems(interests as InterestItem[]); }, [interests]);

  const handleSave = () => { updateInterests(tempItems); setIsEditing(false); };
  const handleChange = (id: string, field: keyof InterestItem, value: string) => {
    setTempItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  const handleDelete = (id: string) => { setTempItems(prev => prev.filter(item => item.id !== id)); };
  const handleAdd = () => {
    setTempItems([...tempItems, { id: Date.now().toString(), title: '새 관심사', description: '내용 입력', category: 'HOBBY', icon: 'book', color: 'bg-zinc-800 text-gray-400' }]);
  };

  // ★ 이미지 업로드 기능
  const handleImageChange = async (id: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      
      setTempItems(prev => prev.map(item => item.id === id ? { ...item, imageUrl: data.publicUrl } : item));
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    }
  };

  const handleImageRemove = (id: string) => {
    setTempItems(prev => prev.map(item => item.id === id ? { ...item, imageUrl: undefined } : item));
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto" id="interests">
      <div className="flex justify-between items-end mb-10">
        <div className="flex items-center gap-3">
          <Heart className="text-pink-500 hidden md:block" size={36} />
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">관심사 및 취미</h2>
        </div>
        {isAdmin && !isEditing && (
          <button onClick={() => setIsEditing(true)} className="text-pink-500 hover:text-pink-400 flex items-center gap-1 text-sm font-bold"><Edit2 size={16} /> 수정</button>
        )}
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
                      <button onClick={() => handleImageRemove(item.id)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                    </>
                  ) : (
                    <ImageUploader onImageSelected={(file) => handleImageChange(item.id, file)}>
                      <div className="flex flex-col items-center text-zinc-500"><ImageIcon size={24} /><span className="text-xs mt-1">이미지 추가</span></div>
                    </ImageUploader>
                  )}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <input value={item.title} onChange={e => handleChange(item.id, 'title', e.target.value)} className="bg-black/30 text-white p-3 rounded-lg font-bold" placeholder="제목" />
                <textarea value={item.description} onChange={e => handleChange(item.id, 'description', e.target.value)} className="bg-black/30 text-white p-3 rounded-lg resize-none h-24" placeholder="설명" />
                <select value={item.category} onChange={e => handleChange(item.id, 'category', e.target.value as any)} className="bg-black/30 text-white p-3 rounded-lg w-full md:w-auto">
                  <option value="TECH">TECH</option><option value="HOBBY">HOBBY</option>
                </select>
              </div>
              <button onClick={() => handleDelete(item.id)} className="text-red-500 p-2 self-start md:self-center hover:bg-red-500/10 rounded-full transition-colors"><Trash2 size={20}/></button>
            </div>
          ))}
          <div className="flex gap-2 pt-4">
            <button onClick={handleAdd} className="flex-1 py-3 bg-zinc-800 text-pink-400 rounded-lg hover:bg-zinc-700 flex justify-center items-center gap-2 font-bold"><Plus size={18}/> 추가</button>
            <button onClick={handleSave} className="px-8 py-3 bg-pink-500 text-black font-bold rounded-lg hover:bg-pink-400 flex items-center gap-2"><Save size={18}/> 저장</button>
            <button onClick={() => setIsEditing(false)} className="px-6 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 flex items-center gap-2"><X size={18}/> 취소</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tempItems.map(item => (
            <div key={item.id} className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl hover:bg-zinc-800 transition-colors relative overflow-hidden group min-h-[180px] flex flex-col">
              <span className="absolute top-6 right-6 text-xs font-bold tracking-widest text-zinc-500 uppercase z-20">{item.category}</span>
              {item.imageUrl ? (
                <div className="w-16 h-16 rounded-lg overflow-hidden mb-5 relative z-10">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative z-10 ${item.color}`}>
                  {IconMap[item.icon] || <Heart size={24} />}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white mb-1 relative z-10">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed relative z-10">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
export default Interests;