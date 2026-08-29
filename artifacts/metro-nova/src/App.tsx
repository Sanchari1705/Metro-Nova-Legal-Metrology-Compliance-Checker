import { useEffect, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider, useAuth } from '@/context/auth-context';
import type { UserRole } from '@/lib/auth-service';
import Dashboard from '@/pages/dashboard';
import Login from '@/pages/login';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

const dashboardPaths: Record<UserRole, string> = {
  inspector: '/inspector/dashboard',
  admin: '/admin/dashboard',
  consumer: '/consumer/dashboard',
  manufacturer: '/manufacturer/dashboard',
};

function ProtectedDashboard({ role }: { role: UserRole }) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  useEffect(() => {
    if (!user) setLocation('/login');
    else if (user.role !== role) setLocation(dashboardPaths[user.role]);
  }, [role, setLocation, user]);
  if (!user || user.role !== role) return null;
  return <Dashboard role={role} />;
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/inspector/dashboard"><ProtectedDashboard role="inspector" /></Route>
        <Route path="/admin/dashboard"><ProtectedDashboard role="admin" /></Route>
        <Route path="/consumer/dashboard"><ProtectedDashboard role="consumer" /></Route>
        <Route path="/manufacturer/dashboard"><ProtectedDashboard role="manufacturer" /></Route>
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
