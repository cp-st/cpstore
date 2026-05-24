export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
  videoUrl?: string;
  videoUrls?: string[];
  imageUrls?: string[];
  description: string;
}

export const videoPortfolioData = (lang: 'ar' | 'en'): PortfolioItem[] => [
  { 
    id: 1, 
    title: lang === 'ar' ? 'إعلان سيارات سينمائي' : 'Cinematic Car Ad', 
    category: 'Commercial', 
    thumbnail: 'https://i.ibb.co/F4Yv2k4g/703823375-1304336901171438-4049694884618675991-n.jpg', 
    videoUrl: 'https://www.youtube.com/embed/Dz52n-pm6Xo', 
    videoUrls: [
      'https://www.youtube.com/embed/Dz52n-pm6Xo',
      'https://www.youtube.com/embed/Dz52n-pm6Xo',
      'https://www.youtube.com/embed/4-LYx3G1fbM'
    ],
    description: lang === 'ar' ? 'فيديو إعلاني للسيارات الفاخرة بجودة سينمائية كاملة.' : 'Cinematic commercial for luxury cars.' 
  },
  { 
    id: 2, 
    title: lang === 'ar' ? 'ريلز HOOK حماسية' : 'Exciting HOOK Reels', 
    category: 'Gaming', 
    thumbnail: 'https://i.ibb.co/Fq49dgmw/cp.png', 
    videoUrl: 'https://www.youtube.com/embed/LC5eJWHaleQ', 
    videoUrls: [
      'https://www.youtube.com/embed/HdOrEQL2VyA',
      'https://www.youtube.com/embed/VF3XekLxAAs'
    ],
    description: lang === 'ar' ? 'مونتاج سريع وحماسي لأهم لحظات الألعاب لمنصات التواصل.' : 'Fast-paced gaming highlights for social media.' 
  },
  { 
    id: 3, 
    title: lang === 'ar' ? 'أعلانات مطاعم وماكولات' : 'Restaurant & Food Ads', 
    category: 'Food', 
    thumbnail: 'https://i.ibb.co/ycf6kKVw/Gemini-Generated-Image-lqcwflqcw.png', 
    videoUrl: 'https://www.youtube.com/embed/jMB5xCkrEP0', 
    videoUrls: [
      'https://www.youtube.com/embed/jMB5xCkrEP0',
      'https://www.youtube.com/embed/f-O7mBaeV_k',
      'https://www.youtube.com/embed/L_GvO8x8Rik'
    ],
    description: lang === 'ar' ? 'تصوير جمالي للأطعمة والمشروبات بأسلوب يخطف العين.' : 'Beautiful food & beverage product shots.' 
  },
  { 
    id: 4, 
    title: lang === 'ar' ? 'إنتاج هوية فيديو متكاملة' : 'Full Video Identity', 
    category: 'Corporate', 
    thumbnail: 'https://i.ibb.co/YBMLrqC6/0517-6-Cover.jpg', 
    videoUrl: 'https://www.youtube.com/embed/aw3TdaasCp8', 
    videoUrls: [
      'https://www.youtube.com/embed/ox2VnReqWdk',
      'https://www.youtube.com/embed/aw3TdaasCp8'
    ],
    description: lang === 'ar' ? 'تصميم فكرة وإخراج فيديو يعكس الهوية البصرية للشركة.' : 'Creative concept and direction for brand identity.' 
  },
  { 
    id: 5, 
    title: lang === 'ar' ? 'ريلز منتجات تكنولوجية' : 'Tech Product Reels', 
    category: 'Tech', 
    thumbnail: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600', 
    videoUrl: 'https://www.youtube.com/embed/J7-36Bq2XkM', 
    videoUrls: [
      'https://www.youtube.com/embed/J7-36Bq2XkM',
      'https://www.youtube.com/embed/Uwpis2jKjVM',
      'https://www.youtube.com/embed/F6kPUpT_6iY'
    ],
    description: lang === 'ar' ? 'استعراض إبداعي لكفرات الموبايل المخصصة لهوية Control P.' : 'Creative showcase of custom phone cases for Control P identity.' 
  },
  { 
    id: 6, 
    title: lang === 'ar' ? 'فيديو عقاري جوي' : 'Aerial Real Estate', 
    category: 'Real Estate', 
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600', 
    videoUrl: 'https://www.youtube.com/embed/8kE-X9Y3W2w', 
    videoUrls: [
      'https://www.youtube.com/embed/8kE-X9Y3W2w',
      'https://www.youtube.com/embed/fA_E97pYcO8'
    ],
    description: lang === 'ar' ? 'جولة عقارية كاملة من الأعلى بجودة تصوير احترافية.' : 'Professional aerial real estate tour.' 
  },
  {
    id: 7,
    title: lang === 'ar' ? 'أعلانات عيادات طبية' : 'Medical Clinic Ads',
    category: 'Medical',
    thumbnail: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/8KDeR18V56k',
    videoUrls: [
      'https://www.youtube.com/embed/8KDeR18V56k',
      'https://www.youtube.com/embed/FAl6iB-Y-No'
    ],
    description: lang === 'ar' ? 'إنتاج محتوى مرئي احترافي للعيادات والمراكز الطبية.' : 'Professional visual content production for clinics and medical centers.'
  }
] ;
