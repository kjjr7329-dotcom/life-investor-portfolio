import React, { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Portfolio: React.FC = () => {
  const { companyInfo, portfolioItems } = useApp();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    document.title = `${companyInfo.name} | 실적`;
  }, [companyInfo.name]);

  const categories = ['all', ...Array.from(new Set(portfolioItems.map(item => item.category)))];

  const filteredItems = filter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header - Dark Hero Style */}
      <section className="bg-slate-900 text-white pt-24 pb-16 md:pt-32 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <img src="https://picsum.photos/id/48/1920/600" alt="Architecture Structure" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-slate-900/60"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">주요 실적</h1>
          <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {companyInfo.name}가 해결해 온 수많은 현장의 과제들.<br/>
            문제 해결의 과정과 결과를 확인해보세요.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white border-b border-slate-200 sticky top-[64px] md:top-[72px] z-40 shadow-sm overflow-x-auto">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
            <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
                    filter === cat 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? '전체 보기' : cat}
                </button>
              ))}
            </div>
         </div>
      </section>

      {/* Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group flex flex-col h-full">
                {/* Image Area */}
                <div className="h-60 md:h-72 overflow-hidden relative">
                   <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60"></div>
                   <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-lg">
                     {item.category}
                   </div>
                </div>

                {/* Content Area */}
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                  
                  <div className="space-y-4 md:space-y-6 flex-1">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Challenge (과제)</h4>
                      <p className="text-slate-700 text-sm leading-relaxed">{item.description}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 flex items-center">
                         Solution (해결)
                      </h4>
                      <p className="text-slate-800 font-medium text-sm leading-relaxed">{item.solution}</p>
                    </div>
                  </div>

                  <div className="mt-6 md:mt-8 pt-6 border-t border-slate-100">
                    <div className="flex items-start">
                        <div className="bg-green-100 text-green-600 p-1 rounded-full mr-3 mt-0.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div>
                             <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Result (성과)</h4>
                             <p className="text-slate-900 font-bold text-sm md:text-base">{item.result}</p>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-400 mb-2">조건에 맞는 실적이 없습니다.</p>
                <button onClick={() => setFilter('all')} className="text-blue-600 font-bold hover:underline">전체 보기</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA - Increased Size to match Header */}
      <section className="bg-slate-900 text-white py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <img src="https://picsum.photos/id/20/1920/600" alt="Consultation" className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-slate-900/60"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8">상담 신청</h2>
          <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 md:mb-12">
            전문가의 도움이 필요하신가요?<br/>
            귀하의 프로젝트를 위한 최적의 엔지니어링 솔루션을 제안해 드립니다.
          </p>
          <NavLink 
            to="/contact" 
            className="inline-flex items-center px-10 py-4 md:px-12 md:py-5 bg-blue-600 text-white rounded-full font-bold text-lg md:text-xl hover:bg-blue-500 transition-all hover:scale-105 shadow-lg shadow-blue-900/50"
          >
            상담 신청하기 <ArrowRight className="ml-2" size={24} />
          </NavLink>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;