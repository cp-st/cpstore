import React from 'react';
import { AnimatedShaderHero } from '../components/ui/animated-shader-hero';

const DemoHero = () => {
  return (
    <div className="bg-[#050505] min-h-screen">
      <AnimatedShaderHero 
        trustBadge={{ text: "Trusted by 500k+ users worldwide" }}
        headline={{
          line1: "The Future of",
          line2: "Social Growth"
        }}
        subtitle="Experience the most advanced SMM panel on the market. Real-time delivery, premium quality, and unbeatable prices."
        buttons={{
          primary: { text: "Get Started Now", onClick: () => console.log("Primary click") },
          secondary: { text: "View Services", onClick: () => console.log("Secondary click") }
        }}
      />
    </div>
  );
};

export default DemoHero;
