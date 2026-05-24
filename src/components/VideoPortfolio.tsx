import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, CheckCircle2, Play, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { videoPortfolioData, PortfolioItem } from '../data/portfolioData';
import { cn } from '../lib/utils';

const VideoPortfolio = () => {
  const { lang, isRtl } = useTranslation();
  const videoPortfolio = videoPortfolioData(lang as 'ar' | 'en');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // دالة ذكية لجمع الصور والفيديوهات
  const getMediaList = (item: PortfolioItem | null) => {
    if (!item) return [];
    const media: { type: 'video' | 'image', url: string }[] = [];
    if (item.videoUrls && item.videoUrls.length > 0) {
      item.videoUrls.forEach(url => media.push({ type: 'video', url }));
    } else if (item.videoUrl) {
      media.push({ type: 'video', url: item.videoUrl });
    }
    if (item.imageUrls && item.imageUrls.length > 0) {
      item.imageUrls.forEach(url => media.push({ type: 'image', url }));
    }
    return media;
  };

  const currentMediaList = getMediaList(selectedItem);

  const openItem = (item: PortfolioItem) => {
    setSelectedItem(item);
    setCurrentIndex(0);
  };

  const closeItem = () => {
    setSelectedItem(null);
    setCurrentIndex(0);
  };

  const nextMedia = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentMediaList.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % currentMediaList.length);
  };

  const prevMedia = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentMediaList.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + currentMediaList.length) % currentMediaList.length);
  };

  return (
    <motion.div
      id="video-portfolio-grid"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="text-center md:text-right">
          <h3 className="text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {lang === 'ar' ? 'صناعة الفيديو وإبداعاتنا السابقة' : 'Video Production & Our Creative Work'}
          </h3>
          <p className="text-white/40 text-sm font-medium">
            {lang === 'ar' ? 'نصنع محتوى مرئي يترك أثراً دائماً على جمهورك' : 'Creating visual content that leaves a lasting impact'}
          </p>
        </div>

        <button
          onClick={() => {
            const el = document.getElementById('portfolio-video-grid-start');
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="group flex items-center gap-3 px-8 py-4 bg-blue-600/10 border-2 border-blue-500/50 rounded-2xl text-white font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:border-blue-400 transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]"
        >
          <Video className="w-5 h-5 group-hover:animate-pulse" />
          {lang === 'ar' ? 'عرض ملف أعمالنا الكامل' : 'View Full Portfolio File'}
        </button>
      </div>

      {/* الكروت بالتصميم السينمائي الأصلي */}
      <div id="portfolio-video-grid-start" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {videoPortfolio.map((work) => (
          <motion.div
            key={work.id}
            whileHover={{ y: -8 }}
            className="group relative rounded-[2rem] overflow-hidden cursor-pointer h-[260px] md:h-[280px] border border-white/5 shadow-2xl bg-[#0F0F12] hover:border-blue-500/50 transition-all"
            onClick={() => openItem(work)}
          >
            <img
              src={work.thumbnail}
              alt={work.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-40 group-hover:opacity-100 grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent flex flex-col justify-end p-6">
              
              <div className="absolute top-4 left-4 flex gap-1">
                {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-blue-500/50 rounded-full" />)}
              </div>

              <div className="relative z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="inline-block px-3 py-1 bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {work.category}
                </span>
                <h4 className="text-xl font-black text-white mb-2 leading-tight">{work.title}</h4>
                <p className="text-white/40 text-xs font-medium line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  {work.description}
                </p>
                
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-400 hover:text-white transition-colors">
                    {work.imageUrls && work.imageUrls.length > 0 && !work.videoUrl && (!work.videoUrls || work.videoUrls.length === 0) ? (
                      <><ImageIcon className="w-4 h-4" /> {lang === 'ar' ? 'مشاهدة الصور' : 'View Images'}</>
                    ) : (
                      <><Play className="w-4 h-4" /> {lang === 'ar' ? 'مشاهدة الفيديو' : 'Play Video'}</>
                    )}
                  </button>
                  <div className="h-4 w-px bg-white/10" />
                  <span className="text-[10px] text-white/20 font-mono">0:30 MAX</span>
                </div>
              </div>
            </div>

            {/* الأيقونة في المنتصف */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
              <div className="w-16 h-16 rounded-full bg-blue-600/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                {work.imageUrls && work.imageUrls.length > 0 && !work.videoUrl && (!work.videoUrls || work.videoUrls.length === 0) ? (
                   <ImageIcon className="w-8 h-8 text-white" />
                ) : (
                   <Play className="w-8 h-8 text-white fill-white translate-x-0.5" />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* شاشة العرض (Modal) */}
      <AnimatePresence>
        {selectedItem && currentMediaList.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4"
            onClick={closeItem}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl bg-[#0F0F12] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              
              <div className="absolute top-0 left-0 w-full p-4 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
                <div className={isRtl ? 'text-right' : 'text-left'}>
                  <h3 className="text-white font-black text-lg sm:text-xl line-clamp-1">{selectedItem.title}</h3>
                  {currentMediaList.length > 1 && (
                    <p className="text-white/40 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">
                      {lang === 'ar' ? `محتوى ${currentIndex + 1} من ${currentMediaList.length}` : `Media ${currentIndex + 1} of ${currentMediaList.length}`}
                    </p>
                  )}
                </div>
                <button 
                  onClick={closeItem}
                  className="p-2 sm:p-3 bg-white/5 border border-white/10 rounded-full text-white/50 hover:bg-white hover:text-black transition-all"
                >
                  <X className="w-5 h-5 sm:w-6 h-6" />
                </button>
              </div>

              <div className="relative flex-1 aspect-video flex items-center justify-center bg-black group/modal">
                {currentMediaList[currentIndex].type === 'video' ? (
                  <iframe
                    className="w-full h-full absolute inset-0 border-none"
                    src={`${currentMediaList[currentIndex].url}?autoplay=1&rel=0&modestbranding=1`}
                    title={selectedItem.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <img 
                    src={currentMediaList[currentIndex].url} 
                    alt={selectedItem.title}
                    className="w-full h-full object-contain"
                  />
                )}

                {currentMediaList.length > 1 && (
                  <>
                    <button
                      onClick={prevMedia}
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-blue-600 transition-all opacity-0 group-hover/modal:opacity-100 z-50",
                        isRtl ? "right-4" : "left-4"
                      )}
                    >
                      {isRtl ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                    </button>
                    <button
                      onClick={nextMedia}
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-blue-600 transition-all opacity-0 group-hover/modal:opacity-100 z-50",
                        isRtl ? "left-4" : "right-4"
                      )}
                    >
                      {isRtl ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                    </button>
                  </>
                )}
              </div>
              
              <div className="p-4 sm:p-6 border-t border-white/5 bg-black/40 flex items-center justify-between">
                <div className="flex gap-2">
                   {currentMediaList.map((_, i) => (
                     <div 
                       key={i} 
                       className={cn(
                         "h-1 rounded-full transition-all duration-300",
                         i === currentIndex ? "w-8 bg-blue-500" : "w-2 bg-white/10"
                       )} 
                     />
                   ))}
                </div>
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Control P Production</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 bg-white/5 border border-white/5 rounded-3xl p-6">
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <CheckCircle2 className="w-5 h-5 text-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{lang === 'ar' ? 'جودة 4K' : '4K Quality'}</span>
        </div>
        <div className="flex items-center gap-3 justify-center md:justify-start border-l border-white/5 md:pl-4">
          <CheckCircle2 className="w-5 h-5 text-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{lang === 'ar' ? 'سكريبت احترافي' : 'Pro Script'}</span>
        </div>
        <div className="flex items-center gap-3 justify-center md:justify-start border-l border-white/5 md:pl-4">
          <CheckCircle2 className="w-5 h-5 text-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{lang === 'ar' ? 'مونتاج متكامل' : 'Master Editing'}</span>
        </div>
        <div className="flex items-center gap-3 justify-center md:justify-start border-l border-white/5 md:pl-4">
          <CheckCircle2 className="w-5 h-5 text-blue-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{lang === 'ar' ? 'تسليم سريع' : 'Fast Sync'}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoPortfolio;