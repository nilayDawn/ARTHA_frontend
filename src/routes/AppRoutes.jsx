import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/routes/ProtectedRoute';
import Layout from '@/components/layout/Layout';
import SkeletonLoader from '@/components/common/SkeletonLoader';

// Lazy-loaded Domain Features
const LandingPage = lazy(() => import('@/features/landing/pages/LandingPage'));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const SignupPage = lazy(() => import('@/features/auth/pages/SignupPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const TransactionsPage = lazy(() => import('@/features/transactions/pages/TransactionsPage'));
const BudgetsPage = lazy(() => import('@/features/budgets/pages/BudgetsPage'));
const GoalsPage = lazy(() => import('@/features/goals/pages/GoalsPage'));
const DocumentsPage = lazy(() => import('@/features/documents/pages/DocumentsPage'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<SkeletonLoader type="page" />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Dashboard & Operations Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
          </Route>
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
