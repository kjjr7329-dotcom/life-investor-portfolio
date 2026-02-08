import React, { useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, CalendarClock } from 'lucide-react';
// 👇 방금 만드신 데이터 파일을 가져옵니다!
import { activitiesData } from '../data/activitiesData'; 

const Activities: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 좌우 스크롤 버튼 기능
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -340 : 340, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <section className="py-16 md:py-32 px-0 md:px-6 w-full bg-[#1A1A1A] relative" id="activities">
      <div className="max-w-7xl mx-auto mb-8 px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        
        {/* 1. 제목 섹션 */}
        <div className="group relative">
          <div className="flex items-center gap-3">
            <CalendarClock className="text-[#D9F99D] hidden md:block" size={36} />
            <h2 className="text-2xl md:text-5xl font-bold text-white tracking-tight">
              최신 근황
            </h2>
          </div>
          <p className="text-sm md:text-lg text-gray-400 font-serif-KR mt-2 ml-1">
            가끔, 소소한 일상을 전합니다.
          </p>
        </div>

        {/* 2. 화살표 버튼 (PC에서만 보임) */}
        <div className="hidden md:flex gap-2">
          <button onClick={() => scroll('left')} className="p-3 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll('right')} className="p-3 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* 3. 사진 카드 리스트 (가로 스크롤) */}
      <div 
        ref={scrollRef} 
        className="flex gap-4 md:gap-6 overflow-x-auto pb-12 scrollbar-hide px-6 snap-x snap-mandatory"
      >
        {/* 데이터 파일에 있는 내용을 하나씩 꺼내서 보여줍니다 */}
        {activitiesData.map((activity) => (
          <div 
            key={activity.id} 
            className="snap-center flex-shrink-0 w-[85vw] md:w-[350px] relative group"
          >
            <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 hover:border-[#D9F99D]/50 transition-colors h-full flex flex-col shadow-lg">
              
              {/* 이미지 영역 */}
              <div className="h-64 md:h-48 bg-zinc-800 relative overflow-hidden">
                <img 
                  src={activity.imageUrl} 
                  alt={activity.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy" 
                />
              </div>

              {/* 글자 영역 */}
              <div className="p-6 md:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#D9F99D] text-sm mb-3">
                    <Calendar size={14} />
                    <span>{activity.date}</span>
                  </div>
                  <h3 className="text-xl md:text-xl font-bold text-white mb-2 line-clamp-1">
                    {activity.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Activities;