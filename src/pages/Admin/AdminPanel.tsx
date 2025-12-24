import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Inbox, LayoutGrid, Settings, Trash2, CheckCircle, Plus, Save, Home, Briefcase, ChevronRight, Info, Award, Type } from 'lucide-react';
import { PortfolioItem, ServiceItem, WhyUsContent, HomeSectionsContent } from '../../types';

const AdminPanel: React.FC = () => {
  const { 
    isAuthenticated, logout, 
    inquiries, updateInquiryStatus, deleteInquiry,
    portfolioItems, addPortfolioItem, updatePortfolioItem, deletePortfolioItem,
    companyInfo, updateCompanyInfo,
    heroContent, updateHeroContent,
    whyUsContent, updateWhyUsContent,
    homeSectionsContent, updateHomeSectionsContent,
    services, updateServices, addService, deleteService,
    aboutContent, updateAboutContent
  } = useApp();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'inquiries' | 'hero' | 'sections' | 'whyus' | 'about' | 'services' | 'portfolio' | 'settings'>('inquiries');

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-xl">DA Admin System</span>
            <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">DEMO MODE</span>
          </div>
          <button onClick={handleLogout} className="flex items-center text-slate-300 hover:text-white transition-colors text-sm">
            <LogOut size={16} className="mr-2" /> 로그아웃
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 space-y-2 sticky top-24">
              <button 
                onClick={() => setActiveTab('inquiries')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'inquiries' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Inbox size={20} className="mr-3" /> 
                상담 문의 
                {inquiries.filter(i => i.status === 'new').length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {inquiries.filter(i => i.status === 'new').length}
                  </span>
                )}
              </button>
              
              <div className="my-2 border-t border-slate-100"></div>
              
              <button 
                onClick={() => setActiveTab('hero')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'hero' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Home size={20} className="mr-3" /> 메인: 히어로 섹션
              </button>

              <button 
                onClick={() => setActiveTab('sections')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'sections' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Type size={20} className="mr-3" /> 메인: 섹션 텍스트
              </button>

              <button 
                onClick={() => setActiveTab('whyus')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'whyus' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Award size={20} className="mr-3" /> 메인: Why Us
              </button>

              <button 
                onClick={() => setActiveTab('about')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'about' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Info size={20} className="mr-3" /> 회사 소개 관리
              </button>

               <button 
                onClick={() => setActiveTab('services')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'services' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Briefcase size={20} className="mr-3" /> 기술/서비스 관리
              </button>

              <button 
                onClick={() => setActiveTab('portfolio')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'portfolio' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <LayoutGrid size={20} className="mr-3" /> 실적/포트폴리오
              </button>
              
              <div className="my-2 border-t border-slate-100"></div>

              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Settings size={20} className="mr-3" /> 회사 기본 정보
              </button>
              
               <div className="pt-4 mt-4 border-t border-slate-100 text-center">
                  <button onClick={() => navigate('/')} className="text-slate-500 text-sm hover:text-blue-600 hover:underline">
                     홈페이지 바로가기
                  </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === 'inquiries' && (
              <InquiryManager inquiries={inquiries} onUpdateStatus={updateInquiryStatus} onDelete={deleteInquiry} />
            )}
            {activeTab === 'hero' && (
              <HeroManager content={heroContent} onUpdate={updateHeroContent} />
            )}
            {activeTab === 'sections' && (
              <HomeSectionsManager content={homeSectionsContent} onUpdate={updateHomeSectionsContent} />
            )}
            {activeTab === 'whyus' && (
              <WhyUsManager content={whyUsContent} onUpdate={updateWhyUsContent} />
            )}
            {activeTab === 'about' && (
              <AboutManager content={aboutContent} onUpdate={updateAboutContent} />
            )}
            {activeTab === 'services' && (
              <ServicesManager 
                 services={services} 
                 onUpdate={updateServices} 
                 onAdd={addService}
                 onDelete={deleteService} 
              />
            )}
            {activeTab === 'portfolio' && (
              <PortfolioManager items={portfolioItems} onAdd={addPortfolioItem} onUpdate={updatePortfolioItem} onDelete={deletePortfolioItem} />
            )}
            {activeTab === 'settings' && (
              <SettingsManager info={companyInfo} onUpdate={updateCompanyInfo} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub Components for Admin Panel ---

const HomeSectionsManager: React.FC<{ content: HomeSectionsContent, onUpdate: (content: HomeSectionsContent) => void }> = ({ content, onUpdate }) => {
  const [formData, setFormData] = useState(content);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-6">메인: 섹션 텍스트 관리</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Portfolio Section */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
           <div className="flex items-center mb-4">
              <LayoutGrid className="text-blue-600 mr-2" size={20} />
              <h3 className="font-bold text-lg text-slate-800">1. 주요 실적 섹션 (Portfolio)</h3>
           </div>
           <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 text-slate-700">소제목 (영문/작은 글씨)</label>
                <input 
                  value={formData.portfolioTitle} 
                  onChange={e => setFormData({...formData, portfolioTitle: e.target.value})}
                  className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
                  placeholder="예: Selected Works"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-slate-700">메인 제목 (큰 글씨)</label>
                <input 
                  value={formData.portfolioHeadline} 
                  onChange={e => setFormData({...formData, portfolioHeadline: e.target.value})}
                  className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
                  placeholder="예: 주요 수행 실적"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-slate-700">부연 설명 (아래 설명글)</label>
                <textarea 
                  rows={2}
                  value={formData.portfolioDescription} 
                  onChange={e => setFormData({...formData, portfolioDescription: e.target.value})}
                  className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
                  placeholder="실적 섹션에 표시될 설명 문구를 입력하세요."
                />
              </div>
           </div>
        </div>

        {/* Contact Section */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
           <div className="flex items-center mb-4">
              <Inbox className="text-blue-600 mr-2" size={20} />
              <h3 className="font-bold text-lg text-slate-800">2. 상담 신청 섹션 (Contact)</h3>
           </div>
           <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 text-slate-700">소제목 (영문/작은 글씨)</label>
                <input 
                  value={formData.contactTitle} 
                  onChange={e => setFormData({...formData, contactTitle: e.target.value})}
                  className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
                  placeholder="예: Contact Us"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-slate-700">메인 제목 (큰 글씨)</label>
                <input 
                  value={formData.contactHeadline} 
                  onChange={e => setFormData({...formData, contactHeadline: e.target.value})}
                  className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
                  placeholder="예: 상담 신청"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-slate-700">상세 안내 문구</label>
                <textarea 
                  rows={3}
                  value={formData.contactDescription} 
                  onChange={e => setFormData({...formData, contactDescription: e.target.value})}
                  className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
                  placeholder="문의 섹션에 표시될 상세 안내 문구를 입력하세요."
                />
              </div>
           </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center space-x-4">
          <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold flex items-center hover:bg-blue-700 transition-colors shadow-sm">
             <Save size={18} className="mr-2" /> 변경사항 저장
          </button>
          {showSuccess && (
              <span className="text-green-600 text-sm font-bold flex items-center animate-pulse">
                  <CheckCircle size={16} className="mr-1" /> 저장되었습니다.
              </span>
          )}
        </div>
      </form>
    </div>
  );
};

const ServicesManager: React.FC<{ 
  services: ServiceItem[], 
  onUpdate: (items: ServiceItem[]) => void,
  onAdd: (item: ServiceItem) => void,
  onDelete: (id: string) => void
}> = ({ services, onUpdate, onAdd, onDelete }) => {
  const [items, setItems] = useState<ServiceItem[]>(services);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync state with props when props change (important for deletions via context)
  useEffect(() => {
    setItems(services);
  }, [services]);

  const handleChange = (index: number, field: keyof ServiceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleDetailChange = (serviceIndex: number, detailIndex: number, value: string) => {
    const newItems = [...items];
    newItems[serviceIndex].details[detailIndex] = value;
    setItems(newItems);
  };

  const handleSave = () => {
    onUpdate(items);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  const handleAddNew = () => {
    const newItem: ServiceItem = {
      id: `service-${Date.now()}`,
      title: '새로운 기술 서비스',
      description: '서비스에 대한 설명을 입력하세요.',
      details: ['세부 항목 1', '세부 항목 2'],
      iconName: 'Building2'
    };
    onAdd(newItem);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      onDelete(id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-xl font-bold text-slate-800">핵심 기술(Service) 콘텐츠 관리</h2>
         <div className="flex items-center space-x-4">
            {showSuccess && (
                <span className="text-green-600 text-sm font-bold flex items-center animate-pulse">
                    <CheckCircle size={16} className="mr-1" /> 저장됨
                </span>
            )}
            <button onClick={handleAddNew} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold flex items-center hover:bg-slate-800 transition-colors shadow-sm text-sm">
               <Plus size={16} className="mr-2" /> 서비스 추가
            </button>
            <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center hover:bg-blue-700 transition-colors shadow-sm text-sm">
               <Save size={16} className="mr-2" /> 전체 저장
            </button>
         </div>
      </div>
      
      <div className="space-y-8">
        {items.map((item, idx) => (
          <div key={item.id} className="border border-slate-200 rounded-lg p-6 bg-slate-50 relative group">
            <button 
               onClick={() => handleDelete(item.id)}
               className="absolute top-4 right-4 text-slate-400 hover:text-red-500 p-1 bg-white border border-slate-200 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
               title="삭제"
            >
               <Trash2 size={16} />
            </button>

            <h3 className="font-bold text-lg mb-4 flex items-center text-slate-700">
              <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">{idx + 1}</span>
              {item.title}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <div>
                 <label className="block text-xs font-bold mb-1 text-slate-500">제목</label>
                 <input 
                    value={item.title}
                    onChange={(e) => handleChange(idx, 'title', e.target.value)}
                    className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
                 />
               </div>
               <div>
                 <label className="block text-xs font-bold mb-1 text-slate-500">아이콘</label>
                 <select 
                    value={item.iconName}
                    onChange={(e) => handleChange(idx, 'iconName', e.target.value)}
                    className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none bg-white"
                 >
                   <option value="Building2">Building2 (건물)</option>
                   <option value="ShieldCheck">ShieldCheck (방패/안전)</option>
                   <option value="Activity">Activity (차트/효율)</option>
                   <option value="HardHat">HardHat (안전모/시공)</option>
                   <option value="FileText">FileText (문서/자문)</option>
                   <option value="Shield">Shield (방패)</option>
                   <option value="CheckCircle">CheckCircle (체크)</option>
                   <option value="TrendingUp">TrendingUp (상승)</option>
                 </select>
               </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-xs font-bold mb-1 text-slate-500">설명</label>
              <textarea 
                rows={2}
                value={item.description}
                onChange={(e) => handleChange(idx, 'description', e.target.value)}
                className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-500">상세 항목 (목록)</label>
              <div className="space-y-2">
                 {item.details.map((detail, dIdx) => (
                   <div key={dIdx} className="flex items-center">
                     <ChevronRight size={16} className="text-slate-400 mr-2" />
                     <input 
                        value={detail}
                        onChange={(e) => handleDetailChange(idx, dIdx, e.target.value)}
                        className="flex-1 border border-slate-300 p-1.5 rounded focus:border-blue-500 outline-none text-sm"
                     />
                   </div>
                 ))}
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
           <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
              <p className="text-slate-400 mb-4">등록된 서비스가 없습니다.</p>
              <button onClick={handleAddNew} className="text-blue-600 font-bold hover:underline">첫 서비스 추가하기</button>
           </div>
        )}
      </div>
    </div>
  );
};

const WhyUsManager: React.FC<{ content: WhyUsContent, onUpdate: (content: WhyUsContent) => void }> = ({ content, onUpdate }) => {
  const [formData, setFormData] = useState(content);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleItemChange = (index: number, field: keyof typeof formData.items[0], value: string) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-6">메인: Why Us 섹션 관리</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
          <div className="mb-4">
             <label className="block text-sm font-bold mb-1 text-slate-700">섹션 제목</label>
             <input 
               value={formData.title} 
               onChange={e => setFormData({...formData, title: e.target.value})}
               className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
             />
          </div>
          <div>
             <label className="block text-sm font-bold mb-1 text-slate-700">부연 설명 (서브타이틀)</label>
             <textarea 
               rows={2}
               value={formData.subtitle} 
               onChange={e => setFormData({...formData, subtitle: e.target.value})}
               className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
             />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-blue-600 text-sm uppercase">3가지 핵심 가치 아이템</h3>
          {formData.items.map((item, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg p-4 bg-white">
               <div className="flex justify-between items-center mb-3">
                 <span className="font-bold text-slate-700 text-sm">카드 {idx + 1}</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                 <div>
                    <label className="block text-xs font-bold mb-1 text-slate-500">아이콘</label>
                    <select 
                      value={item.iconName}
                      onChange={e => handleItemChange(idx, 'iconName', e.target.value)}
                      className="w-full border border-slate-300 p-2 rounded text-sm focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="Shield">Shield (방패/인증)</option>
                      <option value="CheckCircle">CheckCircle (체크/완료)</option>
                      <option value="TrendingUp">TrendingUp (상승/성과)</option>
                      <option value="Activity">Activity (활동/차트)</option>
                      <option value="HardHat">HardHat (안전모)</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold mb-1 text-slate-500">제목</label>
                    <input 
                      value={item.title} 
                      onChange={e => handleItemChange(idx, 'title', e.target.value)}
                      className="w-full border border-slate-300 p-2 rounded text-sm focus:border-blue-500 outline-none"
                    />
                 </div>
               </div>
               <div>
                  <label className="block text-xs font-bold mb-1 text-slate-500">설명 내용</label>
                  <textarea 
                    rows={2}
                    value={item.description} 
                    onChange={e => handleItemChange(idx, 'description', e.target.value)}
                    className="w-full border border-slate-300 p-2 rounded text-sm focus:border-blue-500 outline-none"
                  />
               </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center space-x-4">
          <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold flex items-center hover:bg-blue-700 transition-colors shadow-sm">
             <Save size={18} className="mr-2" /> 변경사항 저장
          </button>
          {showSuccess && (
              <span className="text-green-600 text-sm font-bold flex items-center animate-pulse">
                  <CheckCircle size={16} className="mr-1" /> 저장되었습니다.
              </span>
          )}
        </div>
      </form>
    </div>
  );
};

const AboutManager: React.FC<{ content: any, onUpdate: (content: any) => void }> = ({ content, onUpdate }) => {
  const [formData, setFormData] = useState(content);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-6">회사 소개(About) 페이지 관리</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Header */}
        <div className="border-b border-slate-100 pb-6">
          <h3 className="font-bold text-blue-600 mb-4 text-sm uppercase">1. 상단 헤더 영역</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-700">페이지 제목</label>
              <input 
                value={formData.heroTitle} 
                onChange={e => setFormData({...formData, heroTitle: e.target.value})}
                className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-700">소개 문구</label>
              <textarea 
                rows={2}
                value={formData.heroDescription} 
                onChange={e => setFormData({...formData, heroDescription: e.target.value})}
                className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-700">헤더 배경 이미지 URL</label>
              <input 
                value={formData.heroImage} 
                onChange={e => setFormData({...formData, heroImage: e.target.value})}
                className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Philosophy */}
        <div className="border-b border-slate-100 pb-6">
          <h3 className="font-bold text-blue-600 mb-4 text-sm uppercase">2. 경영 철학 (Philosophy)</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-700">철학 헤드라인</label>
              <input 
                value={formData.philosophyTitle} 
                onChange={e => setFormData({...formData, philosophyTitle: e.target.value})}
                className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-700">설명 본문 1</label>
              <textarea 
                rows={3}
                value={formData.philosophyDesc1} 
                onChange={e => setFormData({...formData, philosophyDesc1: e.target.value})}
                className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-700">설명 본문 2</label>
              <textarea 
                rows={2}
                value={formData.philosophyDesc2} 
                onChange={e => setFormData({...formData, philosophyDesc2: e.target.value})}
                className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
              />
            </div>
             <div>
              <label className="block text-sm font-bold mb-1 text-slate-700">철학 섹션 이미지 URL</label>
              <input 
                value={formData.philosophyImage} 
                onChange={e => setFormData({...formData, philosophyImage: e.target.value})}
                className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Stats */}
        <div className="border-b border-slate-100 pb-6">
          <h3 className="font-bold text-blue-600 mb-4 text-sm uppercase">3. 주요 통계 수치</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-700">업력 (년)</label>
              <input 
                value={formData.statYears} 
                onChange={e => setFormData({...formData, statYears: e.target.value})}
                className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-700">프로젝트 수</label>
              <input 
                value={formData.statProjects} 
                onChange={e => setFormData({...formData, statProjects: e.target.value})}
                className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-700">사고율</label>
              <input 
                value={formData.statSafeRate} 
                onChange={e => setFormData({...formData, statSafeRate: e.target.value})}
                className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Expertise */}
        <div>
           <h3 className="font-bold text-blue-600 mb-4 text-sm uppercase">4. 전문성 소개</h3>
           <div>
              <label className="block text-sm font-bold mb-1 text-slate-700">하단 전문성 상세 문구</label>
              <textarea 
                rows={4}
                value={formData.expertiseText} 
                onChange={e => setFormData({...formData, expertiseText: e.target.value})}
                className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
              />
            </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center space-x-4">
          <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold flex items-center hover:bg-blue-700 transition-colors shadow-sm">
             <Save size={18} className="mr-2" /> 변경사항 저장
          </button>
          {showSuccess && (
              <span className="text-green-600 text-sm font-bold flex items-center animate-pulse">
                  <CheckCircle size={16} className="mr-1" /> 저장되었습니다.
              </span>
          )}
        </div>
      </form>
    </div>
  );
};

const InquiryManager: React.FC<{ 
  inquiries: any[], 
  onUpdateStatus: (id: string, status: any) => void,
  onDelete: (id: string) => void
}> = ({ inquiries, onUpdateStatus, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">상담 문의 목록</h2>
        <span className="text-sm text-slate-500">총 {inquiries.length}건</span>
      </div>
      {inquiries.length === 0 ? (
        <div className="p-12 text-center text-slate-500 flex flex-col items-center">
          <Inbox size={48} className="text-slate-300 mb-4" />
          <p>아직 접수된 문의가 없습니다.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className={`p-6 hover:bg-slate-50 transition-colors ${inquiry.status === 'new' ? 'bg-blue-50/40' : ''}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    inquiry.status === 'new' ? 'bg-red-100 text-red-600' : 
                    inquiry.status === 'contacted' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {inquiry.status === 'new' ? '신규' : inquiry.status === 'contacted' ? '완료' : '읽음'}
                  </span>
                  <span className="text-sm text-slate-400">{new Date(inquiry.date).toLocaleString()}</span>
                </div>
                <div className="flex space-x-2">
                  {inquiry.status !== 'contacted' && (
                    <button 
                      onClick={() => onUpdateStatus(inquiry.id, 'contacted')}
                      className="p-2 text-green-600 hover:bg-green-100 rounded transition-colors" title="처리 완료로 변경"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => { if(window.confirm('정말 삭제하시겠습니까?')) onDelete(inquiry.id); }}
                    className="p-2 text-red-400 hover:bg-red-100 rounded transition-colors" title="삭제"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="mb-2">
                <h3 className="font-bold text-lg text-slate-800 flex items-center">
                  {inquiry.name} 
                  {inquiry.company && <span className="ml-2 text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded">🏢 {inquiry.company}</span>}
                </h3>
                <p className="text-sm text-blue-600 font-medium mt-1">{inquiry.phone}</p>
              </div>
              <div className="bg-white p-4 rounded-lg text-sm text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-200 shadow-sm mt-3">
                <span className="font-bold text-slate-500 block mb-2 text-xs uppercase tracking-wider">[{inquiry.category}]</span>
                {inquiry.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const HeroManager: React.FC<{ content: any, onUpdate: (content: any) => void }> = ({ content, onUpdate }) => {
  const [formData, setFormData] = useState(content);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-6">메인 화면 (Hero Section) 수정</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
           <label className="block text-sm font-bold mb-1 text-slate-700">메인 헤드라인</label>
           <textarea 
             rows={2}
             value={formData.headline} 
             onChange={e => setFormData({...formData, headline: e.target.value})}
             className="w-full border border-slate-300 p-3 rounded focus:border-blue-500 outline-none"
             placeholder="큰 제목을 입력하세요"
           />
        </div>
        <div>
           <label className="block text-sm font-bold mb-1 text-slate-700">서브 설명문</label>
           <textarea 
             rows={3}
             value={formData.subheadline} 
             onChange={e => setFormData({...formData, subheadline: e.target.value})}
             className="w-full border border-slate-300 p-3 rounded focus:border-blue-500 outline-none"
             placeholder="부연 설명을 입력하세요"
           />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-700">버튼 1 텍스트</label>
            <input 
              value={formData.ctaPrimary} 
              onChange={e => setFormData({...formData, ctaPrimary: e.target.value})}
              className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-700">버튼 2 텍스트</label>
            <input 
              value={formData.ctaSecondary} 
              onChange={e => setFormData({...formData, ctaSecondary: e.target.value})}
              className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
            />
          </div>
        </div>
        <div>
           <label className="block text-sm font-bold mb-1 text-slate-700">배경 이미지 URL</label>
           <input 
             value={formData.bgImage} 
             onChange={e => setFormData({...formData, bgImage: e.target.value})}
             className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
             placeholder="https://..."
           />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center space-x-4">
          <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold flex items-center hover:bg-blue-700 transition-colors shadow-sm">
             <Save size={18} className="mr-2" /> 변경사항 저장
          </button>
          {showSuccess && (
              <span className="text-green-600 text-sm font-bold flex items-center animate-pulse">
                  <CheckCircle size={16} className="mr-1" /> 저장되었습니다.
              </span>
          )}
        </div>
      </form>
    </div>
  );
};

const PortfolioManager: React.FC<{
  items: PortfolioItem[],
  onAdd: (item: PortfolioItem) => void,
  onUpdate: (item: PortfolioItem) => void,
  onDelete: (id: string) => void
}> = ({ items, onAdd, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<Partial<PortfolioItem>>({});

  const handleEdit = (item: PortfolioItem) => {
    setEditItem(item);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setEditItem({
      id: '', title: '', category: '구조설계', description: '', solution: '', result: '', 
      imageUrl: 'https://picsum.photos/800/600'
    });
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem.title) return;

    if (editItem.id) {
      onUpdate(editItem as PortfolioItem);
    } else {
      onAdd({ ...editItem, id: Date.now().toString() } as PortfolioItem);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">{editItem.id ? '실적 수정' : '새 실적 추가'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-700">프로젝트명</label>
              <input 
                value={editItem.title} 
                onChange={e => setEditItem({...editItem, title: e.target.value})}
                className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none" required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-700">카테고리</label>
              <select 
                value={editItem.category} 
                onChange={e => setEditItem({...editItem, category: e.target.value})}
                className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none"
              >
                <option>구조설계</option>
                <option>안전진단</option>
                <option>성능평가</option>
                <option>기타</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-700">이미지 URL</label>
            <input 
              value={editItem.imageUrl} 
              onChange={e => setEditItem({...editItem, imageUrl: e.target.value})}
              className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none" 
              placeholder="https://..."
            />
            <p className="text-xs text-slate-400 mt-1">실제 이미지 호스팅 주소를 입력하세요. (예: Unsplash, Imgur 등)</p>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-700">문제 상황 (Challenge)</label>
            <textarea 
              value={editItem.description} 
              onChange={e => setEditItem({...editItem, description: e.target.value})}
              className="w-full border border-slate-300 p-2 rounded h-20 focus:border-blue-500 outline-none" required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-700">해결 방법 (Solution)</label>
            <textarea 
              value={editItem.solution} 
              onChange={e => setEditItem({...editItem, solution: e.target.value})}
              className="w-full border border-slate-300 p-2 rounded h-20 focus:border-blue-500 outline-none" required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-slate-700">결과 및 성과 (Result)</label>
            <textarea 
              value={editItem.result} 
              onChange={e => setEditItem({...editItem, result: e.target.value})}
              className="w-full border border-slate-300 p-2 rounded h-20 focus:border-blue-500 outline-none" required 
            />
          </div>
          <div className="flex space-x-3 pt-4 border-t border-slate-100 mt-4">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition-colors">저장하기</button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-slate-200 text-slate-700 px-6 py-2 rounded font-bold hover:bg-slate-300 transition-colors">취소</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">실적 관리</h2>
        <button onClick={handleCreate} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-slate-800 transition-colors shadow-sm">
          <Plus size={16} className="mr-2" /> 새 실적 등록
        </button>
      </div>
      <div className="p-6 grid grid-cols-1 gap-4">
        {items.map(item => (
          <div key={item.id} className="border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center bg-white hover:border-blue-300 transition-colors">
             <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover rounded-md bg-slate-100 border border-slate-200" />
             <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold text-slate-900">{item.title}</h3>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium mt-1 inline-block">{item.category}</span>
             </div>
             <div className="flex space-x-2">
               <button onClick={() => handleEdit(item)} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded text-sm hover:bg-slate-200 transition-colors font-medium">수정</button>
               <button onClick={() => { if(window.confirm('삭제하시겠습니까?')) onDelete(item.id); }} className="px-3 py-1.5 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100 transition-colors font-medium">삭제</button>
             </div>
          </div>
        ))}
        {items.length === 0 && (
           <div className="text-center py-10 text-slate-400">등록된 실적이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

const SettingsManager: React.FC<{
  info: any,
  onUpdate: (info: any) => void
}> = ({ info, onUpdate }) => {
  const [formData, setFormData] = useState(info);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    
    // Show success message without alert/reload
    setShowSuccess(true);
    setTimeout(() => {
        setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-6">회사 기본 정보 설정</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-bold mb-1 text-slate-700">회사명</label>
          <input 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none transition-all" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1 text-slate-700">대표자명</label>
          <input 
            value={formData.ceo} 
            onChange={e => setFormData({...formData, ceo: e.target.value})}
            className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none transition-all" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1 text-slate-700">전화번호</label>
          <input 
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})}
            className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none transition-all" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1 text-slate-700">이메일</label>
          <input 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})}
            className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none transition-all" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1 text-slate-700">주소</label>
          <input 
            value={formData.address} 
            onChange={e => setFormData({...formData, address: e.target.value})}
            className="w-full border border-slate-300 p-2 rounded focus:border-blue-500 outline-none transition-all" 
          />
        </div>
        
        <div className="pt-6 border-t border-slate-100 flex items-center space-x-4">
          <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold flex items-center hover:bg-blue-700 transition-colors shadow-sm">
             <Save size={18} className="mr-2" /> 변경사항 저장
          </button>
          
          {showSuccess && (
              <span className="text-green-600 text-sm font-bold flex items-center animate-pulse">
                  <CheckCircle size={16} className="mr-1" /> 성공적으로 저장되었습니다.
              </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminPanel;