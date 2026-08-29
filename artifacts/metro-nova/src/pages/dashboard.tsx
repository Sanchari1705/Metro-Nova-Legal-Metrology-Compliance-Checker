import { useState } from 'react';
import { Activity, Bell, ClipboardCheck, FileSearch, LogOut, Menu, Plus, Search, Settings2, ShieldCheck, Users, X } from 'lucide-react';
import { useLocation } from 'wouter';
import { MetroLogo } from '@/components/metro-logo';
import { useAuth } from '@/context/auth-context';
import type { UserRole } from '@/lib/auth-service';

const dashboardCopy: Record<UserRole, { label: string; heading: string; summary: string; action: string; stats: { label: string; value: string; note: string }[] }> = {
  inspector: {
    label: 'Enforcement Inspector',
    heading: 'Welcome to Inspector Dashboard',
    summary: 'Your field queue and recent compliance activity, in one place.',
    action: 'Start inspection',
    stats: [
      { label: 'Open inspections', value: '12', note: '3 due today' },
      { label: 'Verified this month', value: '47', note: '+8 from last month' },
      { label: 'Pending actions', value: '06', note: 'Requires review' },
    ],
  },
  admin: {
    label: 'State Admin',
    heading: 'Welcome to State Admin Dashboard',
    summary: 'Monitor compliance coverage and coordinate your enforcement teams.',
    action: 'Review activity',
    stats: [
      { label: 'Active inspectors', value: '128', note: 'Across 14 districts' },
      { label: 'Checks this month', value: '2,416', note: '+12.4% from last month' },
      { label: 'Escalations', value: '18', note: '4 need attention' },
    ],
  },
  consumer: {
    label: 'Consumer / Complainant',
    heading: 'Welcome to Consumer Dashboard',
    summary: 'Check a package declaration or follow up on a complaint.',
    action: 'Check a package',
    stats: [
      { label: 'Checks submitted', value: '08', note: 'Since joining' },
      { label: 'Open complaints', value: '02', note: '1 updated today' },
      { label: 'Saved products', value: '14', note: 'Your watchlist' },
    ],
  },
  manufacturer: {
    label: 'Manufacturer / Producer',
    heading: 'Welcome to Manufacturer Dashboard',
    summary: 'Review declarations, resolve findings, and maintain product records.',
    action: 'Add product',
    stats: [
      { label: 'Registered products', value: '36', note: '4 updated this week' },
      { label: 'Compliance score', value: '94.6', note: 'Across active SKUs' },
      { label: 'Open findings', value: '03', note: '2 due this week' },
    ],
  },
};

const rolePaths: Record<UserRole, string> = {
  inspector: '/inspector/dashboard',
  admin: '/admin/dashboard',
  consumer: '/consumer/dashboard',
  manufacturer: '/manufacturer/dashboard',
};

export default function Dashboard({ role }: { role: UserRole }) {
  const { user, signOut } = useAuth();
  const [, setLocation] = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const copy = dashboardCopy[role];

  const logout = () => {
    signOut();
    setLocation('/login');
  };

  const navItems = role === 'inspector'
    ? [['Overview', Activity], ['Inspections', ClipboardCheck], ['Compliance checks', FileSearch]]
    : role === 'admin'
      ? [['Overview', Activity], ['Enforcement teams', Users], ['Reports', FileSearch]]
      : role === 'consumer'
        ? [['Overview', Activity], ['Package checker', ClipboardCheck], ['My complaints', FileSearch]]
        : [['Overview', Activity], ['Product register', ClipboardCheck], ['Findings', FileSearch]];

  return (
    <div className="flex min-h-[100dvh] bg-[#f2eee4] text-[#182735]">
      <aside className={`fixed inset-y-0 left-0 z-30 w-[270px] bg-[#182735] px-5 py-6 text-[#f8f4eb] transition-transform duration-200 lg:static lg:translate-x-0 ${navOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <MetroLogo inverse />
          <button type="button" aria-label="Close navigation" data-testid="button-close-navigation" onClick={() => setNavOpen(false)} className="rounded-lg p-2 text-[#c9d1cd] hover:bg-[#263e4c] lg:hidden"><X size={18} /></button>
        </div>
        <div className="mt-10 rounded-xl border border-[#38505c] bg-[#203542] px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.17em] text-[#9eb1aa]">Signed in as</p>
          <p className="mt-1 text-sm font-bold text-[#f8f4eb]">{copy.label}</p>
        </div>
        <nav className="mt-8 space-y-1" aria-label="Primary navigation">
          {navItems.map(([label, Icon], index) => (
            <button
              type="button"
              key={label as string}
              data-testid={`button-nav-${String(label).toLowerCase().replaceAll(' ', '-')}`}
              onClick={() => { setNavOpen(false); setNotice(`${label} is ready for your next action.`); }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${index === 0 ? 'bg-[#f3c45f] font-bold text-[#182735]' : 'text-[#bfcbc6] hover:bg-[#263e4c] hover:text-[#f8f4eb]'}`}
            >
              <Icon size={17} aria-hidden="true" />
              {label as string}
            </button>
          ))}
        </nav>
        <div className="mt-auto hidden border-t border-[#38505c] pt-5 lg:block">
          <button type="button" data-testid="button-sidebar-settings" onClick={() => setNotice('Account settings will be available from your profile.')} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#bfcbc6] hover:bg-[#263e4c] hover:text-[#f8f4eb]"><Settings2 size={17} /> Account settings</button>
          <button type="button" data-testid="button-sidebar-logout" onClick={logout} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-[#f1bdad] hover:bg-[#5e3540]"><LogOut size={17} /> Sign out</button>
        </div>
      </aside>
      {navOpen && <button aria-label="Close menu overlay" data-testid="button-menu-overlay" type="button" onClick={() => setNavOpen(false)} className="fixed inset-0 z-20 bg-[#182735]/40 lg:hidden" />}
      <div className="min-w-0 flex-1">
        <header className="flex h-[76px] items-center justify-between border-b border-[#ddd7ca] bg-[#f9f6ef] px-5 sm:px-8 lg:px-10">
          <button type="button" aria-label="Open navigation" data-testid="button-open-navigation" onClick={() => setNavOpen(true)} className="rounded-xl p-2 text-[#52605d] hover:bg-[#ebe5d9] lg:hidden"><Menu size={21} /></button>
          <div className="hidden items-center gap-2 text-xs text-[#7d8883] sm:flex"><span className="h-2 w-2 rounded-full bg-[#79a88f]" /> Systems operational</div>
          <div className="ml-auto flex items-center gap-4">
            <button type="button" aria-label="Notifications" data-testid="button-notifications" onClick={() => setNotice('You are all caught up.')} className="relative rounded-xl p-2 text-[#66716e] hover:bg-[#ebe5d9]"><Bell size={19} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#b87535]" /></button>
            <div className="hidden h-7 w-px bg-[#ddd7ca] sm:block" />
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#dce5df] text-xs font-bold text-[#385b4c]">{user?.displayName.slice(0, 2).toUpperCase() ?? 'MN'}</div>
              <span className="hidden text-sm font-bold text-[#34464c] sm:block">{user?.displayName}</span>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1250px] px-5 py-8 sm:px-8 lg:px-10 lg:py-11">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#b87535]">Dashboard / {role}</p>
              <h1 className="mt-3 text-3xl font-bold tracking-[-0.045em] sm:text-4xl">{copy.heading}</h1>
              <p className="mt-2 text-sm text-[#707b76]">{copy.summary}</p>
            </div>
            <button type="button" data-testid="button-primary-dashboard-action" onClick={() => setNotice(`${copy.action} will open when this workspace is connected to your department records.`)} className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#182735] px-5 text-sm font-bold text-[#fbf8f0] shadow-[0_7px_16px_rgba(24,39,53,0.14)] transition hover:-translate-y-0.5 hover:bg-[#263e4c]"><Plus size={17} /> {copy.action}</button>
          </div>
          {notice && <p role="status" data-testid="status-dashboard-notice" className="mt-5 rounded-xl border border-[#c5d8cd] bg-[#eff7f1] px-4 py-3 text-sm font-medium text-[#37654e]">{notice}</p>}
          <section className="mt-9 grid gap-4 md:grid-cols-3">
            {copy.stats.map((stat, index) => (
              <div key={stat.label} data-testid={`card-stat-${index}`} className="rounded-2xl border border-[#ddd7ca] bg-[#f9f6ef] p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-[#74807b]">{stat.label}</p>
                  <span className={`h-2 w-2 rounded-full ${index === 2 ? 'bg-[#d49176]' : index === 1 ? 'bg-[#89ad9a]' : 'bg-[#e2b758]'}`} />
                </div>
                <p className="mt-4 font-mono text-3xl font-bold tracking-[-0.06em] text-[#182735]">{stat.value}</p>
                <p className="mt-2 text-xs text-[#8a938e]">{stat.note}</p>
              </div>
            ))}
          </section>
          <section className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="min-h-[260px] rounded-2xl border border-[#ddd7ca] bg-[#f9f6ef] p-5 sm:p-7">
              <div className="flex items-start justify-between">
                <div><h2 className="font-bold tracking-[-0.02em]">Recent activity</h2><p className="mt-1 text-xs text-[#87918c]">The latest changes in your workspace</p></div>
                <button type="button" data-testid="button-search-activity" aria-label="Search recent activity" onClick={() => setNotice('Activity search will be available once records are added.')} className="rounded-lg p-2 text-[#7b8580] hover:bg-[#ebe5d9]"><Search size={17} /></button>
              </div>
              <div className="mt-8 flex min-h-[130px] flex-col items-center justify-center rounded-xl border border-dashed border-[#d4cec1] bg-[#f5f1e8] text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6ece7] text-[#517261]"><ShieldCheck size={19} /></div>
                <p className="mt-3 text-sm font-bold text-[#455754]">Your activity will appear here</p>
                <p className="mt-1 max-w-xs text-xs leading-5 text-[#89928c]">Complete your first action to start building a clear compliance record.</p>
              </div>
            </div>
            <div className="rounded-2xl bg-[#dce5df] p-6 text-[#243d3b]">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f3c45f] text-[#182735]"><ShieldCheck size={18} /></div>
              <p className="mt-9 font-mono text-[10px] font-bold uppercase tracking-[0.17em] text-[#52736a]">Metro Nova guidance</p>
              <h2 className="mt-3 text-xl font-bold leading-tight tracking-[-0.03em]">Good records make fair markets.</h2>
              <p className="mt-3 text-sm leading-6 text-[#557069]">Keep declarations, checks, and follow-ups together so every decision can be understood.</p>
            </div>
          </section>
          <button type="button" data-testid="button-mobile-logout" onClick={logout} className="mt-8 flex items-center gap-2 text-sm font-bold text-[#9c5e2b] lg:hidden"><LogOut size={16} /> Sign out</button>
        </main>
      </div>
    </div>
  );
}