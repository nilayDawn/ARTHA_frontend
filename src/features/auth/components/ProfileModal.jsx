import { useState } from 'react';
import { User, Mail, Shield, X, Save, CheckCircle2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectCurrentUser, selectUserProfile, setAuthState } from '@/redux/slices/authSlice';
import { selectIsProfileModalOpen, setProfileModalOpen } from '@/redux/slices/uiSlice';
import { supabase } from '@/lib/supabase';

function ProfileModalContent({ onClose, user, profile }) {
  const dispatch = useAppDispatch();
  const [fullName, setFullName] = useState(
    profile?.full_name || user?.user_metadata?.full_name || ''
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() },
      });

      if (updateError) throw updateError;

      dispatch(
        setAuthState({
          user: data.user,
          session: (await supabase.auth.getSession()).data.session,
        })
      );
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0D0D0D] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Your Profile</h2>
            <p className="text-xs text-slate-400">Manage account information and security</p>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-400 pl-10 cursor-not-allowed"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Email is managed by Supabase authentication</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white pl-10 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Account ID</label>
            <div className="relative">
              <input
                type="text"
                disabled
                value={user?.id || ''}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-[11px] font-mono text-slate-500 pl-10 cursor-not-allowed"
              />
              <Shield className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-semibold rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProfileModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsProfileModalOpen);
  const user = useAppSelector(selectCurrentUser);
  const profile = useAppSelector(selectUserProfile);

  if (!isOpen) return null;

  return (
    <ProfileModalContent
      onClose={() => dispatch(setProfileModalOpen(false))}
      user={user}
      profile={profile}
    />
  );
}
