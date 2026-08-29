import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, Building2, Check, Eye, EyeOff, Factory, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { useLocation } from 'wouter';
import { MetroLogo } from '@/components/metro-logo';
import { useAuth } from '@/context/auth-context';
import type { UserRole } from '@/lib/auth-service';

type RoleOption = {
  role: UserRole;
  title: string;
  description: string;
  icon: typeof ShieldCheck;
  accent: string;
};

const roles: RoleOption[] = [
  {
    role: 'inspector',
    title: 'Enforcement Inspector',
    description: 'Inspect complaints, verify product labels and manage compliance inspections.',
    icon: ShieldCheck,
    accent: 'from-[#e1b45a] to-[#f1d38b]',
  },
  {
    role: 'admin',
    title: 'State Admin',
    description: 'Monitor statewide inspections, complaints and compliance analytics.',
    icon: Building2,
    accent: 'from-[#8aa8a0] to-[#bfd0c7]',
  },
  {
    role: 'consumer',
    title: 'Consumer / Complainant',
    description: 'Raise complaints and track the status of your complaint.',
    icon: UserRound,
    accent: 'from-[#c7815c] to-[#e1b08f]',
  },
  {
    role: 'manufacturer',
    title: 'Manufacturer / Producer',
    description: 'Check product labels and monitor product compliance.',
    icon: Factory,
    accent: 'from-[#7197af] to-[#aac3d0]',
  },
];

const dashboardPaths: Record<UserRole, string> = {
  inspector: '/inspector/dashboard',
  admin: '/admin/dashboard',
  consumer: '/consumer/dashboard',
  manufacturer: '/manufacturer/dashboard',
};

export default function Login() {
  const { user, signIn } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) setLocation(dashboardPaths[user.role]);
  }, [setLocation, user]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    if (!selectedRole) {
      setError('Please select your access type.');
      return;
    }
    const result = signIn(identifier, password, selectedRole, remember);
    if (!result.ok) {
      setError(result.error === 'mismatch'
        ? 'The selected access type does not match these credentials.'
        : 'Invalid User ID, email, mobile number or password.');
      return;
    }
    setError('');
    setLocation(dashboardPaths[result.user.role]);
  };

  const selectRole = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    setMessage('');
  };

  const selectedOption = roles.find((option) => option.role === selectedRole);
  const registrationText = selectedRole === 'consumer'
    ? 'Create Consumer Account'
    : selectedRole === 'manufacturer'
      ? 'Register as Manufacturer'
      : 'Access is provided by the department administrator.';

  return (
    <main className="min-h-[100dvh] bg-[#f2eee4] text-[#182735]">
      <div className="grid min-h-[100dvh] lg:grid-cols-[minmax(330px,0.82fr)_minmax(620px,1.18fr)]">
        <aside className="relative hidden overflow-hidden bg-[#182735] px-10 py-10 text-[#f8f4eb] lg:flex lg:flex-col lg:justify-between xl:px-16">
          <div className="absolute -right-24 top-24 h-72 w-72 rounded-full border border-[#f3c45f]/20 animate-soft-pulse" />
          <div className="absolute -left-28 bottom-28 h-64 w-64 rounded-full border border-[#94b5aa]/20" />
          <div className="relative">
            <MetroLogo inverse />
            <div className="mt-24 max-w-sm animate-rise-in">
              <div className="mb-5 flex items-center gap-3 text-[#f3c45f]">
                <span className="h-px w-9 bg-[#f3c45f]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.24em]">Field-ready compliance</span>
              </div>
              <h1 className="text-5xl font-bold leading-[1.02] tracking-[-0.055em] xl:text-6xl">
                Clarity at every measure.
              </h1>
              <p className="mt-7 max-w-xs text-[15px] leading-7 text-[#c9d1cd]">
                One trusted workspace for declarations, inspections, complaints, and enforcement under India&apos;s packaged commodities rules.
              </p>
            </div>
          </div>
          <div className="relative flex items-end justify-between gap-6 text-xs text-[#9eada8]">
            <span>Government compliance infrastructure</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em]">v1.0 / 2026</span>
          </div>
        </aside>

        <section className="flex flex-col">
          <header className="flex items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
            <div className="lg:hidden"><MetroLogo /></div>
            <div className="hidden text-right sm:block lg:ml-auto">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#7d8883]">Secure access portal</span>
            </div>
          </header>
          <div className="mx-auto w-full max-w-[790px] flex-1 px-5 pb-10 pt-3 sm:px-8 lg:px-12 lg:pt-14">
            <div className="animate-rise-in">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#b87535]">Welcome to Metro Nova</p>
              <h2 className="mt-4 max-w-2xl text-[clamp(2rem,4vw,3.65rem)] font-bold leading-[1.03] tracking-[-0.055em]">
                Legal Metrology Compliance Checker
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#66716e]">
                AI-assisted compliance verification for packaged commodities
              </p>
            </div>

            <div className="mt-11 animate-rise-in delay-100">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold tracking-[-0.02em]">Select your access</h3>
                  <p className="mt-1 text-sm text-[#78827e]">Choose how you want to access Metro Nova.</p>
                </div>
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.15em] text-[#9ca49f] sm:block">01 / 04</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {roles.map(({ role, title, description, icon: Icon, accent }, index) => {
                  const selected = selectedRole === role;
                  return (
                    <button
                      type="button"
                      key={role}
                      aria-pressed={selected}
                      data-testid={`button-role-${role}`}
                      onClick={() => selectRole(role)}
                      className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 ${selected ? 'border-[#b87535] bg-[#fffaf0] shadow-[0_8px_24px_rgba(91,72,42,0.1)]' : 'border-[#ddd7ca] bg-[#f9f6ef] hover:border-[#b8ae9c] hover:bg-[#fffaf2]'}`}
                    >
                      <div className={`absolute right-0 top-0 h-20 w-20 rounded-bl-[3rem] bg-gradient-to-br ${accent} opacity-25 transition-opacity ${selected ? 'opacity-45' : 'group-hover:opacity-35'}`} />
                      <div className="relative flex items-start gap-3.5">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${selected ? 'bg-[#182735] text-[#f3c45f]' : 'bg-[#e9e3d6] text-[#586762]'}`}>
                          <Icon size={18} strokeWidth={2} aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-2 text-[14px] font-bold text-[#263943]">
                            {title}
                            {selected && <Check size={15} className="text-[#b87535]" strokeWidth={3} aria-hidden="true" />}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-[#727b76]">{description}</span>
                        </span>
                      </div>
                      <span className="absolute bottom-4 right-4 font-mono text-[10px] text-[#a6aaa2]">0{index + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="my-9 h-px bg-[#ddd7ca]" />

            <form onSubmit={handleSubmit} className="animate-rise-in delay-200" noValidate>
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-[#f3c45f]" />
                <div>
                  <h3 className="text-lg font-bold tracking-[-0.02em]">{selectedOption ? `Sign in as ${selectedOption.title}` : 'Sign in to continue'}</h3>
                  <p className="mt-0.5 text-sm text-[#78827e]">Use your registered email, User ID, or Indian mobile number.</p>
                </div>
              </div>

              <div className="mx-auto mt-6 max-w-[620px]">
                   <label htmlFor="identifier" className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-[#52605d]">Email, User ID or Mobile Number</label>
                <div className="relative">
                  <UserRound size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#84908a]" aria-hidden="true" />
                  <input
                    id="identifier"
                    data-testid="input-identifier"
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                     placeholder="Enter your registered email, User ID or mobile number"
                    autoComplete="username"
                    className="h-12 w-full rounded-xl border border-[#d6d0c3] bg-[#fbf9f4] pl-11 pr-4 text-sm text-[#182735] shadow-sm outline-none transition focus:border-[#b87535] focus:ring-2 focus:ring-[#f3c45f]/35"
                  />
                </div>
                <label htmlFor="password" className="mb-2 mt-5 block text-xs font-bold uppercase tracking-[0.1em] text-[#52605d]">Password</label>
                <div className="relative">
                  <LockKeyhole size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#84908a]" aria-hidden="true" />
                  <input
                    id="password"
                    data-testid="input-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-12 w-full rounded-xl border border-[#d6d0c3] bg-[#fbf9f4] pl-11 pr-12 text-sm text-[#182735] shadow-sm outline-none transition focus:border-[#b87535] focus:ring-2 focus:ring-[#f3c45f]/35"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    data-testid="button-toggle-password"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 rounded-lg p-2 text-[#687671] hover:bg-[#eee8dc] hover:text-[#182735]"
                  >
                    {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-[#66716e]">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(event) => setRemember(event.target.checked)}
                      data-testid="input-remember-me"
                      className="h-4 w-4 accent-[#182735]"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    data-testid="button-forgot-password"
                    onClick={() => { setMessage('Please contact your department administrator to reset access.'); setError(''); }}
                    className="text-sm font-bold text-[#9c5e2b] underline decoration-[#d9ae72] underline-offset-4 hover:text-[#182735]"
                  >
                    Forgot password?
                  </button>
                </div>
                {error && <p role="alert" data-testid="status-login-error" className="mt-5 rounded-xl border border-[#e4b6ab] bg-[#fff1ed] px-4 py-3 text-sm font-medium text-[#a53e32]">{error}</p>}
                {message && <p role="status" data-testid="status-login-message" className="mt-5 rounded-xl border border-[#c5d8cd] bg-[#eff7f1] px-4 py-3 text-sm font-medium text-[#37654e]">{message}</p>}
                <div className="mt-6 flex justify-center">
                  <button
                    type="submit"
                    data-testid="button-sign-in"
                    className="group inline-flex h-11 items-center gap-3 rounded-xl bg-[#182735] px-7 text-sm font-bold text-[#fbf8f0] shadow-[0_8px_16px_rgba(24,39,53,0.16)] transition hover:-translate-y-0.5 hover:bg-[#263e4c] active:translate-y-0"
                  >
                    Sign In
                    <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-9 border-t border-[#ddd7ca] pt-5 text-center animate-rise-in delay-300">
              {selectedRole === 'consumer' || selectedRole === 'manufacturer' ? (
                <p className="text-sm text-[#77817c]">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    data-testid="button-registration"
                    onClick={() => setMessage(registrationText)}
                    className="font-bold text-[#9c5e2b] underline decoration-[#d9ae72] underline-offset-4 hover:text-[#182735]"
                  >
                    {registrationText}
                  </button>
                </p>
              ) : (
                <p data-testid="text-department-access" className="text-sm text-[#77817c]">
                  Access is provided by the department administrator.
                </p>
              )}
            </div>
          </div>
          <footer className="border-t border-[#ddd7ca] px-5 py-5 text-center text-[11px] text-[#88918c] sm:px-8 lg:px-12 lg:text-left">
            <div className="flex flex-col justify-between gap-1 sm:flex-row">
              <span data-testid="text-footer-product">Metro Nova • Legal Metrology Compliance Checker</span>
              <span data-testid="text-footer-copyright">© 2026 Compliance &amp; Enforcement Platform</span>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}