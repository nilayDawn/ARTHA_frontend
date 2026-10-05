import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { signUpWithEmail } from '@/redux/slices/authSlice';
import AuthCard from '@/components/common/AuthCard';
import GoogleAuthButton from '@/features/auth/components/GoogleAuthButton';
import SEOHead from '@/components/common/SEOHead';

const getInitialOAuthError = () => {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash;
  const search = window.location.search;
  const params = new URLSearchParams(hash.startsWith('#') ? hash.substring(1) : search);
  const errorDesc = params.get('error_description');
  if (!errorDesc) return null;
  const decoded = decodeURIComponent(errorDesc).replace(/\+/g, ' ');
  if (
    decoded.toLowerCase().includes('already registered') ||
    decoded.toLowerCase().includes('another provider')
  ) {
    return 'An account with this email address was created using Email & Password. Please log in with your email and password.';
  }
  return decoded;
};

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(getInitialOAuthError);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash || window.location.search.includes('error')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await dispatch(signUpWithEmail({ email, password, full_name: fullName }));
    if (signUpWithEmail.fulfilled.match(result)) {
      navigate('/dashboard');
    } else {
      setError(result.payload || 'Failed to create account. Please try again.');
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create Your Account"
      subtitle="Start managing your wealth with purpose and AI assistance"
      error={error}
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#00D9A5] hover:underline">
            Sign In
          </Link>
        </>
      }
    >
      <SEOHead
        title="Create Account"
        description="Register for an ARTHA AI account to automate expense tracking, budget planning, and financial decision-making."
      />
      {/* Google OAuth Signup Button */}
      <GoogleAuthButton text="Sign up with Google" onError={(errText) => setError(errText)} />

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
    </AuthCard>
  );
}
