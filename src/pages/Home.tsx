import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Building2, ShieldCheck, Activity, HardHat, FileText, ChevronDown, Send, MapPin, Phone, Mail, HelpCircle, Shield, TrendingUp } from 'lucide-react';
import { PORTFOLIO_ITEMS } from '../constants';
import { useApp } from '../contexts/AppContext';

// Icon mapping helper
const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: any } = {
    Building2, ShieldCheck, Activity, HardHat, FileText, Shield, CheckCircle: CheckCircle2, TrendingUp
  };
  return icons[iconName] || HelpCircle;
};

const Home: React.FC = () => {
  const { companyInfo, portfolioItems, heroContent, services, whyUsContent, homeSectionsContent, addInquiry } = useApp();
  const [activeService, setActiveService] = useState(0);

  // Contact Form State
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    category: '구조 설계 문의',
    message: ''
  });

  useEffect(() => {
    document.title = `${companyInfo.name} | 토탈 엔지니어링 솔루션`;
  }, [companyInfo.name]);

  // Auto-reset form status after success
  useEffect(() => {
    if (formStatus === 'success') {
      const timer = setTimeout(() => {
        setFormStatus('idle');
      }, 3000); // 3 seconds delay
      return () => clearTimeout(timer);
    }
  }, [formStatus]);

  // Use global portfolio items or fallback to constant if empty (for demo)
  const displayPortfolio = portfolioItems.length > 0 ? portfolioItems : PORTFOLIO_ITEMS;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
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
    <div className="flex flex-col min-h-screen font-sans">
      
      {/* 1. HERO SECTION - Dynamic Effects */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900">
        
        {/* Animated Background Image (Ken Burns) */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroContent.bgImage} 
            alt="Modern Architecture" 
            className="w-full h-full object-cover opacity-40 animate-ken-burns"
          />
        </div>

        {/* Technical Grid Overlay (Moving) */}
        <div className="absolute inset-0 z-0 opacity-10 animate-grid" 
             style={{
               backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
               backgroundSize: '50px 50px'
             }}>
        </div>

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-900"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-up-1 inline-block mb-6 px-6 py-2 rounded-full bg-blue-700/90 border border-blue-500/50 backdrop-blur-sm shadow-lg shadow-blue-900/30">
            <span className="text-white font-bold text-sm sm:text-lg tracking-wide">공동주택 시설물 유지보수 전문</span>
          </div>
          
          <h1 className="animate-fade-up-2 text-4xl sm:text-5xl md:text-7xl font-black text-white mb-6 md:mb-8 leading-tight tracking-tight whitespace-pre-line drop-shadow-2xl">
            {heroContent.headline}
          </h1>
          
          <p className="animate-fade-up-3 text-base sm:text-xl text-slate-300 mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed font-light whitespace-pre-line">
            {heroContent.subheadline}
          </p>
          
          <div className="animate-fade-up-4 flex flex-col sm:flex-row justify-center gap-4 sm:gap-5">
            <a 
              href="#contact" 
              className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-base sm:text-lg hover:bg-blue-500 transition-all hover:scale-105 shadow-lg shadow-blue-900/50 flex items-center justify-center group"
            >
              {heroContent.ctaPrimary} <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </a>
            <NavLink 
              to="/portfolio" 
              className="px-8 py-4 bg-white/10 text-white border border-white/20 backdrop-blur-sm rounded-full font-bold text-base sm:text-lg hover:bg-white/20 transition-all hover:scale-105 flex items-center justify-center"
            >
              {heroContent.ctaSecondary}
            </NavLink>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-slate-500 hidden sm:block">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* 2. WHY US SECTION - Added based on request */}
      <section className="py-20 bg-white border-b border-slate-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{whyUsContent.title}</h2>
               <p className="text-slate-500 text-lg max-w-3xl mx-auto leading-relaxed">{whyUsContent.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {whyUsContent.items.map((item, index) => {
                 const Icon = getIconComponent(item.iconName);
                 return (
                   <div key={index} className="bg-slate-50 p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                         <Icon size={28} strokeWidth={2} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                      <p className="text-slate-600 leading-relaxed text-sm md:text-base">{item.description}</p>
                   </div>
                 );
               })}
            </div>
         </div>
      </section>

      {/* 3. SERVICES SECTION - "What We Do" */}
      <section className="py-16 md:py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-xs sm:text-sm font-bold text-blue-600 tracking-widest uppercase mb-2">Our Expertise</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">우리가 제공하는 핵심 기술</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, idx) => {
              const IconComponent = getIconComponent(service.iconName);
              return (
                <div 
                  key={service.id}
                  onMouseEnter={() => setActiveService(idx)}
                  className={`group p-6 md:p-8 rounded-2xl transition-all duration-300 border ${
                    activeService === idx 
                      ? 'bg-slate-900 text-white shadow-2xl md:scale-105 border-slate-900 z-10' 
                      : 'bg-white text-slate-600 hover:bg-white border-slate-100'
                  }`}
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                    activeService === idx ? 'bg-blue-600 text-white' : 'bg-slate-50 text-blue-600 shadow-sm'
                  }`}>
                    <IconComponent size={24} className="md:w-7 md:h-7" />
                  </div>
                  <h4 className={`text-xl font-bold mb-4 ${activeService === idx ? 'text-white' : 'text-slate-900'}`}>
                    {service.title}
                  </h4>
                  <p className={`text-sm mb-6 leading-relaxed ${activeService === idx ? 'text-slate-300' : 'text-slate-500'}`}>
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-center text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${activeService === idx ? 'bg-blue-400' : 'bg-blue-600'}`}></div>
                        <span className={activeService === idx ? 'text-slate-300' : 'text-slate-600'}>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PORTFOLIO SECTION - "Success Stories" */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-12">
            <div className="text-center md:text-left w-full md:w-auto">
              <h2 className="text-xs sm:text-sm font-bold text-blue-600 tracking-widest uppercase mb-2">{homeSectionsContent.portfolioTitle}</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{homeSectionsContent.portfolioHeadline}</h3>
              <p className="text-slate-500 text-base leading-relaxed whitespace-pre-line">{homeSectionsContent.portfolioDescription}</p>
            </div>
            <NavLink to="/portfolio" className="hidden md:flex items-center text-slate-900 font-bold hover:text-blue-600 transition-colors mt-4 md:mt-0">
              전체 포트폴리오 보기 <ArrowRight className="ml-2" size={20} />
            </NavLink>
          </div>

          {/* Show 6 items (2 rows of 3) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {displayPortfolio.slice(0, 6).map((item) => (
              <div key={item.id} className="group bg-slate-50 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100">
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors z-10 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all text-white font-bold border border-white px-6 py-2 rounded-full">
                      자세히 보기
                    </span>
                  </div>
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 z-20">
                     <span className="bg-blue-600 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-lg">
                       {item.category}
                     </span>
                  </div>
                </div>
                <div className="p-5 md:p-6">
                  <h4 className="text-lg md:text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{item.title}</h4>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4">{item.description}</p>
                  <div className="flex items-center text-sm font-bold text-slate-900">
                    <span className="text-blue-600 mr-2 shrink-0">성과:</span> <span className="line-clamp-1">{item.result}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <NavLink to="/portfolio" className="inline-flex items-center px-6 py-3 bg-white border border-slate-300 rounded-lg font-bold text-slate-900 shadow-sm w-full justify-center">
              전체 실적 보기 <ArrowRight className="ml-2" size={18} />
            </NavLink>
          </div>
        </div>
      </section>

      {/* 5. CONTACT SECTION - Integrated Form */}
      <section id="contact" className="py-16 md:py-24 bg-slate-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-full bg-slate-100 -skew-x-12 transform translate-x-20 z-0"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            {/* Left: Info */}
            <div className="text-center lg:text-left">
              <h2 className="text-xs sm:text-sm font-bold text-blue-600 tracking-widest uppercase mb-2">{homeSectionsContent.contactTitle}</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{homeSectionsContent.contactHeadline}</h3>
              <p className="text-base md:text-lg text-slate-600 mb-8 md:mb-10 leading-relaxed whitespace-pre-line">
                {homeSectionsContent.contactDescription}
              </p>

              <div className="space-y-6 mb-10 max-w-md mx-auto lg:mx-0 text-left">
                <div className="flex items-center group bg-white lg:bg-transparent p-4 lg:p-0 rounded-xl lg:rounded-none shadow-sm lg:shadow-none">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4 md:mr-5 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-bold">전화 문의</p>
                    <p className="text-lg md:text-xl font-bold text-slate-900">{companyInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-center group bg-white lg:bg-transparent p-4 lg:p-0 rounded-xl lg:rounded-none shadow-sm lg:shadow-none">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4 md:mr-5 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                    <Mail size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-500 font-bold">이메일</p>
                    <p className="text-lg md:text-xl font-bold text-slate-900 truncate">{companyInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center group bg-white lg:bg-transparent p-4 lg:p-0 rounded-xl lg:rounded-none shadow-sm lg:shadow-none">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4 md:mr-5 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-bold">오시는 길</p>
                    <p className="text-base md:text-lg font-bold text-slate-900">{companyInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-slate-100 min-h-[500px] flex items-center">
               {formStatus === 'success' ? (
                 <div className="text-center w-full py-10 animate-in fade-in zoom-in duration-300">
                   <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                     <CheckCircle2 size={40} />
                   </div>
                   <h4 className="text-2xl font-bold text-slate-900 mb-2">상담 신청 완료</h4>
                   <p className="text-slate-600 mb-6">담당자가 내용 확인 후 빠르게 연락드리겠습니다.</p>
                   <p className="text-sm text-slate-400 mb-6">잠시 후 입력 화면으로 돌아갑니다...</p>
                   <button 
                     onClick={() => setFormStatus('idle')}
                     className="text-blue-600 font-bold hover:underline"
                   >
                     바로 돌아가기
                   </button>
                 </div>
               ) : (
                 <form onSubmit={handleContactSubmit} className="space-y-4 md:space-y-5 w-full">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                     <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">성함</label>
                       <input 
                         required 
                         type="text" 
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-base"
                         placeholder="홍길동"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">연락처</label>
                       <input 
                         required 
                         type="tel" 
                         value={formData.phone}
                         onChange={(e) => setFormData({...formData, phone: e.target.value})}
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-base"
                         placeholder="010-0000-0000"
                       />
                     </div>
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">회사/현장명</label>
                     <input 
                       type="text" 
                       value={formData.company}
                       onChange={(e) => setFormData({...formData, company: e.target.value})}
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-base"
                       placeholder="회사명 또는 프로젝트명 (선택)"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">문의 유형</label>
                     <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none text-base"
                     >
                        <option>구조 설계 문의</option>
                        <option>안전 진단 문의</option>
                        <option>내진 성능 평가</option>
                        <option>VE / 기술 자문</option>
                        <option>기타 문의</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">문의 내용</label>
                     <textarea 
                       required 
                       rows={4}
                       value={formData.message}
                       onChange={(e) => setFormData({...formData, message: e.target.value})}
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none text-base"
                       placeholder="문의하실 내용을 간략히 적어주세요."
                     ></textarea>
                   </div>
                   <button 
                     type="submit" 
                     disabled={formStatus === 'submitting'}
                     className={`w-full py-4 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center ${formStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}
                   >
                     {formStatus === 'submitting' ? '전송 중...' : '무료 상담 신청하기'} <Send size={18} className="ml-2" />
                   </button>
                 </form>
               )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;