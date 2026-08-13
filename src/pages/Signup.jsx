import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import ArthaLogo from '../components/ArthaLogo';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

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
            Create Your Account
          </h2>
          <p className="text-xs text-[#8A8F8D]">
            Start managing your wealth with purpose and AI assistance
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form className="space-y-4" onSubmit={handleSignup}>
          <div className="space-y-3.5">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8F8D] block mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8A8F8D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#050505] border border-[rgba(255,255,255,0.08)] rounded-xl text-xs text-[#F2F2F2] placeholder-[#8A8F8D]/50 focus:outline-none focus:border-[#00D9A5] transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8F8D] block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A8F8D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#050505] border border-[rgba(255,255,255,0.08)] rounded-xl text-xs text-[#F2F2F2] placeholder-[#8A8F8D]/50 focus:outline-none focus:border-[#00D9A5] transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8F8D] block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8A8F8D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#050505] border border-[rgba(255,255,255,0.08)] rounded-xl text-xs text-[#F2F2F2] placeholder-[#8A8F8D]/50 focus:outline-none focus:border-[#00D9A5] transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#00D9A5] hover:bg-[#00B88C] text-[#050505] font-bold text-xs rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(0,217,165,0.2)] cursor-pointer mt-2"
          >
            {loading ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>

        <div className="pt-3 border-t border-[rgba(255,255,255,0.08)] text-center text-xs text-[#8A8F8D]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#00D9A5] hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Signup;