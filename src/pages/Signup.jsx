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

  const handleGoogleLogin = async () => {
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (authError) {
        console.error('Google Auth Error:', authError.message);
        setError(authError.message);
      }
    } catch (err) {
      console.error('Unexpected error during Google login:', err);
      setError('Unexpected error initiating Google login.');
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

        {/* Google OAuth Signup Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-[#050505] hover:bg-[#121615] text-[#F2F2F2] font-medium text-xs rounded-xl border border-[rgba(255,255,255,0.1)] hover:border-[#D6A84F]/40 transition-all cursor-pointer shadow-sm group"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="group-hover:text-white transition-colors">Sign up with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-[rgba(255,255,255,0.08)] w-full"></div>
          <span className="bg-[#0B0F0E] px-3 text-[10px] uppercase font-semibold text-[#8A8F8D] absolute tracking-wider">
            Or with email
          </span>
        </div>

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