import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Edit2, Plus, Trash2, Save, X, Home, Database, FileText, Award, Image as ImageIcon } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { supabase } from '../supabaseClient'; // ★ 창고 열쇠 가져오기

interface CertificationItem { id: string; title: string; description: string; icon: string; color: string; imageUrl?: string; }

const IconMap: { [key: string]: React.ReactNode } = {
  'home': <Home size={24} />, 'database': <Database size={24} />, 'file': <FileText size={24} />, 'award': <Award size={24} />
};

const Certifications: React.FC = () => {
  const { certifications, updateCertifications, isAdmin } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [tempItems, setTempItems] = useState<CertificationItem[]>(certifications as CertificationItem[]);

  useEffect(() => { setTempItems(certifications as CertificationItem[]); }, [certifications]);

  const handleSave = () => { updateCertifications(tempItems); setIsEditing(false); };
  const handleChange = (id: string, field: keyof CertificationItem, value: string) => {
    setTempItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  const handleDelete = (id: string) => { setTempItems(prev => prev.filter(item => item.id !== id)); };
  const handleAdd = () => {
    setTempItems([...tempItems, { id: Date.now().toString(), title: '새 자격증', description: '내용 입력', icon: 'award', color: 'bg-zinc-800 text-gray-400' }]);
  };

  // ★ 이미지 업로드 기능 (핵심!)
  const handleImageChange = async (id: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Supabase 창고에 업로드
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
      if (uploadError) throw uploadError;

      // 2. 이미지 주소 가져오기
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      
      // 3. 화면에 반영
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
    <section className="py-20 px-6 max-w-7xl mx-auto" id="certs">
      <div className="flex justify-between items-end mb-10">
        <div className="flex items-center gap-3">
          <Award className="text-purple-400 hidden md:block" size={36} />
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">보유 자격증</h2>
        </div>
        {isAdmin && !isEditing && (
          <button onClick={() => setIsEditing(true)} className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm font-bold"><Edit2 size={16} /> 수정</button>
        )}
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
                <input value={item.title} onChange={e => handleChange(item.id, 'title', e.target.value)} className="bg-black/30 text-white p-3 rounded-lg font-bold" placeholder="자격증명" />
                <textarea value={item.description} onChange={e => handleChange(item.id, 'description', e.target.value)} className="bg-black/30 text-white p-3 rounded-lg resize-none h-24" placeholder="설명" />
              </div>
              <button onClick={() => handleDelete(item.id)} className="text-red-500 p-2 self-start md:self-center hover:bg-red-500/10 rounded-full transition-colors"><Trash2 size={20}/></button>
            </div>
          ))}
          <div className="flex gap-2 pt-4">
            <button onClick={handleAdd} className="flex-1 py-3 bg-zinc-800 text-purple-400 rounded-lg hover:bg-zinc-700 flex justify-center items-center gap-2 font-bold"><Plus size={18}/> 추가</button>
            <button onClick={handleSave} className="px-8 py-3 bg-purple-500 text-black font-bold rounded-lg hover:bg-purple-400 flex items-center gap-2"><Save size={18}/> 저장</button>
            <button onClick={() => setIsEditing(false)} className="px-6 py-3 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 flex items-center gap-2"><X size={18}/> 취소</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tempItems.map(item => (
            <div key={item.id} className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl hover:border-purple-500/50 transition-colors group flex flex-col">
              {item.imageUrl ? (
                <div className="w-16 h-16 rounded-lg overflow-hidden mb-5 relative z-10">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 relative z-10 ${item.color}`}>
                  {IconMap[item.icon] || <Award size={24} />}
                </div>
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