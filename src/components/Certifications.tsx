import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Edit2, Plus, Trash2, Save, X, Home, Database, FileText, Award, Image as ImageIcon } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { supabase } from '../supabaseClient';

// 독립형 인터페이스 (안전 장치)
interface CertificationItem { id: string; title: string; description: string; icon: string; color: string; imageUrl?: string; }

const IconMap: { [key: string]: React.ReactNode } = {
  'home': <Home size={24} />, 'database': <Database size={24} />, 'file': <FileText size={24} />, 'award': <Award size={24} />
};

const Certifications: React.FC = () => {
  const { certifications, updateCertifications, isAdmin, sectionTitles, updateSectionTitles } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [tempItems, setTempItems] = useState<CertificationItem[]>(certifications as CertificationItem[]);
  
  // 제목 수정 상태
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(sectionTitles.certificationsTitle || '보유 자격증');

  useEffect(() => { setTempItems(certifications as CertificationItem[]); }, [certifications]);

  // 제목 저장
  const handleTitleSave = () => { updateSectionTitles({ ...sectionTitles, certificationsTitle: tempTitle }); setIsEditingTitle(false); };
  
  const handleSave = () => { updateCertifications(tempItems); setIsEditing(false); };
  const handleChange = (id: string, field: keyof CertificationItem, value: string) => { setTempItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item)); };
  const handleDelete = (id: string) => { setTempItems(prev => prev.filter(item => item.id !== id)); };
  const handleAdd = () => { setTempItems([...tempItems, { id: Date.now().toString(), title: '새 자격증', description: '내용 입력', icon: 'award', color: 'bg-zinc-800 text-gray-400' }]); };
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

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto" id="certs">
      <div className="flex justify-between items-end mb-10">
        <div className="flex items-center gap-4 w-full">
          {/* 제목 수정 영역 */}
          {isEditingTitle ? (
            <div className="flex items-center gap-2 w-full md:w-auto">
              <input value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} className="text-3xl md:text-5xl font-bold bg-zinc-900 border border-[#D9F99D] text-white rounded-lg px-2 py-1" autoFocus />
              <button onClick={handleTitleSave} className="p-2 bg-[#D9F99D] text-black rounded-full flex-shrink-0"><Save size={18}/></button>
              <button onClick={() => setIsEditingTitle(false)} className="p-2 bg-red-500 text-white rounded-full flex-shrink-0"><X size={18}/></button>
            </div>
          ) : (
            <div className="flex items-center gap-3 group">
              <Award className="text-purple-400 hidden md:block" size={36} />
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{sectionTitles.certificationsTitle || '보유 자격증'}</h2>
              {/* 제목 수정 버튼 (관리자만 보임) */}
              {isAdmin && !isEditing && <button onClick={() => setIsEditingTitle(true)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-zinc-500 hover:text-white"><Edit2 size={18} /></button>}
            </div>
          )}
        </div>
        {isAdmin && !isEditing && <button onClick={() => setIsEditing(true)} className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm font-bold flex-shrink-0"><Edit2 size={16} /> 내용 수정</button>}
      </div>

      {isEditing ? (
        <div className="bg-zinc-900 p-6 rounded-xl border border-purple-500/30 space-y-6">
          {tempItems.map(item => (
            <div key={item.id} className="flex flex-col md:flex-row gap-4 border-b border-zinc-800 pb-6">
              <div className="w-full md:w-32 flex-shrink-0">
                <div className={`relative aspect-square rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700 flex items-center justify-center group ${!item.imageUrl && 'hover:border-purple-500 cursor-pointer'}`}>
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
                <textarea value={item.description} onChange={e => handleChange(item.id, 'description', e.target.value)} className="bg-black/30 text-white p-3 rounded-lg resize-none h-24" />
              </div>
              <button onClick={() => handleDelete(item.id)} className="text-red-500 p-2"><Trash2 size={20}/></button>
            </div>
          ))}
          <div className="flex gap-2 pt-4">
            <button onClick={handleAdd} className="flex-1 py-3 bg-zinc-800 text-purple-400 rounded-lg font-bold"><Plus size={18}/> 추가</button>
            <button onClick={handleSave} className="px-8 py-3 bg-purple-500 text-black font-bold rounded-lg"><Save size={18}/> 저장</button>
            <button onClick={() => setIsEditing(false)} className="px-6 py-3 bg-zinc-700 text-white rounded-lg"><X size={18}/> 취소</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tempItems.map(item => (
            <div key={item.id} className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl hover:border-purple-500/50 transition-colors group flex flex-col">
              {item.imageUrl ? (
                <div className="w-16 h-16 rounded-lg overflow-hidden mb-5 relative z-10"><img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" /></div>
              ) : (
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 relative z-10 ${item.color}`}>{IconMap[item.icon] || <Award size={24} />}</div>
              )}
              <h3 className="text-xl font-bold text-white mb-2 relative z-10">{item.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed relative z-10">{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
export default Certifications;