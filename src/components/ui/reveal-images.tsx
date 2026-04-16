import { useEffect, useState, type KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

export interface ImageSource {
  src: string;
  alt: string;
}

export interface RevealImageListItemProps {
  num:    string;
  text:   string;
  desc:   string;
  images: [ImageSource, ImageSource];
}

function hoverCapableClient(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

function RevealImageListItem({ num, text, desc, images }: RevealImageListItemProps) {
  const [hoverCapable, setHoverCapable] = useState(hoverCapableClient);
  const [touchOpen, setTouchOpen]       = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const apply = () => setHoverCapable(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const imgContainer = cn(
    'absolute right-6 z-40 h-32 w-28 pointer-events-none md:right-10 md:h-40 md:w-36',
    hoverCapable
      ? 'top-10 md:top-14'
      : touchOpen
        ? 'bottom-8 top-auto'
        : 'top-10',
  );

  const revealInner = cn(
    'relative shadow-none overflow-hidden rounded-sm',
    'transition-all duration-500 delay-100',
    'w-24 h-24 md:w-28 md:h-28',
    hoverCapable
      ? cn(
          'scale-0 opacity-0',
          'group-hover:scale-100 group-hover:opacity-100',
          'group-hover:shadow-2xl group-hover:w-full group-hover:h-full',
        )
      : cn(
          touchOpen
            ? 'scale-100 opacity-100 shadow-2xl w-[88vw] max-w-[340px] h-44 sm:h-48'
            : 'scale-0 opacity-0',
        ),
  );

  const revealInnerFront = cn(revealInner, 'duration-200');

  const stackFront = cn(
    imgContainer,
    'transition-all delay-150 duration-500',
       hoverCapable
      ? 'group-hover:translate-x-8 group-hover:translate-y-8 group-hover:rotate-12'
      : touchOpen && 'translate-x-5 translate-y-5 rotate-12',
  );

  const titleMuted = hoverCapable ? 'group-hover:opacity-40' : touchOpen && 'opacity-40';

  const onActivate = () => {
    if (!hoverCapable) setTouchOpen((v) => !v);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (!hoverCapable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setTouchOpen((v) => !v);
    }
  };

  return (
    <div
      className={cn(
        'group relative w-full overflow-visible border-b',
        hoverCapable ? 'cursor-default' : 'cursor-pointer',
        !hoverCapable && touchOpen && 'min-h-[300px] sm:min-h-[280px]',
      )}
      style={{ borderColor: 'var(--border-dim)' }}
      onClick={onActivate}
      onKeyDown={onKeyDown}
      role={hoverCapable ? undefined : 'button'}
      tabIndex={hoverCapable ? undefined : 0}
      aria-expanded={hoverCapable ? undefined : touchOpen}
    >
      <div
        className={cn(
          'flex flex-col gap-6 md:flex-row md:items-baseline md:justify-between',
          'md:gap-12 lg:gap-16',
          'py-[4.5rem] md:py-20 lg:py-28 px-2 transition-all duration-300',
        )}
      >
        <div className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-baseline md:gap-12 lg:gap-16 min-w-0 flex-1">
          <span
            className="text-xs tracking-widest flex-shrink-0 transition-colors duration-300 md:min-w-[2.5rem]"
            style={{
              fontFamily:    'var(--font-sans)',
              color:         'var(--gold-dim)',
              letterSpacing: '0.15em',
            }}
          >
            {num}
          </span>

          <span
            className={cn('transition-all duration-500 leading-[1.15] md:leading-[1.1] block', titleMuted)}
            style={{
              fontFamily:    'var(--font-serif)',
              fontSize:      'clamp(2rem, 5vw, 3.75rem)',
              fontWeight:   300,
              color:         'var(--white)',
              letterSpacing: '-0.01em',
            }}
          >
            {text}
          </span>
        </div>

        {/* وصف — ديسكتوب: hover فقط */}
        {hoverCapable && (
          <span
            className="hidden md:block text-right max-w-[28ch] text-sm leading-[1.75] opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 flex-shrink-0"
            style={{ color: 'var(--white-dim)', fontWeight: 300 }}
          >
            {desc}
          </span>
        )}
      </div>

      {/* وصف — موبايل: يظهر مع فتح اللمس */}
      {!hoverCapable && (
        <div
          className={cn(
            'px-2 overflow-hidden transition-all duration-500 md:hidden',
            touchOpen ? 'max-h-[min(28rem,70vh)] opacity-100 mb-3' : 'max-h-0 opacity-0',
          )}
        >
          <p
            className="text-sm leading-[1.75] pt-1"
            style={{ color: 'var(--white-dim)', fontWeight: 300 }}
          >
            {desc}
          </p>
        </div>
      )}

      <div className={imgContainer}>
        <div className={revealInner}>
          <img
            src={images[1].src}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover pointer-events-none"
          />
        </div>
      </div>
      <div className={stackFront}>
        <div className={revealInnerFront}>
          <img
            src={images[0].src}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}

export function RevealImageList({ items }: { items: RevealImageListItemProps[] }) {
  return (
    <div className="w-full">
      {items.map((item, index) => (
        <RevealImageListItem key={index} {...item} />
      ))}
    </div>
  );
}
