import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './providers/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import AppShellLayout from './components/AppShell';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Comuneros from './pages/Comuneros';
import ComuneroForm from './pages/ComuneroForm';
import Territories from './pages/Territories';
import TerritoryForm from './pages/TerritoryForm';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute><AppShellLayout /></ProtectedRoute>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/comuneros" element={<Comuneros />} />
              <Route path="/comuneros/new" element={<ComuneroForm />} />
              <Route path="/comuneros/:id/edit" element={<ComuneroForm />} />
              <Route path="/territories" element={<Territories />} />
              <Route path="/territories/new" element={<TerritoryForm />} />
              <Route path="/territories/:id/edit" element={<TerritoryForm />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
