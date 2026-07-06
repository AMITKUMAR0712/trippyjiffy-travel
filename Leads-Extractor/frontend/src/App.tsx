import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  return (
    <BrowserRouter basename="/leads">
      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          duration: 4000,
          className:
            '!rounded-xl !border !border-surface-200/80 !bg-white/95 !text-surface-900 !shadow-card !text-sm !font-medium dark:!border-slate-700 dark:!bg-slate-900/95 dark:!text-white',
          success: {
            iconTheme: { primary: '#4f46e5', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
