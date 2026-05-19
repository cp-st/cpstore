import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, CheckCircle2, Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { videoPortfolioData, PortfolioItem } from '../data/portfolioData';
import { cn } from '../lib/utils';

const VideoPortfolio = () => {
  const { lang, isRtl } = useTranslation();
  const videoPortfolio = videoPortfolioData(lang as 'ar' | 'en');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const openVideo = (item: PortfolioItem) => {
    setSelectedItem(item);
    setCurrentVideoIndex(0);
  };

  const closeVideo = () => {
    setSelectedItem(null);
    setCurrentVideoIndex(0);
  };

  const nextVideo = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedItem || !selectedItem.videoUrls) return;
    setCurrentVideoIndex((prev) => (prev + 1) % selectedItem.videoUrls!.length);
  };

  const prevVideo = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedItem || !selectedItem.videoUrls) return;
    setCurrentVideoIndex((prev) => (prev - 1 + selectedItem.videoUrls!.length) % selectedItem.videoUrls!.length);
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

      <div id="portfolio-video-grid-start" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {videoPortfolio.map((work) => (
          <motion.div 
            key={work.id} 
            whileHover={{ y: -8 }}
            onClick={() => openVideo(work)}
            className="relative bg-[#0F0F12] border border-white/5 rounded-[2rem] overflow-hidden group hover:border-blue-500/50 transition-all shadow-2xl cursor-pointer"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img 
                src={work.thumbnail} 
                alt={work.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100" 
              />
              
              {/* Overlay with technical data effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
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
                      <Play className="w-4 h-4" />
                      {lang === 'ar' ? 'مشاهدة الفيديو' : 'Play Video'}
                    </button>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-[10px] text-white/20 font-mono">0:30 MAX</span>
                  </div>
                </div>
              </div>

              {/* Central Play Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                 <div className="w-16 h-16 rounded-full bg-blue-600/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                    <Play className="w-8 h-8 text-white fill-white" />
                 </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
            onClick={closeVideo}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl bg-[#0F0F12] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full p-4 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
                <div className={isRtl ? 'text-right' : 'text-left'}>
                  <h3 className="text-white font-black text-lg sm:text-xl line-clamp-1">{selectedItem.title}</h3>
                  {selectedItem.videoUrls && selectedItem.videoUrls.length > 1 && (
                    <p className="text-white/40 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1">
                      {lang === 'ar' ? `فيديو ${currentVideoIndex + 1} من ${selectedItem.videoUrls.length}` : `Video ${currentVideoIndex + 1} of ${selectedItem.videoUrls.length}`}
                    </p>
                  )}
                </div>
                <button 
                  onClick={closeVideo}
                  className="p-2 sm:p-3 bg-white/5 border border-white/10 rounded-full text-white/50 hover:bg-white hover:text-black transition-all"
                >
                  <X className="w-5 h-5 sm:w-6 h-6" />
                </button>
              </div>
              
              <div className="relative flex-1 aspect-video bg-black group/modal">
                <iframe
                  key={selectedItem.videoUrls ? selectedItem.videoUrls[currentVideoIndex] : selectedItem.videoUrl}
                  src={`${selectedItem.videoUrls ? selectedItem.videoUrls[currentVideoIndex] : selectedItem.videoUrl}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedItem.title}
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>

                {selectedItem.videoUrls && selectedItem.videoUrls.length > 1 && (
                  <>
                    <button 
                      onClick={prevVideo}
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-blue-600 transition-all opacity-0 group-hover/modal:opacity-100 z-30",
                        isRtl ? "right-4" : "left-4"
                      )}
                    >
                      {isRtl ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                    </button>
                    <button 
                      onClick={nextVideo}
                      className={cn(
                        "absolute top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-blue-600 transition-all opacity-0 group-hover/modal:opacity-100 z-30",
                        isRtl ? "left-4" : "right-4"
                      )}
                    >
                      {isRtl ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                    </button>
                  </>
                )}
              </div>

              {/* Decorative detail at bottom */}
              <div className="p-4 sm:p-6 border-t border-white/5 bg-black/40 flex items-center justify-between">
                <div className="flex gap-2">
                   {[...Array(selectedItem.videoUrls?.length || 1)].map((_, i) => (
                     <div 
                       key={i} 
                       className={cn(
                         "h-1 rounded-full transition-all duration-300",
                         i === currentVideoIndex ? "w-8 bg-blue-500" : "w-2 bg-white/10"
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
