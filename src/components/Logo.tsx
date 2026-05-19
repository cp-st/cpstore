import React from 'react';
import { Rocket } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from '../context/LanguageContext';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  iconSize = 28, 
  textSize = "text-2xl",
  showText = true 
}) => {
  const { t, isRtl } = useTranslation();

  return (
    <div className={cn("flex items-center gap-4 group select-none", className)}>
      <div className="relative shrink-0">
        <div className="absolute -inset-2 bg-gradient-to-br from-red-600/30 to-purple-600/30 rounded-2xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
        <div className="relative w-12 h-12 bg-red-600 border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20" />
           <Rocket 
             size={iconSize} 
             className="text-white relative z-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500 ease-out" 
           />
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col -space-y-0.5">
          <span className={cn("font-black tracking-widest text-white leading-tight", textSize)}>
            CP<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">STORE</span>
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 leading-none mb-1">
              {t('sliderHeaderTag')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
