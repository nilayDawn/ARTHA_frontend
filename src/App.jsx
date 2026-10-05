import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { useAppDispatch } from '@/redux/hooks';
import { initializeAuth, setAuthState } from '@/redux/slices/authSlice';
import { supabase } from '@/lib/supabase';
import AppRoutes from '@/routes/AppRoutes';

function AuthSubscriber({ children }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 1. Initialize user session and profile on boot
    dispatch(initializeAuth());

    // 2. React to external auth events (OAuth callback, token refresh, logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(
        setAuthState({
          session,
          user: session?.user ?? null,
        })
      );
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return children;
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthSubscriber>
        <Router>
          <AppRoutes />
        </Router>
      </AuthSubscriber>
    </Provider>
  );
}