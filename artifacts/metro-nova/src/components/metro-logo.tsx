import { Scale } from 'lucide-react';

export function MetroLogo({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="flex items-center gap-3" data-testid="brand-metro-nova">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${inverse ? 'bg-[#f3c45f] text-[#182735]' : 'bg-[#182735] text-[#f3c45f]'}`}>
        <Scale size={21} strokeWidth={2.2} aria-hidden="true" />
      </div>
      <div className="leading-none">
        <div className={`font-mono text-[11px] font-bold uppercase tracking-[0.2em] ${inverse ? 'text-[#f3c45f]' : 'text-[#b87535]'}`}>Metro</div>
        <div className={`mt-1 text-lg font-bold tracking-[-0.03em] ${inverse ? 'text-[#f8f4eb]' : 'text-[#182735]'}`}>Nova</div>
      </div>
    </div>
  );
}