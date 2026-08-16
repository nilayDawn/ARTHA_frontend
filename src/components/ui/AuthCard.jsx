import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ArthaLogo from '../ArthaLogo';
import ErrorAlert from './ErrorAlert';

export default function AuthCard({ title, subtitle, error, children, footer }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-[#F2F2F2] px-4 py-8 antialiased selection:bg-[#00D9A5]/30 selection:text-[#00D9A5] relative overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#D6A84F]/10 via-[#00D9A5]/10 to-transparent blur-3xl pointer-events-none rounded-full opacity-50"></div>

      {/* Top Left Navigation Back to Home */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-medium text-[#8A8F8D] hover:text-[#F2F2F2] transition-colors bg-[#0B0F0E] px-3.5 py-2 rounded-xl border border-[rgba(255,255,255,0.08)] shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="max-w-md w-full space-y-6 bg-[#0B0F0E] p-7 sm:p-9 rounded-3xl border border-[rgba(255,255,255,0.08)] shadow-2xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <ArthaLogo size="lg" showText={true} tagline={true} className="justify-center" />
          </div>
          <h2 className="text-2xl font-bold text-[#F2F2F2] tracking-tight pt-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-[#8A8F8D]">
              {subtitle}
            </p>
          )}
        </div>

        {/* Error Notification */}
        {error && <ErrorAlert message={error} />}

        {/* Form Body */}
        {children}

        {/* Footer Link */}
        {footer && (
          <div className="pt-3 border-t border-[rgba(255,255,255,0.08)] text-center text-xs text-[#8A8F8D]">
            {footer}
          </div>
        )}

      </div>
    </div>
  );
}
