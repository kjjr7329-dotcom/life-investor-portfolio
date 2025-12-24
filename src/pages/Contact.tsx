import React, { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

const Contact: React.FC = () => {
  const { companyInfo, addInquiry } = useApp();

  useEffect(() => {
    document.title = `${companyInfo.name} | 문의하기`;
  }, [companyInfo.name]);

  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    category: '구조 설계 문의',
    message: ''
  });

  // Auto-reset form status after success
  useEffect(() => {
    if (formStatus === 'success') {
      const timer = setTimeout(() => {
        setFormStatus('idle');
      }, 3000); // 3 seconds delay
      return () => clearTimeout(timer);
    }
  }, [formStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate network delay then add to context
    setTimeout(() => {
      addInquiry({
        name: formData.name,
        company: formData.company,
        phone: formData.phone,
        category: formData.category,
        message: formData.message
      });
      setFormStatus('success');
      setFormData({ name: '', company: '', phone: '', category: '구조 설계 문의', message: '' });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header - Dark Hero Style */}
      <section className="bg-slate-900 text-white pt-24 pb-16 md:pt-32 md:pb-20 relative text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
             <img src="https://picsum.photos/id/20/1920/600" alt="Office tools" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-slate-900/40"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">문의하기</h1>
            <p className="text-slate-300 text-sm md:text-base">전문 기술사와의 상담이 필요하신가요? 빠르고 정확하게 답변드리겠습니다.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Contact Info Side */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 md:mb-8">연락처 정보</h2>
            <p className="text-slate-600 mb-8 md:mb-10 leading-relaxed text-sm md:text-base">
              프로젝트의 초기 단계이신가요? 아니면 진행 중 발생한 문제로 고민 중이신가요?<br/>
              주저하지 마시고 연락주세요. 유선 상담은 무료로 진행됩니다.
            </p>

            <div className="space-y-6 md:space-y-8">
              <div className="flex items-start">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Phone size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="ml-4 md:ml-6">
                  <h3 className="text-base md:text-lg font-bold text-slate-900">전화 문의</h3>
                  <p className="text-slate-600 mb-1 text-sm">평일 09:00 - 18:00</p>
                  <a href={`tel:${companyInfo.phone}`} className="text-xl md:text-2xl font-bold text-blue-600 hover:text-blue-700">
                    {companyInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Mail size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="ml-4 md:ml-6">
                  <h3 className="text-base md:text-lg font-bold text-slate-900">이메일 문의</h3>
                  <p className="text-slate-600 mb-1 text-sm">자료 송부 및 견적 요청</p>
                  <a href={`mailto:${companyInfo.email}`} className="text-base md:text-lg font-medium text-slate-900 hover:text-blue-600">
                    {companyInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                  <MapPin size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="ml-4 md:ml-6">
                  <h3 className="text-base md:text-lg font-bold text-slate-900">오시는 길</h3>
                  <p className="text-slate-600 text-sm md:text-base">
                    {companyInfo.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-10 md:mt-12 w-full h-56 md:h-64 bg-white rounded-xl overflow-hidden relative border border-slate-200 shadow-sm">
               <img src="https://picsum.photos/id/352/800/400" alt="Map Location" className="w-full h-full object-cover opacity-80" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <span className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow text-sm font-bold text-slate-700 flex items-center">
                    <MapPin size={16} className="mr-2 text-blue-600" />
                    {companyInfo.name} 위치 (Google Map 연동)
                 </span>
               </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-6 md:p-10 rounded-2xl border border-slate-200 shadow-lg min-h-[500px] flex items-center">
            {formStatus === 'success' ? (
              <div className="w-full flex flex-col items-center justify-center text-center py-10 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">접수가 완료되었습니다.</h3>
                <p className="text-slate-600 mb-6">검토 후 담당 기술사가 빠른 시일 내에 연락드리겠습니다.</p>
                <p className="text-sm text-slate-400 mb-6">잠시 후 입력 화면으로 돌아갑니다...</p>
                <button 
                  onClick={() => setFormStatus('idle')}
                  className="mt-2 text-blue-600 font-bold hover:underline"
                >
                  새로운 문의 작성하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 w-full">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">담당자 성함</label>
                  <input required type="text" id="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base" placeholder="홍길동" />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-bold text-slate-700 mb-2">회사명 / 현장명</label>
                  <input type="text" id="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base" placeholder="(선택사항)" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">연락처</label>
                    <input required type="tel" id="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base" placeholder="010-0000-0000" />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-2">문의 유형</label>
                    <select id="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white text-base">
                      <option>구조 설계 문의</option>
                      <option>안전 진단 문의</option>
                      <option>내진 성능 평가</option>
                      <option>기술 자문/기타</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">문의 내용</label>
                  <textarea required id="message" rows={5} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-base" placeholder="현장 위치, 건물 규모, 주요 문제점 등을 간단히 적어주세요."></textarea>
                </div>

                <div className="flex items-start">
                  <input required type="checkbox" id="privacy" className="mt-1 mr-3 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                  <label htmlFor="privacy" className="text-sm text-slate-500">
                    개인정보 수집 및 이용에 동의합니다.
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={formStatus === 'submitting'}
                  className={`w-full py-4 rounded-lg font-bold text-lg text-white transition-all shadow-md flex items-center justify-center ${
                    formStatus === 'submitting' ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl'
                  }`}
                >
                  {formStatus === 'submitting' ? '전송 중...' : '상담 신청하기'} <Send size={18} className="ml-2" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;