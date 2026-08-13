import React from 'react';
import logoImg from '../assets/logo.png';

export default function ArthaLogo({ size = 'md', showText = true, tagline = false, className = '' }) {
  const sizeMap = {
    xs: { icon: 'w-10 h-10', text: 'text-base', container: 'gap-2' },
    sm: { icon: 'w-12 h-12', text: 'text-lg', container: 'gap-2.5' },
    md: { icon: 'w-14 h-14', text: 'text-xl', container: 'gap-3' },
    lg: { icon: 'w-16 h-16', text: 'text-2xl', container: 'gap-3.5' },
    xl: { icon: 'w-18 h-18', text: 'text-4xl', container: 'gap-5' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center ${currentSize.container} ${className}`}>
      {/* ARTHA Lotus Logo Image */}
      <div className={`relative ${currentSize.icon} flex items-center justify-center shrink-0`}>
        <div className="w-full h-full rounded-full border-2 border-[#D6A84F]/80 bg-[#0B0F0E] shadow-[0_0_15px_rgba(214,168,79,0.35)] flex items-center justify-center overflow-hidden transition-transform hover:scale-105">
          <img 
            src={logoImg} 
            alt="ARTHA Logo" 
            className="w-full h-full object-contain scale-[1.45]" 
          />
        </div>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col justify-center">
          <span className={`font-extrabold tracking-tight text-[#D6A84F] ${currentSize.text} leading-tight block`}>
            ARTHA
          </span>
          {tagline && (
            <span className="text-[10px] font-medium text-neutral-400 block mt-0.5">
              Intelligent Financial Companion
            </span>
          )}
        </div>
      )}
    </div>
  );
}
