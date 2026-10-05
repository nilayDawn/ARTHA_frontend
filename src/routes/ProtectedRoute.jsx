import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser, selectAuthLoading } from '@/redux/slices/authSlice';

export default function ProtectedRoute() {
  const user = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectAuthLoading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
