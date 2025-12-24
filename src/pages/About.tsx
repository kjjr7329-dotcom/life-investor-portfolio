import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Award, Users, ThumbsUp } from 'lucide-react';

const About: React.FC = () => {
  const { companyInfo, aboutContent } = useApp();

  useEffect(() => {
    document.title = `${companyInfo.name} | 회사소개`;
  }, [companyInfo.name]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header - Dark Hero Style */}
      <section className="bg-slate-900 text-white pt-24 pb-16 md:pt-32 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <img src={aboutContent.heroImage} alt="Team meeting" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-900/40"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">{aboutContent.heroTitle}</h1>
          <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
            {aboutContent.heroDescription}
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Our Philosophy</span>
              <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mt-2 mb-6 leading-tight">
                {aboutContent.philosophyTitle}
              </h2>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 whitespace-pre-line">
                {aboutContent.philosophyDesc1}
              </p>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed whitespace-pre-line">
                {aboutContent.philosophyDesc2}
              </p>
            </div>
            <div className="relative px-4 md:px-0">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full z-0 hidden md:block"></div>
              <img 
                src={aboutContent.philosophyImage} 
                alt="Engineer working" 
                className="relative z-10 rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Trust */}
      <section className="py-12 md:py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-6">
              <div className="flex justify-center mb-4 text-blue-600">
                <Award size={48} />
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{aboutContent.statYears}</h3>
              <p className="text-slate-600 font-medium">년의 업계 경력</p>
            </div>
            <div className="p-6">
              <div className="flex justify-center mb-4 text-blue-600">
                <Users size={48} />
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{aboutContent.statProjects}</h3>
              <p className="text-slate-600 font-medium">완료된 프로젝트</p>
            </div>
            <div className="p-6">
              <div className="flex justify-center mb-4 text-blue-600">
                <ThumbsUp size={48} />
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{aboutContent.statSafeRate}</h3>
              <p className="text-slate-600 font-medium">안전 사고율 Zero</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Areas Text Only */}
      <section className="py-16 md:py-32 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
           <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-10">우리의 전문성</h2>
           <p className="text-base md:text-lg text-slate-600 leading-7 md:leading-8 whitespace-pre-line">
             {aboutContent.expertiseText}
           </p>
        </div>
      </section>
    </div>
  );
};

export default About;