import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { ArrowRight, Building2, ShieldCheck, Activity, HardHat, FileText, HelpCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

// Icon mapping helper
const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: any } = {
    Building2, ShieldCheck, Activity, HardHat, FileText
  };
  return icons[iconName] || HelpCircle;
};

const Services: React.FC = () => {
  const { companyInfo, services } = useApp();
  
  useEffect(() => {
    document.title = `${companyInfo.name} | 기술소개`;
  }, [companyInfo.name]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Dark Hero Style */}
      <section className="bg-slate-900 text-white pt-24 pb-16 md:pt-32 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <img src="https://picsum.photos/id/60/1920/600" alt="Detailed blueprints" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-slate-900/50"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">기술 분야</h1>
          <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            구조적 난제를 해결하는 전문가의 시각.<br/>
            디에이만의 독보적인 기술 서비스를 소개합니다.
          </p>
        </div>
      </section>

      {/* Service Detail List */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-20">
          {services.map((service, index) => {
            const IconComponent = getIconComponent(service.iconName);
            return (
              <div key={service.id} className={`flex flex-col md:flex-row gap-8 md:gap-12 items-start ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                {/* Image/Visual Placeholder */}
                <div className="w-full md:w-1/2">
                   <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden shadow-lg group relative">
                      <img 
                        src={`https://picsum.photos/seed/${service.id}/800/600`} 
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-blue-900/0 transition-colors"></div>
                   </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2">
                  <div className="flex items-center space-x-4 mb-4 md:mb-6">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                      <IconComponent size={28} className="md:w-8 md:h-8" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{service.title}</h2>
                  </div>
                  
                  <p className="text-base md:text-lg text-slate-600 mb-6 md:mb-8 font-medium leading-relaxed border-l-4 border-blue-500 pl-4">
                    {service.description}
                  </p>

                  <div className="bg-slate-50 p-5 md:p-6 rounded-xl border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-4">주요 업무 범위</h3>
                    <ul className="space-y-3">
                      {service.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-sm md:text-base text-slate-600">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-slate-50 py-16 md:py-20 border-t border-slate-100">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 md:mb-6">
              귀하의 프로젝트에 적합한 기술이 궁금하신가요?
            </h2>
            <p className="text-slate-600 mb-8 md:mb-10 text-sm md:text-base">
              초기 계획 단계에서의 기술 자문은 전체 프로젝트의 퀄리티를 결정합니다.<br className="hidden md:block"/>
              지금 바로 전문가와 상의하십시오.
            </p>
            <NavLink to="/contact" className="inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors">
              기술 자문 요청하기 <ArrowRight className="ml-2" />
            </NavLink>
         </div>
      </section>
    </div>
  );
};

export default Services;