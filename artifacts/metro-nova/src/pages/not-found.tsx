import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'wouter';
import { MetroLogo } from '@/components/metro-logo';

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col bg-[#f2eee4] text-[#182735]">
      <header className="px-5 py-6 sm:px-10"><MetroLogo /></header>
      <section className="m-auto max-w-xl px-6 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#dce5df] text-[#385b4c]"><Compass size={30} /></div>
        <p className="mt-8 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#b87535]">Route not found / 404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">This path is off the map.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#707b76]">The page you are looking for may have moved, or the address may be incomplete.</p>
        <Link href="/login" data-testid="link-return-to-login" className="mx-auto mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-[#182735] px-5 text-sm font-bold text-[#fbf8f0] transition hover:bg-[#263e4c]"><ArrowLeft size={17} /> Return to sign in</Link>
      </section>
      <footer className="px-5 py-6 text-center text-[11px] text-[#88918c] sm:px-10 sm:text-left">Metro Nova • Legal Metrology Compliance Checker</footer>
    </main>
  );
}
